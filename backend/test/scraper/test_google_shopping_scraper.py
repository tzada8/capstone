import unittest
from unittest.mock import patch

from test.scraper.data.youtube.videos import videos_returned
from test.scraper.data.google_shopping.products import products_valid, products_invalid
from src.scraper.google_shopping_scraper import scrape_google_products

class TestGoogleShoppingScraper(unittest.TestCase):
    def setUp(self):
        self.mock_search = patch("src.scraper.google_shopping_scraper.GoogleSearch.get_dict").start()

    def tearDown(self):
        self.mock_search.stop()

    def test_scrape_google_products_valid(self):
        self.maxDiff = None
        self.mock_search.return_value = products_valid
        query = "Cameras"
        result = scrape_google_products(query)
        expected = {
            "shopping_results": {
                "status": "Success",
                "data": [
                    {
                        "position": 1,
                        "title": "Product 1",
                        "link": "https://example1.com",
                        "source": "Walmart",
                        "price": 100.00,
                        "rating": 4.5,
                        "reviews": 2,
                        "extensions": ["Black", "Videos"],
                        "thumbnail": "https://thumbnail1.com",
                    },
                ],
                "pagination": {
                    "current": 1,
                    "next": "https://next-page.com",
                    "other_pages": {
                        "https://next-page.com",
                        "https://page3.com",
                    }
                }
            }
        }
        self.assertEqual(result, expected)

    def test_scrape_google_products_error(self):
        self.mock_search.return_value = products_invalid
        query = "Best Food Ever"
        result = scrape_google_products(query)
        expected = {
            "shopping_results": {
                "status": "Error",
                "error": "An error occurred while attempting to pull products."
            }
        }
        self.assertEqual(result, expected)
