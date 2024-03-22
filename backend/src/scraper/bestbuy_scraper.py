from os import environ
from typing import Dict, List
import requests
from difflib import SequenceMatcher
from src.sentiment.sentiment import sentiment

class BestBuyProduct:
    @staticmethod
    def _product_images(product_dict: Dict, key: str) -> List:
        if key in product_dict:
            if isinstance(product_dict[key], list):
                return product_dict[key]
            elif isinstance(product_dict[key], str):
                return [product_dict[key]]
        return []

    @staticmethod
    def product_specs(product_id: str) -> Dict:
        params = {
            "product_id": product_id,
            "api_key": environ.get("BESTBUY_API_KEY"),
        }
        try:
            search = requests.get(f"https://api.bestbuy.com/v1/products(sku={params.get('product_id')})?apiKey={params.get('api_key')}&show=customerReviewAverage,customerReviewCount,customerTopRated,details.name,details.value,image,manufacturer,modelNumber,name,regularPrice,sku,upc,url&pageSize=10&format=json")
            results = search.json()
        except:
            results = {"total": 0}

        S = ["Autofocus", "In-Lens Image Stabilization", "Digital Camera Type", "Lens Model Number", "Memory Card Compatibility",
             "Screen Size", "Integrated Flash", "Effective Pixels", "Product Depth", "Product Width", "Product Weight",
             "Brand", "Lens Type", "Digital Zoom", "Color", "Shooting Modes", "Product Height", "Maximum Aperture", 
             "Maximum Focal Length", "Scene Modes"]

        if "errorCode" in results.keys():
            print(f"Best Buy Specs => Error Code: {results.get('errorCode')} - {results.get('errorMessage')}")
            return {
                "basic_info": {
                    "product_id": params.get("product_id"),
                    "error": f"Error Code: {results.get('errorCode')} - {results.get('errorMessage')}"
                }
            }
        elif results.get("total") == 0:
            return {
                "basic_info": {
                    "product_id": params.get("product_id"),
                    "error": "The product id does not exist.",
                }
            }
        else:
            product_result = results.get("products", {})[0]
            spec_highlights = product_result.get("details", [])
            return {
                "basic_info": {
                    "us_item_id": product_result.get("us_item_id", ""),
                    "product_id": product_id,
                    "manufacturer": product_result.get("manufacturer"),
                    "model_number": product_result.get("modelNumber"),
                    "upc": product_result.get("upc"),
                    "title": product_result.get("name"),
                    "product_page_url": product_result.get("url"),
                    "price": {
                        "amount": product_result.get("regularPrice"),
                        "currency": "USD" if product_result.get("regularPrice") is not None else None,
                    },
                    "images": BestBuyProduct._product_images(product_result, "image"),
                    "total_reviews": product_result.get("customerReviewCount"),
                    "rating": product_result.get("customerReviewAverage"),
                    "badges": {
                        "top_rated": product_result.get("customerTopRated")
                    },
                    "source": "Best Buy",
                },
                "specifications": sorted([
                    { "name": s.get("name"), "value": s.get("value") } for s in spec_highlights if s.get("name") in S
                ], key=lambda spec: spec.get("name")),
            }

    @staticmethod
    def product_reviews(product_name: str) -> Dict:
        # Search for product by name (first 5 words).
        params = {
            "product_name": ' '.join(product_name.split()[:5]).replace(" - ", " ").lower(),
            "headers": {"User-Agent": "Mozilla/5.0 (X11; CrOS x86_64 12871.102.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.141 Safari/537.36"},
        }
        try:
            search = requests.get(f"https://www.bestbuy.ca/api/v2/json/search?query={params.get('product_name')}", headers = params.get('headers'))
            results = search.json()
        except:
            results = {"total": 0}

        if "ErrorCode" in results.keys():
            print(f"Best Buy Reviews => Error Code: {results.get('ErrorCode')} - {results.get('ErrorMessage')}")
            return {
                "reviews": {
                    "error": f"Error Code: {results.get('ErrorCode')} - {results.get('ErrorMessage')}",
                }
            }
        elif results.get('total') == 0:
            return {
                "reviews": {
                    "error": "The product has no reviews.",
                }
            }
        else:
            # Sort first 5 products by number of reviews, descending.
            # The idea is to maximize chances of getting a product with reviews while still matching to a relevant Canadian product.
            sorted_products = sorted(results.get("products")[:5], key=lambda d: d.get('customerReviewCount'), reverse = True)
            # For each product, check US and Canadian name similarity.
            shortened_us_name = ' '.join(product_name.split()[:3]).lower()
            for product in sorted_products:
                shortened_canada_name = ' '.join(product.get('name').split()[:3]).lower()
                similarity = SequenceMatcher(None, shortened_us_name, shortened_canada_name).ratio()
                # If more than 65% similar, use that product's reviews.
                if similarity >= 0.65:
                    compatible_sku = product.get('sku')
                    try:
                        search_sku = requests.get(f"https://www.bestbuy.ca/api/v2/json/reviews/{compatible_sku}?pageSize=100&source=us", headers = params.get('headers'))
                        review_info = search_sku.json()
                    except:
                        review_info = {"total": 0}

                    if "ErrorCode" in review_info.keys():
                        print(f"Best Buy Pull Reviews => Error Code: {review_info.get('ErrorCode')} - {review_info.get('ErrorMessage')}")
                    elif review_info.get("total") > 0:
                        reviews_temp = review_info.get("reviews")
                        reviews = [x for x in reviews_temp if (x.get("comment") is not None and x.get("comment") != "")]
                        if len(reviews) > 0:
                            # Replace promo message in reviews.
                            promo_string = "[This review was collected as part of a promotion.] "
                            for r in reviews:
                                r["comment"] = r.get("comment").replace(promo_string, "")
                            ratings = list(map(lambda x: x.get("rating"), reviews))
                            selected_reviews = list(filter(lambda d: d.get("rating") in [max(ratings), min(ratings)], reviews))
                            positive_negative = sentiment(selected_reviews)
                        break
                else:
                    reviews = []
                
            if len(reviews) == 0:
                return {
                    "reviews": {
                        "error": "The product has no reviews.",
                    }
                }
            else:
                return {
                    "reviews": {
                        "top_positive": {
                            "title": positive_negative.get("top_positive").get("title"),
                            "text": positive_negative.get("top_positive").get("text"),
                            "rating": positive_negative.get("top_positive").get("rating"),
                        },
                        "top_negative": {
                            "title": positive_negative.get("top_negative").get("title"),
                            "text": positive_negative.get("top_negative").get("text"),
                            "rating": positive_negative.get("top_negative").get("rating"),
                        },
                        "reviews": [r.get('comment') for r in reviews],
                    }
                }
