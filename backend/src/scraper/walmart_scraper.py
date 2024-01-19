from os import environ
from serpapi import GoogleSearch
from typing import Dict

class WalmartProduct:
    @staticmethod
    def _product_specs(product_id: str) -> Dict:
        params = {
            "engine": "walmart_product",
            "product_id": product_id,
            "api_key": environ.get("SERPAPI_API_KEY"),
        }
        search = GoogleSearch(params)
        results = search.get_dict()

        if "error" in results:
            return {
                "basic_info": {
                    "product_id": results.get("search_parameters", {}).get("product_id"),
                    "error": results.get("error"),
                }
            }
        else:
            product_result = results.get("product_result", {})
            price_map = product_result.get("price_map", {})
            spec_highlights = product_result.get("specification_highlights", [])
            return {
                "basic_info": {
                    "us_item_id": product_result.get("us_item_id"),
                    "product_id": product_result.get("product_id"),
                    "title": product_result.get("title"),
                    "product_page_url": product_result.get("product_page_url"),
                    "price": {
                        "amount": price_map.get("price"),
                        "currency": price_map.get("currency"),
                    },
                    "images": product_result.get("images", []),
                    "total_reviews": product_result.get("reviews"),
                    "rating": product_result.get("rating"),
                },
                "specifications": [
                    { "name": s.get("display_name"), "value": s.get("value") } for s in spec_highlights
                ],
            }

    @staticmethod
    def _product_reviews(product_id: str) -> Dict:
        params = {
            "engine": "walmart_product_reviews",
            "product_id": product_id,
            "api_key": environ.get("SERPAPI_API_KEY"),
            "sort": "relevancy",
        }
        search = GoogleSearch(params)
        results = search.get_dict()

        if "error" in results:
            return {
                "reviews": {
                    "error": results.get("error"),
                }
            }
        else:
            top_positive = results.get("top_positive", {})
            top_negative = results.get("top_negative", {})
            reviews = results.get("reviews", [])
            return {
                "reviews": {
                    "ratings": results.get("ratings"),
                    "top_positive": {
                        "title": top_positive.get("title"),
                        "text": top_positive.get("text"),
                        "rating": top_positive.get("rating"),
                    },
                    "top_negative": {
                        "title": top_negative.get("title"),
                        "text": top_negative.get("text"),
                        "rating": top_negative.get("rating"),
                    },
                    "reviews": [r.get("text") for r in reviews],
                }
            }

    @staticmethod
    def aggregate_data(product_id: str) -> Dict:
        specs_dict = WalmartProduct._product_specs(product_id)
        reviews_dict = WalmartProduct._product_reviews(product_id)
        return specs_dict | reviews_dict
