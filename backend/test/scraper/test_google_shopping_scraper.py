import unittest
from unittest.mock import patch

from test.scraper.data.youtube.videos import videos_returned
from test.scraper.data.google_shopping.products import products_valid, products_invalid, api_error
from src.scraper.google_shopping_scraper import scrape_google_products

class TestGoogleShoppingScraper(unittest.TestCase):
    def setUp(self):
        self.mock_search = patch("src.scraper.google_shopping_scraper.GoogleSearch.get_dict").start()

    def tearDown(self):
        self.mock_search.stop()

    def test_scrape_google_products_valid(self):
        self.mock_search.return_value = products_valid
        query = "Cameras"
        start = 0
        result = scrape_google_products(query, start)
        expected = {
            "shopping_results": {
                "status": "Success",
                "data": [
                    {
                        "position": 1,
                        "product_id": "11111",
                        "title": "Product 1",
                        "link": "https://example1.com/11111.p?skuId=11111",
                        "source": "Best Buy",
                        "price": 100.00,
                        "rating": 4.5,
                        "reviews": 2,
                        "extensions": ["Black", "Videos"],
                        "thumbnail": "https://thumbnail1.com",
                    },
                    {
                        "position": 2,
                        "product_id": "22222",
                        "title": "Product 2",
                        "link": "https://example2.com/Product-2/22222",
                        "source": "Walmart",
                        "price": 500.00,
                        "rating": 4.3,
                        "reviews": 100,
                        "extensions": ["Black"],
                        "thumbnail": "https://thumbnail2.com",
                    },
                ],
            }
        }
        self.assertEqual(result, expected)

    def test_scrape_google_products_error(self):
        self.mock_search.return_value = products_invalid
        query = "Best Food Ever"
        start = 0
        result = scrape_google_products(query, start)
        expected = {
            "shopping_results": {
                "status": "Error",
                "error": "An error occurred while attempting to pull products."
            }
        }
        self.assertEqual(result, expected)

    def test_scrape_google_products_api_error(self):
        self.mock_search.return_value = api_error
        query = "Best Food Ever"
        start = 0
        result = scrape_google_products(query, start)
        expected = {
            "shopping_results": {
                "status": "Error",
                "error": "Could not complete request."
            }
        }
        self.assertEqual(result, expected)
