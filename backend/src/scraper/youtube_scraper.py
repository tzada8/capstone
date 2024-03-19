from os import environ
from serpapi import GoogleSearch
from typing import Dict

def _convert_video_views(num: int) -> str:
    suffixes = ["","k", "M", "B", "T"]
    magnitude = 0
    if num is None:
        num = 0
    while abs(num) >= 1000:
        magnitude += 1
        num /= 1000.0
    return str(num) if magnitude == 0 else "{:.1f}{}".format(num, suffixes[magnitude])

def scrape_videos(q: str) -> Dict:
    params = {
        "engine": "youtube",
        "search_query": q,
        "api_key": environ.get("SERPAPI_API_KEY"),
        "gl": "us",
        "hl": "en",
    }
    try:
        search = GoogleSearch(params)
        results = search.get_dict()
    except:
        results = {}

    if "error" in results:
        print(f"YouTube => {results.get('error')}")
        return {
            "videos": []
        }
    elif len(results) == 0:
        return {
            "videos": []
        }
    else:
        video_results = results.get("video_results", [])
        return {
            "videos": [
                {
                    "title": vr.get("title"),
                    "link": vr.get("link"),
                    "channel_name": vr.get("channel", {}).get("name"),
                    "published_date": vr.get("published_date"),
                    "views": _convert_video_views(vr.get("views", 0)),
                    "length": vr.get("length"),
                    "thumbnail": vr.get("thumbnail", {}).get("static"),
                } for vr in video_results
            ][:3]
        }
