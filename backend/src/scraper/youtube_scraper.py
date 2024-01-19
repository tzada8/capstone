from os import environ
from serpapi import GoogleSearch
from typing import Dict

def scrape_videos(q: str) -> Dict:
    params = {
        "engine": "youtube",
        "search_query": q,
        "api_key": environ.get("SERPAPI_API_KEY"),
        "gl": "us",
        "hl": "en",
    }
    search = GoogleSearch(params)
    results = search.get_dict()

    # TODO: Maybe we want YouTube Shorts? Can access via "shorts_results" field.
    video_results = results.get("video_results", [])
    return {
        "videos": [
            {
                "title": vr.get("title"),
                "link": vr.get("link"),
                "length": vr.get("length"),
                "thumbnail": vr.get("thumbnail"),
            } for vr in video_results
        ]
    }
