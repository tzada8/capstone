from os import environ
from typing import Dict
import requests
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer

class BestBuyProduct:
    @staticmethod
    def _product_specs(product_id: str) -> Dict:
        params = {
            "product_id": product_id,
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
    def _product_reviews(product_id: str, product_name: str) -> Dict:
        # Search for product by UPC.
        params = {
            "product_id": product_id,
            "headers": {"User-Agent": "Mozilla/5.0 (X11; CrOS x86_64 12871.102.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.141 Safari/537.36"},
        }
        search = requests.get(f"https://www.bestbuy.ca/api/v2/json/search?query={params.get('product_id')}", headers = params.get('headers'))
        results = search.json()

        if results.get('total') == 0:
            return {
                "reviews": {
                    "error": "No reviews exist for provided id.",
                }
            }
        else:
            # Search for reviews by product ID.
            canada_sku = results.get('products')[0].get('sku')
            search_sku = requests.get(f"https://www.bestbuy.ca/api/v2/json/reviews/{canada_sku}?page=1&pagesize=700&source=us", headers = params.get('headers'))
            review_results = search_sku.json()

            # Compare names of US and Canadian products using cosine similarity.
            canada_name = results.get('products')[0].get('name')
            name_1 = word_tokenize(product_name.lower())  
            name_2 = word_tokenize(canada_name.lower())

            sw = stopwords.words('english') 
            ps = PorterStemmer()
            l1 =[]
            l2 =[] 
            
            name_1_set = {ps.stem(w) for w in name_1 if not w in sw}  
            name_2_set = {ps.stem(w) for w in name_2 if not w in sw} 
            rvector = name_1_set.union(name_2_set)
            for w in rvector: 
                l1.append(1) if w in name_1_set else l1.append(0) 
                l2.append(1) if w in name_2_set else l2.append(0) 
            c = 0
            for i in range(len(rvector)): 
                c += l1[i] * l2[i] 
            if sum(l1) != 0 and sum(l2) != 0:
                cosine = c / float((sum(l1) * sum(l2))**0.5)
            else:
                cosine = 0

            if review_results.get('total') == 0 or cosine < 0.75:
                return {
                    "reviews": {
                        "error": "No reviews exist for provided id.",
                    }
                }
            else:
                reviews = review_results.get("reviews", [])

                total_pages = review_results.get('totalPages')
                if total_pages > 1:
                    for page in range(1, min(total_pages, 10)): 
                        search_sku = requests.get(f"https://www.bestbuy.ca/api/v2/json/reviews/{canada_sku}?page={page+1}&pagesize=700&source=us", headers = params.get('headers'))
                        review_results = search_sku.json()
                        reviews.extend(review_results.get("reviews", []))

                # TODO: Get most positive and most negative reviews.
                top_positive = {}
                top_negative = {}
                return {
                    "reviews": {
                        "ratings": [
                            {
                                "count": review_results.get('RatingSummary').get('OneStarCount'),
                                "stars": 1
                            },
                            {
                                "count": review_results.get('RatingSummary').get('TwoStarCount'),
                                "stars": 2
                            },
                            {
                                "count": review_results.get('RatingSummary').get('ThreeStarCount'),
                                "stars": 3
                            },
                            {
                                "count": review_results.get('RatingSummary').get('FourStarCount'),
                                "stars": 4
                            },
                            {
                                "count": review_results.get('RatingSummary').get('FiveStarCount'),
                                "stars": 5
                            }
                        ],
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
                        "reviews": [r.get('comment') for r in reviews],
                    }
                }

    @staticmethod
    def aggregate_data(product_id: str) -> Dict:
        specs_dict = BestBuyProduct._product_specs(product_id)
        reviews_dict = BestBuyProduct._product_reviews(specs_dict.get('basic_info').get('upc'), specs_dict.get('basic_info').get('title', ''))
        return specs_dict | reviews_dict
