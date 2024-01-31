from os import environ
from serpapi import GoogleSearch
from typing import Dict, Optional
from urllib import parse

SELLER_FILTERS = {
    "walmart": "g8299768%7Cm125210027%7Cm120798572%7Cm113137360%7Cm5073604987%7Cm585399882",
    "best-buy": "g8299768%7Cg7187155%7Cm125210027%7Cm120798572%7Cm113137360%7Cm5073604987%7Cm585399882%7Cm1311674",
}

def _extract_product_id(url: str) -> Optional[str]:
    parsed_url = parse.urlparse(url)
    potential_id = parsed_url.path.split("/")[-1]
    potential_id = potential_id.replace(".p", "")
    return potential_id if potential_id.isdigit() else None

def scrape_google_products(q: str) -> Dict:
    sellers = "|".join(SELLER_FILTERS.values())
    params = {
        "engine": "google_shopping",
        "google_domain": "google.com",
        "q": q,
        "api_key": environ.get("SERPAPI_API_KEY"),
        "hl": "en",
        "gl": "us",
        "location": "United States",
        "num": "100",
        "tbs": f"mr:1,merchagg:{sellers}",
    }
    search = GoogleSearch(params)
    results = search.get_dict()

    status = results["search_metadata"]["status"]
    if status == "Error":
        return {
            "shopping_results": {
                "status": status,
                "error": results.get("error"),
            }
        }
    else:
        shopping_results = results.get("shopping_results", [])
        pagination = results.get("serpapi_pagination", [])
        return {
            "shopping_results": {
                "status": status,
                "data": [
                    {
                        "position": sr.get("position"),
                        "product_id": _extract_product_id(sr.get("link")),
                        "title": sr.get("title"),
                        "link": sr.get("link"),
                        "source": sr.get("source"),
                        "price": sr.get("extracted_price"),
                        "rating": sr.get("rating"),
                        "reviews": sr.get("reviews"),
                        "extensions": sr.get("extensions"),
                        "thumbnail": sr.get("thumbnail"),
                    } for sr in shopping_results
                ],
                "pagination": {
                    "current": pagination.get("current"),
                    "next": pagination.get("next"),
                    "other_pages": pagination.get("other_pages", {}),
                },
            }
        }
