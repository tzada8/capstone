from os import environ
from typing import Dict, List
import requests
import re

class Recommendation:
    @staticmethod
    def _scrape_bestbuy() -> List:
        params = {
            "category_id": "abcat0401000", # Digital cameras category id
            "api_key": environ.get("BESTBUY_API_KEY"), 
        }
        # Get top 10 trending products in category.
        trending_results = requests.get(f"https://api.bestbuy.com/v1/products/trendingViewed(categoryId={params.get('category_id')})?apiKey={params.get('api_key')}")
        trending = trending_results.json()
        # Get top 10 most popular products in category.
        most_popular_results = requests.get(f"https://api.bestbuy.com/v1/products/mostViewed(categoryId={params.get('category_id')})?apiKey={params.get('api_key')}")
        most_popular = most_popular_results.json()

        if len(trending.get("results")) == 0 or len(most_popular.get("results")) == 0:
            return [{}, len(trending.get("results")), len(most_popular.get("results"))]
        else:
            max_rank = int(((len(trending.get("results")) + len(most_popular.get("results"))) / 2) + 1)
            # Combine two lists into one.
            master_list = {}
            for t in trending.get("results"):
                master_list[t.get("sku")] = t.get("rank") + max_rank
            for p in most_popular.get("results"):
                if p.get("sku") in master_list.keys():
                    master_list[p.get("sku")] = master_list.get(p.get("sku")) - max_rank + p.get("rank")
                else:
                    master_list[p.get("sku")] = p.get("rank") + max_rank
            # Change SKU to UPC.
            skus = ""
            for sku in master_list.keys():
                skus += sku + ","
            search = requests.get(f"https://api.bestbuy.com/v1/products(sku in({skus}))?apiKey={params.get('api_key')}&show=sku,upc&pageSize=20&format=json")
            results = search.json()
            if "error" in results or results.get("total") == 0:
                return [{}, len(trending.get("results")), len(most_popular.get("results"))]
            else:
                pairs = results.get("products", {})           
                upc_master_list = {}
                for pair in pairs:
                    upc_master_list[pair.get("upc")] = master_list.get(str(pair.get("sku")))
                return [upc_master_list, len(trending.get("results")), len(most_popular.get("results"))]

    @staticmethod
    def _model(preferences: Dict, importance: Dict, selected_products: List, master_list: Dict, max_list_length: int) -> List:
        importance_inv = {v: int(k) for k, v in importance.items()}
        max_rank = len(selected_products) + 1
        max_master_list_rank = max_list_length + 2
        recommendations = []
        
        for p in selected_products:
            # Finalize product ranks.
            rank = 0
            # Ranks for Best Buy are multiplied by 2 to be in the same range as Walmart ranks.
            if p.get("basic_info").get("source") == "Best Buy":
                rank = 2 if p.get("basic_info").get("badges").get("top_rated") == True else max_rank * 2
            if p.get("basic_info").get("source") == "Walmart":
                rank = 1 if p.get("basic_info").get("badges").get("bestseller") == True else max_rank
                rank = rank + 1 if p.get("basic_info").get("badges").get("customer_pick") == True else rank + max_rank
            upc = p.get("basic_info").get("upc")
            rank = rank + int(master_list.get(upc)) if upc in master_list.keys() else rank + max_master_list_rank

            # Get proper feature keys.
            if p.get("basic_info").get("source") == "Best Buy":
                pixels_key = "Effective Pixels"
                lens_type_key = "Lens Type"
            if p.get("basic_info").get("source") == "Walmart":
                pixels_key = "Number of Megapixels"
                lens_type_key = "Camera Lens Type"

            # Get actual feature values of product.
            brand = list(filter(lambda spec: spec["name"] == "Brand", p.get("specifications")))
            actual_brand = "" if len(brand) == 0 or brand[0].get("value") == "" else brand[0].get("value")

            megapixels = list(filter(lambda spec: spec["name"] == pixels_key, p.get("specifications")))
            actual_megapixels = 0 if len(megapixels) == 0 or megapixels[0].get("value") == "" else int(re.findall(r'\d+', megapixels[0].get("value"))[0])

            lens_type = list(filter(lambda spec: spec["name"] == lens_type_key, p.get("specifications")))
            actual_lens_type = "" if len(lens_type) == 0 or lens_type[0].get("value") == "" else lens_type[0].get("value")

            camera_type = list(filter(lambda spec: spec["name"] == "Digital Camera Type", p.get("specifications")))
            actual_camera_type = "" if len(camera_type) == 0 or camera_type[0].get("value") == "" else camera_type[0].get("value")

            actual_price = 10000.00 if p.get("basic_info").get("price").get("amount") is None else float(p.get("basic_info").get("price", {}).get("amount"))
            # Best Buy Point & Shoot Cameras do not have a lens type feature
            actual_lens_type = "Fixed" if p.get("basic_info").get("source") == "Best Buy" and actual_camera_type == "Point and Shoot Cameras" else actual_lens_type

            # Calculate difference between actual and desired values. 
            # TODO: Verify all answer options!
            # Brand: [Canon, Nikon, Other]
            if preferences.get("brand") in ["Canon", "Nikon"]:
                brand_diff = 0 if actual_brand == preferences.get("brand") else 1
            elif preferences.get("brand") == "Other":
                brand_diff = 0 if actual_brand not in ["Canon", "Nikon"] else 1
            else: # If no option is selected.
                brand_diff = 0

            # Megapixels: [<15, 15-30, 30-45, >45]
            # TODO: More megapixels are better?
            if preferences.get("megapixels") is None: # If no option is selected.
                lower_bound = 0
                upper_bound = 10000
            elif "-" in preferences.get("megapixels"):
                lower_bound = int(preferences.get("megapixels")[:preferences.get("megapixels").index("-")])
                upper_bound = int(preferences.get("megapixels")[preferences.get("megapixels").index("-") + 1:])
            elif "<" in preferences.get("megapixels"):
                lower_bound = 1
                upper_bound = int(preferences.get("megapixels")[preferences.get("megapixels").index("<") + 1:])
            elif ">" in preferences.get("megapixels"):
                lower_bound = int(preferences.get("megapixels")[:preferences.get("megapixels").index(">")])
                upper_bound = 10000
            if actual_megapixels >= lower_bound and actual_megapixels <= upper_bound:
                megapixels_diff = 0
            else:
                megapixels_diff = 1

            # Lens: [Fixed, Standard, Other]
            # TODO: Check if Walmart works with this. (Fixed = Digital Zoom)
            if preferences.get("lens_type") in ["Fixed", "Standard"]: 
                lens_type_diff = 0 if preferences.get("lens_type") in actual_lens_type else 1
            elif preferences.get("lens_type") == "Other":
                lens_type_diff = 0 if actual_lens_type not in ["Fixed", "Standard"] else 1
            else: # If no option is selected.
                lens_type_diff = 0

            # Camera Type: [Point and Shoot, DSLR, Mirrorless, Other]
            # TODO: Check this more with potential types from Best Buy and Walmart.
            if preferences.get("camera_type") in ["Point and Shoot", "DSLR", "Mirrorless"]: 
                camera_type_diff = 0 if preferences.get("camera_type").split(' ', 1)[0] in actual_camera_type else 1
            elif preferences.get("camera_type") == "Other":
                camera_type_diff = 0 if actual_camera_type.split(' ', 1)[0] not in ["Point", "DSLR", "Mirrorless"] else 1
            else: # If no option is selected.
                camera_type_diff = 0

            # Budget: [<750, 750-1500, >1500]
            if preferences.get("budget") is None: # If no option is selected.
                upper_bound = 10000
            elif "-" in preferences.get("budget"):
                upper_bound = int(preferences.get("budget")[preferences.get("budget").index("-") + 1:])
            elif "<" in preferences.get("budget"):
                upper_bound = int(preferences.get("budget")[preferences.get("budget").index("<") + 1:])
            else: # >1500
                upper_bound = 10000
            if actual_price <= upper_bound:
                price_diff = 0
            else:
                price_diff = 1

            # Calculate weights of each feature.
            weights = {
                "brand": brand_diff * importance_inv.get("brand"),
                "megapixels": megapixels_diff * importance_inv.get("megapixels"),
                "lens_type": lens_type_diff * importance_inv.get("lens_type"),
                "camera_type": camera_type_diff * importance_inv.get("camera_type"),
                "budget": price_diff * importance_inv.get("budget"),
            }
            # Sum all weights.
            pref_score = sum(weights.values())

            # TODO: Verify the weights.
            rank_weight = 0.25
            pref_weight = 0.75
            worst_score = pref_weight * sum(range(1, 6)) + rank_weight * (max_master_list_rank + max_rank * 2)

            # Prepare all products for table.
            recommendations.append({
                "product_id": p.get("basic_info").get("product_id"),
                "title": p.get("basic_info").get("title"),
                "price": p.get("basic_info").get("price").get("amount"),
                "source": p.get("basic_info").get("source"),
                "score": round((1 - ((rank * rank_weight + pref_score * pref_weight) / worst_score)) * 5, 2),
            })

        # Sort list by descending score.
        return sorted(recommendations, key = lambda d: d['score'], reverse = True)

    @staticmethod
    def aggregate_data(preferences: Dict, importance: Dict, selected_products: List) -> List:
        master_list = Recommendation._scrape_bestbuy()
        list = Recommendation._model(preferences, importance, selected_products, master_list[0], master_list[1] + master_list[2])
        return list
