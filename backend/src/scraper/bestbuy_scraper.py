from os import environ
from typing import Dict, List
import requests
import logging
from difflib import SequenceMatcher
from multiprocessing import Pool
from itertools import repeat
from src.sentiment.sentiment import sentiment

class BestBuyProduct:
    @staticmethod
    def _product_specs(product_id: str) -> Dict:
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
            logging.error(f"Best Buy Specs => Error Code: {results.get('errorCode')} - {results.get('errorMessage')}")
            return {
                "basic_info": {
                    "product_id": params.get("product_id"),
                    "error": f"Error Code: {results.get("errorCode")} - {results.get("errorMessage")}"
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
                    "badges": {
                        "top_rated": product_result.get("customerTopRated")
                    },
                    "source": "Best Buy",
                },
                "specifications": [
                    { "name": s.get("name"), "value": s.get("value") } for s in spec_highlights if s.get("name") in S
                ],
            }
        
    @staticmethod    
    def _pull_reviews(i: int, sku: int, params: Dict) -> List[str]:
        try:
            search_sku = requests.get(f"https://www.bestbuy.ca/api/v2/json/reviews/{sku}?page={i}&source=us", headers = params.get('headers'))
            review_results = search_sku.json()
        except:
            review_results = {"reviews": []}
        
        if "ErrorCode" in review_results.keys():
            logging.error(f"Best Buy Pull Reviews => Error Code: {review_results.get('ErrorCode')} - {review_results.get('ErrorMessage')}")
        reviews = review_results.get("reviews", [])
        return reviews

    @staticmethod
    def _product_reviews(product_name: str) -> Dict:
        # Search for product by name (first 5 words).
        params = {
            "product_name": ' '.join(product_name.split()[:5]).lower(),
            "headers": {"User-Agent": "Mozilla/5.0 (X11; CrOS x86_64 12871.102.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.141 Safari/537.36"},
        }
        try:
            search = requests.get(f"https://www.bestbuy.ca/api/v2/json/search?query={params.get('product_name')}", headers = params.get('headers'))
            results = search.json()
        except:
            results = {"total": 0}

        if "ErrorCode" in results.keys():
            logging.error(f"Best Buy Reviews => Error Code: {results.get('ErrorCode')} - {results.get('ErrorMessage')}")
            return {
                "reviews": {
                    "error": f"Error Code: {results.get("ErrorCode")} - {results.get("ErrorMessage")}",
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
                # If more than 75% similar, use that product's reviews.
                if similarity >= 0.75:
                    compatible_sku = product.get('sku')
                    try:
                        search_sku = requests.get(f"https://www.bestbuy.ca/api/v2/json/reviews/{compatible_sku}?page=1&source=us", headers = params.get('headers'))
                        review_info = search_sku.json()
                    except:
                        review_info = {"total": 0}

                    if "ErrorCode" in review_info.keys():
                        logging.error(f"Best Buy Pull Reviews => Error Code: {review_info.get('ErrorCode')} - {review_info.get('ErrorMessage')}")
                    elif review_info.get("total") > 0:
                        total_pages = review_info.get('totalPages')
                        # Parallel API calls for each page of reviews.
                        with Pool(5) as p:
                            reviews_temp = p.starmap(BestBuyProduct._pull_reviews, zip(range(1, min(total_pages, 10) + 1), repeat(compatible_sku), repeat(params)))
                        reviews = [x for xs in reviews_temp for x in xs if x.get("comment") is not None]

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
                        "ratings": [
                            {
                                "count": review_info.get('RatingSummary').get('OneStarCount'),
                                "stars": 1
                            },
                            {
                                "count": review_info.get('RatingSummary').get('TwoStarCount'),
                                "stars": 2
                            },
                            {
                                "count": review_info.get('RatingSummary').get('ThreeStarCount'),
                                "stars": 3
                            },
                            {
                                "count": review_info.get('RatingSummary').get('FourStarCount'),
                                "stars": 4
                            },
                            {
                                "count": review_info.get('RatingSummary').get('FiveStarCount'),
                                "stars": 5
                            }
                        ],
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

    @staticmethod
    def aggregate_data(product_id: str) -> Dict:
        specs_dict = BestBuyProduct._product_specs(product_id)
        reviews_dict = BestBuyProduct._product_reviews(specs_dict.get('basic_info').get('title', ''))
        return specs_dict | reviews_dict
