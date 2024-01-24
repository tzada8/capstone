from os import environ
from typing import Dict
import requests

class BestBuyProduct:
    @staticmethod
    def _product_specs(product_id: str) -> Dict:
        params = {
            "product_id": product_id, # TODO: Figure out what to pass to API.
            "api_key": environ.get("BESTBUY_API_KEY"), # TODO: Update API Key.
        }
        search = requests.get(f"https://api.bestbuy.com/v1/products(sku={params.get('product_id')})?apiKey={params.get('api_key')}&show=customerReviewAverage,customerReviewCount,details.name,details.value,image,manufacturer,modelNumber,name,regularPrice,sku,upc,url&pageSize=10&format=json")
        results = search.json()

        if "error" in results or results.get("total") == 0:
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
                    "product_id": product_result.get("sku"),
                    "manufacturer": product_result.get("manufacturer"),
                    "model_number": product_result.get("modelNumber"),
                    "upc": product_result.get("upc"),
                    "title": product_result.get("name"),
                    "product_page_url": product_result.get("url"),
                    "price": {
                        "amount": product_result.get("regularPrice"),
                        "currency": "USD" if product_result.get("regularPrice") is not None else None,
                    },
                    "images": product_result.get("image", []),
                    "total_reviews": product_result.get("customerReviewCount"),
                    "rating": product_result.get("customerReviewAverage"),
                },
                "specifications": [
                    { "name": s.get("name"), "value": s.get("value") } for s in spec_highlights
                ],
            }

    @staticmethod
    def _product_reviews(product_id: str) -> Dict:
        # TODO: Implement review scraping.
        return {"reviews": {}}

    @staticmethod
    def aggregate_data(product_id: str) -> Dict:
        specs_dict = BestBuyProduct._product_specs(product_id)
        reviews_dict = BestBuyProduct._product_reviews(product_id)
        return specs_dict | reviews_dict
