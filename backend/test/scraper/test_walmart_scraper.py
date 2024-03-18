import unittest
from unittest.mock import patch

from test.scraper.data.walmart.product_specs import \
    product_specs_exists, product_specs_nonexistent, product_specs_missing_keys, spec_api_error
from test.scraper.data.walmart.product_reviews import \
    product_reviews_exists, product_reviews_nonexistent, product_reviews_missing_keys, review_api_error
from src.scraper.walmart_scraper import WalmartProduct

class TestWalmartProduct(unittest.TestCase):
    def setUp(self):
        self.mock_search = patch("src.scraper.walmart_scraper.GoogleSearch.get_dict").start()

    def tearDown(self):
        self.mock_search.stop()

    def test_product_specs_id_exists(self):
        self.mock_search.return_value = product_specs_exists
        product_id = "11111"
        result = WalmartProduct.product_specs(product_id)
        expected = {
            "basic_info": {
                "us_item_id": product_id,
                "product_id": product_id,
                "title": "New Product Title",
                "product_page_url": "https://example.com",
                "price": {"amount": 100.0, "currency": "USD"},
                "images": ["https://image1.png", "https://image2.jpeg"],
                "total_reviews": 500,
                "rating": 4.1,
                "badges": {
                    "bestseller": True,
                    "customer_pick": True
                },
                "source": "Walmart",
                "upc": "012345"
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
        result = WalmartProduct.product_specs(product_id)
        expected = {
            "basic_info": {"error": "The product id does not exist.", "product_id": product_id}
        }
        self.assertEqual(result, expected)

    def test_product_specs_api_error(self):
        self.mock_search.return_value = spec_api_error
        product_id = "22222"
        result = WalmartProduct.product_specs(product_id)
        expected = {
            "basic_info": {"error": "Could not complete request.", "product_id": product_id}
        }
        self.assertEqual(result, expected)

    def test_product_specs_keys_missing(self):
        self.mock_search.return_value = product_specs_missing_keys
        product_id = "33333"
        result = WalmartProduct.product_specs(product_id)
        expected = {
            "basic_info": {
                "us_item_id": product_id,
                "product_id": product_id,
                "title": None,
                "product_page_url": "https://example.com",
                "price": {"amount": None, "currency": None},
                "images": [],
                "total_reviews": 500,
                "rating": 4.1,
                "badges": {
                    "bestseller": False,
                    "customer_pick": False
                },
                "source": "Walmart",
                "upc": ""
            },
            "specifications": []
        }
        self.assertEqual(result, expected)

    def test_product_reviews_id_exists(self):
        self.mock_search.return_value = product_reviews_exists
        product_id = "11111"
        result = WalmartProduct.product_reviews(product_id)
        expected = {
            "reviews": {
                "reviews": ["Good", "Bad", "Okay", "Terrible", "The best"],
                "top_negative": {
                    "rating": 1, "text": "Do not buy this product", "title": "Worst Product",
                },
                "top_positive": {
                    "rating": 5, "text": "This product is a must-buy", "title": "Best Product",
                }
            }
        }
        self.assertEqual(result, expected)

    def test_product_reviews_id_does_not_exist(self):
        self.mock_search.return_value = product_reviews_nonexistent
        product_id = "22222"
        result = WalmartProduct.product_reviews(product_id)
        expected = {"reviews": {"error": "No reviews exist for provided id."}}
        self.assertEqual(result, expected)

    def test_product_reviews_api_error(self):
        self.mock_search.return_value = review_api_error
        product_id = "22222"
        result = WalmartProduct.product_reviews(product_id)
        expected = {"reviews": {"error": "Could not complete request."}}
        self.assertEqual(result, expected)

    def test_product_reviews_keys_missing(self):
        self.mock_search.return_value = product_reviews_missing_keys
        product_id = "33333"
        result = WalmartProduct.product_reviews(product_id)
        expected = {
            "reviews": {
                "reviews": ["Good", "Bad", "Okay", "Terrible", "The best"],
                "top_negative": {},
                "top_positive": {},
            }
        }
        self.assertEqual(result, expected)
