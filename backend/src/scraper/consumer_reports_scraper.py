from os import environ
import requests
from typing import Dict
import difflib

def scrape_expert_reviews(q: str, id_check: str, id_field: str) -> Dict:
    short_title = ' '.join(q.split()[:5])

    headers = {
        "X-RapidAPI-Key": environ.get("RAPIDAPI_API_KEY"),
        "X-RapidAPI-Host": "consumer-reports.p.rapidapi.com"
    }

    # Get all products in camera category.
    all_prod_url = "https://consumer-reports.p.rapidapi.com/products/list"
    all_prod_querystring = {"productGroupId":"28960","page":"0","size":"100"}
    all_prod_response = requests.get(all_prod_url, headers=headers, params=all_prod_querystring)
    all_prod_results = all_prod_response.json()

    # Create name to id mapping.
    name_id = {}
    for prod in all_prod_results.get('content'):
        name_id[prod.get('modelName')] = prod.get('_id')

    # Return id of product name that most closely matches shortened q.
    id = max(name_id.items(), key = lambda x: difflib.SequenceMatcher(None, short_title, x[0]).ratio())[1]

    # Get expert reviews.
    review_url = "https://consumer-reports.p.rapidapi.com/products/detail"
    review_querystring = {"id": id}
    review_response = requests.get(review_url, headers=headers, params=review_querystring)
    er = review_response.json().get('content')[0]

    # Check that UPC or Walmart ID returned by Consumer Reports 
    # matches UPC or Walmart ID returned by Best Buy or Walmart, respectively.
    if er.get(id_field) is None:
        field = ''
    else:
        field = str(er.get(id_field))

    if str(id_check) == field:
        return {
            "expert_review": {
                "review": er.get('expertReview').get('bottomLine', er.get('expertReview').get('summary')),
                "recommended": er.get('expertRatings').get('isRecommended'),
                "bestseller": er.get('expertRatings').get('isBestseller'),
                "bestbuy": er.get('expertRatings').get('isBestBuy'),
                "dontbuy": er.get('expertRatings').get('isDontBuy'),
            } 
        }
    else:
        return {
            "expert_review": {
                "product": q,
                "error": "The review for this product does not exist.",
            }
        }