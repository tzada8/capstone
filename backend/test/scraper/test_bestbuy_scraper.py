import unittest
from unittest.mock import patch

from test.scraper.data.bestbuy.product_specs import \
    product_specs_exists, product_specs_nonexistent, product_specs_incorrect_format, product_specs_missing_keys
from test.scraper.data.bestbuy.product_reviews import \
    product_reviews_exists, product_reviews_nonexistent, product_reviews_missing_keys
from src.scraper.bestbuy_scraper import BestBuyProduct

class TestBestBuyProduct(unittest.TestCase):
    def setUp(self):
        self.mock_search = patch("src.scraper.bestbuy_scraper.requests.get").start()

    def tearDown(self):
        self.mock_search.stop()

    def test_product_specs_id_exists(self):
        self.mock_search.return_value = product_specs_exists
        product_id = "11111"
        result = BestBuyProduct._product_specs(product_id)
        expected = {
            "basic_info": {
                "us_item_id": product_id,
                "product_id": "aaaaa",
                "model_number": "12345",
                "title": "New Product Title",
                "product_page_url": "https://example.com",
                "price": {"amount": 100.0, "currency": "CAD"},
                "images": ["https://image1.png", "https://image2.jpeg"],
                "total_reviews": 500,
                "rating": 4.1,
            },
            "specifications": [
                {"name": "Colour", "value": "Red"},
                {"name": "Size", "value": "Small"},
            ]
        }
        self.assertEqual(result, expected)

    def test_product_specs_id_does_not_exist(self):
        self.mock_search.return_value = product_specs_nonexistent
        product_id = "22222"
        result = BestBuyProduct._product_specs(product_id)
        expected = {
            "basic_info": {"error": "The product id does not exist.", "product_id": product_id}
        }
        self.assertEqual(result, expected)

    def test_product_specs_id_incorrect_format(self):
        self.mock_search.return_value = product_specs_incorrect_format
        product_id = "0"
        result = BestBuyProduct._product_specs(product_id)
        expected = {
            "basic_info": {"error": "The product id does not exist.", "product_id": product_id}
        }
        self.assertEqual(result, expected)

    def test_product_specs_keys_missing(self):
        self.mock_search.return_value = product_specs_missing_keys
        product_id = "33333"
        result = BestBuyProduct._product_specs(product_id)
        expected = {
            "basic_info": {
                "us_item_id": product_id,
                "product_id": "ccccc",
                "model_number": None,
                "title": None,
                "product_page_url": "https://example.com",
                "price": {"amount": None, "currency": None},
                "images": [],
                "total_reviews": 500,
                "rating": 4.1,
            },
            "specifications": []
        }
        self.assertEqual(result, expected)

    # TODO: Peer review tests.

    def test_aggregate_data_id_exists(self):
        self.mock_search.side_effect = [product_specs_exists, product_reviews_exists]
        product_id = "11111"
        result = BestBuyProduct.aggregate_data(product_id)
        expected = {
            "basic_info": {
                "us_item_id": product_id,
                "product_id": "aaaaa",
                "model_number": "12345",
                "title": "New Product Title",
                "product_page_url": "https://example.com",
                "price": {"amount": 100.0, "currency": "CAD"},
                "images": ["https://image1.png", "https://image2.jpeg"],
                "total_reviews": 500,
                "rating": 4.1,
            },
            "specifications": [
                {"name": "Colour", "value": "Red"},
                {"name": "Size", "value": "Small"},
            ],
            "reviews": {}
        }
        self.assertEqual(result, expected)
