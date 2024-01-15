from os import environ
from serpapi import GoogleSearch
from typing import Dict

class WalmartProduct:
    def __init__(self):
        self.api_key = environ.get("SERPAPI_API_KEY")

    def _product_specs(self, product_id) -> Dict:
        params = {
            "engine": "walmart_product",
            "product_id": product_id,
            "api_key": self.api_key,
        }
        search = GoogleSearch(params)
        results = search.get_dict()

        if "error" in results:
            return {
                "product_id": results["search_parameters"]["product_id"],
                "error": results["error"],
            }
        else:
            return {
                "us_item_id": results["product_result"]["us_item_id"],
                "product_id": results["product_result"]["product_id"],
                "title": results["product_result"]["title"],
                "specification_highlights": results["product_result"]["specification_highlights"],
                "product_page_url": results["product_result"]["product_page_url"],
                "price_map": {
                    "price": results["product_result"]["price_map"]["price"],
                    "currency": results["product_result"]["price_map"]["currency"],
                },
                "images": results["product_result"]["images"],
                "total_reviews": results["product_result"]["reviews"],
                "rating": results["product_result"]["rating"],
            }

    def _product_reviews(self, product_id) -> Dict:
        params = {
            "engine": "walmart_product_reviews",
            "product_id": product_id,
            "api_key": self.api_key,
            "sort": "relevancy",
        }
        search = GoogleSearch(params)
        results = search.get_dict()

        if "error" in results:
            return {
                "error": results["error"],
            }
        else:
            return {
                "ratings": results["ratings"],
                "top_positive": {
                    "title": results["top_positive"]["title"],
                    "text": results["top_positive"]["text"],
                    "rating": results["top_positive"]["rating"],
                },
                "top_negative": {
                    "title": results["top_negative"]["title"],
                    "text": results["top_negative"]["text"],
                    "rating": results["top_negative"]["rating"],
                },
                "reviews": [r["text"] for r in results["reviews"]],
            }

    def aggregate_data(self, product_id):
        specs = self._product_specs(product_id)
        reviews = self._product_reviews(product_id)
        # TODO: Summarize reviews.
        # TODO: Combine final JSON.
        return { "specifications": specs, "reviews": reviews }
