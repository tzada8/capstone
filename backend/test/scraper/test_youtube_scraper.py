import unittest
from unittest.mock import patch

from test.scraper.data.youtube.videos import videos_returned, api_error
from src.scraper.youtube_scraper import scrape_videos

class TestYoutubeScraper(unittest.TestCase):
    def setUp(self):
        self.mock_search = patch("src.scraper.youtube_scraper.GoogleSearch.get_dict").start()

    def tearDown(self):
        self.mock_search.stop()

    def test_scrape_videos_exists(self):
        self.mock_search.return_value = videos_returned
        query = "Best Food Ever"
        result = scrape_videos(query)
        expected = {
            "videos": [
                {
                    "title": "Pizza is good",
                    "link": "https://example1.com",
                    "channel_name": "Pizza Channel",
                    "published_date": "12 hours ago",
                    "views": "2.3k",
                    "length": "3:12",
                    "thumbnail": "https://thumbnail1.com",
                },
                {
                    "title": "Eating food fast",
                    "link": "https://example2.com",
                    "channel_name": None,
                    "published_date": "12 hours ago",
                    "views": "7.2M",
                    "length": "10:00",
                    "thumbnail": None,
                },
                {
                    "title": "24h no food challenge",
                    "link": "https://example3.com",
                    "channel_name": None,
                    "published_date": "12 hours ago",
                    "views": "174",
                    "length": "24:00:00",
                    "thumbnail": None,
                },
            ]
        }
        self.assertEqual(result, expected)

    def test_scrape_videos_api_error(self):
        self.mock_search.return_value = api_error
        query = "Best Food Ever"
        result = scrape_videos(query)
        expected = {
            "videos": []
        }
        self.assertEqual(result, expected)
