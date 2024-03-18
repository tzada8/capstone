import unittest
from unittest.mock import patch

from test.scraper.data.bestbuy.product_specs import \
    product_specs_exists, product_specs_nonexistent, product_specs_missing_keys, spec_api_error
from test.scraper.data.bestbuy.product_reviews import \
    all_products_returned, no_products_returned, product_reviews_exists, product_reviews_nonexistent, review_api_error
from src.scraper.bestbuy_scraper import BestBuyProduct

class TestBestBuyProduct(unittest.TestCase):
    def setUp(self):
        self.mock_search = patch("src.scraper.bestbuy_scraper.requests.get").start()

    def tearDown(self):
        self.mock_search.stop()

    def test_product_specs_id_exists(self):
        self.mock_search.return_value = product_specs_exists
        product_id = "11111"
        result = BestBuyProduct.product_specs(product_id)
        expected = {
            "basic_info": {
                "us_item_id": product_id,
                "product_id": product_id,
                "model_number": "12345",
                "manufacturer": "AAAAA",
                "upc": "00000",
                "title": "New Product Title",
                "product_page_url": "https://example.com",
                "price": {"amount": 100.0, "currency": "USD"},
                "images": ["https://image1.png", "https://image2.jpeg"],
                "total_reviews": 500,
                "rating": 4.1,
                "badges": {
                    "top_rated": False
                },
                "source": "Best Buy",
            },
            "specifications": []
        }
        self.assertEqual(result, expected)

    def test_product_specs_id_does_not_exist(self):
        self.mock_search.return_value = product_specs_nonexistent
        product_id = "22222"
        result = BestBuyProduct.product_specs(product_id)
        expected = {
            "basic_info": {"error": "The product id does not exist.", "product_id": product_id}
        }
        self.assertEqual(result, expected)

    def test_product_specs_id_api_error(self):
        self.mock_search.return_value = spec_api_error
        product_id = "0"
        result = BestBuyProduct.product_specs(product_id)
        expected = {
            "basic_info": {
                "error": "Error Code: 400 - Could not complete request.", 
                "product_id": product_id
            }
        }
        self.assertEqual(result, expected)

    def test_product_specs_keys_missing(self):
        self.mock_search.return_value = product_specs_missing_keys
        product_id = "33333"
        result = BestBuyProduct.product_specs(product_id)
        expected = {
            "basic_info": {
                "us_item_id": product_id,
                "product_id": product_id,
                "model_number": None,
                "manufacturer": None,
                "upc": None,
                "title": None,
                "product_page_url": "https://example.com",
                "price": {"amount": None, "currency": None},
                "images": [],
                "total_reviews": 500,
                "rating": 4.1,
                "badges": {
                    "top_rated": None,
                },
                "source": "Best Buy"
            },
            "specifications": []
        }
        self.assertEqual(result, expected)

    def test_product_reviews_id_exists(self):
        self.mock_search.side_effect = [all_products_returned, product_reviews_exists]
        result = BestBuyProduct.product_reviews("New Product Title")
        expected = {
            "reviews": {
                "reviews": ["Good", "Bad", "Okay", "Terrible", "The best"],
                "top_negative": {'rating': 1, 'text': "Terrible", 'title': "Terrible"},
                "top_positive": {'rating': 5, 'text': "The best", 'title': "The best"}
            }
        }
        self.assertEqual(result, expected)

    def test_product_reviews_search_id_does_not_exist(self):
        self.mock_search.return_value = no_products_returned
        result = BestBuyProduct.product_reviews("AAAAA")
        expected = {"reviews": {"error": "The product has no reviews."}}
        self.assertEqual(result, expected)

    def test_product_reviews_id_does_not_exist(self):
        self.mock_search.side_effect = [all_products_returned, product_reviews_nonexistent]
        result = BestBuyProduct.product_reviews("AAAAA")
        expected = {"reviews": {"error": "The product has no reviews."}}
        self.assertEqual(result, expected)

    def test_product_reviews_api_error(self):
        self.mock_search.return_value = review_api_error
        result = BestBuyProduct.product_reviews("AAAAA")
        expected = {
            "reviews": {
                "error": "Error Code: 400 - Could not complete request.", 
            }
        }
        self.assertEqual(result, expected)
