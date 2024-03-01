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
    def _extract_product_features(product: Dict, key: str, return_value):
        filtered = list(filter(lambda spec: spec["name"] == key, product.get("specifications")))
        if len(filtered) == 0:
            return return_value
        else:
            if key in ["Effective Pixels", "Number of Megapixels"]:
                result = re.findall(r'\d+\.?\d+?', filtered[0].get("value"))
                if len(result) > 0:
                    return float(result[0])
                else:
                    return return_value
            elif key in ["Lens Type", "Camera Lens Type"]:
                if not isinstance(filtered[0].get("value"), list):
                    lenses_list = [filtered[0].get("value")]
                else:
                    lenses_list = filtered[0].get("value")
                types = []
                for type in lenses_list:
                    if "Standard Zoom" in type or "Zoom Lens" in type or "EF-S-Mount" in type:
                        types.append("standard")
                    elif "Zoom" in type or "Digital Zoom" in type:
                        types.append("fixed")
                    else:
                        types.append(type.lower())
                return types
            elif key == "Digital Camera Type":
                return filtered[0].get("value").lower().replace(" ", "-")
            else:
                return filtered[0].get("value").lower()

    @staticmethod
    def _extract_price(product: Dict):
        if product.get("basic_info").get("price").get("amount") is None:
            return 10000.00
        else:
            return float(product.get("basic_info").get("price", {}).get("amount"))

    @staticmethod
    def _model(preferences: Dict, importance: Dict, selected_products: List, master_list: Dict, max_list_length: int) -> List:
        max_rank = len(selected_products) + 1
        max_master_list_rank = max_list_length + 2
        recommendations = []
        NUM_FEATURES = 6
    
        # Prepare importance dictionary.
        importance_inv = {v: float(k) for k, v in importance.items() if v != ""}
        if len(importance_inv) != NUM_FEATURES:
            features = {"brand", "megapixels", "lens_type", "camera_type", "budget", "product_rating"}
            ranked_features = {v for v in importance.values()}
            unranked_features = features - ranked_features
            sum_no_value = 0
            for key, value in importance.items():
                if value == "":
                    sum_no_value += int(key)
            for f in unranked_features:
                importance_inv[f] = sum_no_value / len(unranked_features)            
        
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
                megapixels_key = "Effective Pixels"
                lens_type_key = "Lens Type"
            if p.get("basic_info").get("source") == "Walmart":
                megapixels_key = "Number of Megapixels"
                lens_type_key = "Camera Lens Type"

            # Get actual feature values of product.
            actual_brand = Recommendation._extract_product_features(p, "Brand", "")
            actual_megapixels = Recommendation._extract_product_features(p, megapixels_key, 0.0)
            actual_lens_type = Recommendation._extract_product_features(p, lens_type_key, [])
            actual_camera_type = Recommendation._extract_product_features(p, "Digital Camera Type", "")
            actual_price = Recommendation._extract_price(p)

            # Point & Shoot and Compact Cameras have fixed lenses
            if "point-and-shoot" in actual_camera_type or "compact" in actual_camera_type:
                actual_lens_type.append("fixed")

            # Calculate difference between actual and desired values. 
            # Brand: ["canon", "nikon", ""]
            if preferences.get("brand") in ["canon", "nikon"]:
                brand_diff = 0 if actual_brand == preferences.get("brand") else 1
            else: # If no preference.
                brand_diff = 0

            # Megapixels: ["<15", "15-30", "30-45", ">45", ""]
            # TODO: More megapixels are better?
            if "-" in preferences.get("megapixels"):
                lower_bound = int(preferences.get("megapixels")[:preferences.get("megapixels").index("-")])
                upper_bound = int(preferences.get("megapixels")[preferences.get("megapixels").index("-") + 1:])
            elif "<" in preferences.get("megapixels"):
                lower_bound = 1
                upper_bound = int(preferences.get("megapixels")[preferences.get("megapixels").index("<") + 1:])
            elif ">" in preferences.get("megapixels"):
                lower_bound = int(preferences.get("megapixels")[:preferences.get("megapixels").index(">")])
                upper_bound = 10000
            else: # If no preference.
                lower_bound = 0
                upper_bound = 10000
            if actual_megapixels >= lower_bound and actual_megapixels <= upper_bound:
                megapixels_diff = 0
            else:
                megapixels_diff = 1

            # Lens: ["fixed", "standard", ""]
            if preferences.get("lens_type") in ["fixed", "standard"]: 
                if preferences.get("lens_type") in actual_lens_type:
                    lens_type_diff = 0
                else:
                    lens_type_diff = 1
            else: # If no preference.
                lens_type_diff = 0

            # Camera Type: ["point-and-shoot", "dslr", "mirrorless", ""]
            if preferences.get("camera_type") in ["point-and-shoot", "dslr", "mirrorless"]: 
                if preferences.get("camera_type") in actual_camera_type:
                    camera_type_diff = 0
                else:
                    camera_type_diff = 1
            else: # If no preference.
                camera_type_diff = 0

            # Budget: ["<750", "750-1500", ">1500", ""]
            if preferences.get("budget") in [">1500", ""]:
                upper_bound = 10000.00
            elif "-" in preferences.get("budget"):
                upper_bound = int(preferences.get("budget")[preferences.get("budget").index("-") + 1:])
            else:
                upper_bound = int(preferences.get("budget")[preferences.get("budget").index("<") + 1:])
            if actual_price <= upper_bound:
                price_diff = 0
            else:
                price_diff = 1

            # Rating
            if p.get("basic_info").get("rating") is not None:
                rating = (1 - (p.get("basic_info").get("rating") / 5))
            else:
                rating = 1

            # Calculate weights of each feature.
            weights = {
                "brand": brand_diff * importance_inv.get("brand"),
                "megapixels": megapixels_diff * importance_inv.get("megapixels"),
                "lens_type": lens_type_diff * importance_inv.get("lens_type"),
                "camera_type": camera_type_diff * importance_inv.get("camera_type"),
                "budget": price_diff * importance_inv.get("budget"),
                "rating": rating * importance_inv.get("product_rating")
            }
            # Sum all weights.
            pref_score = sum(weights.values())

            # TODO: Verify the weights.
            rank_weight = 0.25
            pref_weight = 0.75
            worst_score = pref_weight * sum(range(1, NUM_FEATURES + 1)) + rank_weight * (max_master_list_rank + max_rank * 2)
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
