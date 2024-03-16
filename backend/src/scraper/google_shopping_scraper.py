from os import environ
from serpapi import GoogleSearch
from typing import Dict, Optional
from urllib import parse
import logging

SELLER_FILTERS = {
    "walmart": "g8299768%7Cm125210027%7Cm120798572%7Cm113137360%7Cm5073604987%7Cm585399882",
    "best-buy": "g8299768%7Cg7187155%7Cm125210027%7Cm120798572%7Cm113137360%7Cm5073604987%7Cm585399882%7Cm1311674",
}

def _extract_product_id(url: str) -> Optional[str]:
    parsed_url = parse.urlparse(url)
    potential_id = parsed_url.path.split("/")[-1]
    potential_id = potential_id.replace(".p", "")
    return potential_id if potential_id.isdigit() else None

def _cleanup_source(source: str) -> str:
    refined_source = source
    if "Best Buy" in source:
        refined_source = "Best Buy"
    elif "Walmart" in source:
        refined_source = "Walmart"
    return refined_source

def scrape_google_products(q: str, start: int) -> Dict:
    sellers = "|".join(SELLER_FILTERS.values())
    params = {
        "engine": "google_shopping",
        "google_domain": "google.com",
        "q": q,
        "start": start,
        "api_key": environ.get("SERPAPI_API_KEY"),
        "device": "desktop",
        "hl": "en",
        "gl": "us",
        "location": "United States",
        "num": "40",
        "tbs": f"mr:1,merchagg:{sellers}",
    }
    try:
        search = GoogleSearch(params)
        results = search.get_dict()
    except:
        results = {}

    if "error" in results.keys():
        logging.error(f"Google Shopping => {results.get('error')}")
        return {
            "shopping_results": {
                "status": "Error",
                "error": results.get("error"),
            }
        }
    elif len(results) == 0:
        return {
            "shopping_results": {
                "status": "Error",
                "error": "The API call failed.",
            }
        }
    else:
        shopping_results = results.get("shopping_results", [])
        status = results["search_metadata"]["status"]
        return {
            "shopping_results": {
                "status": status,
                "data": [
                    {
                        "position": sr.get("position"),
                        "product_id": _extract_product_id(sr.get("link")),
                        "title": sr.get("title"),
                        "link": sr.get("link"),
                        "source": _cleanup_source(sr.get("source")),
                        "price": sr.get("extracted_price"),
                        "rating": sr.get("rating"),
                        "reviews": sr.get("reviews"),
                        "thumbnail": sr.get("thumbnail"),
                    } for sr in shopping_results
                ],
            }
        }
