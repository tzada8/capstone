import unittest
from unittest.mock import patch

from test.scraper.data.walmart.product_specs import \
    product_specs_exists, product_specs_nonexistent, product_specs_missing_keys
from test.scraper.data.walmart.product_reviews import \
    product_reviews_exists, product_reviews_nonexistent, product_reviews_missing_keys
from src.scraper.walmart_scraper import WalmartProduct

class TestWalmartProduct(unittest.TestCase):
    def setUp(self):
        self.mock_search = patch("src.scraper.walmart_scraper.GoogleSearch.get_dict").start()
        self.mock_summarize = patch(
            "src.scraper.walmart_scraper.summarize",
            return_value="Overall some reviews are positive and some are negative."
        ).start()

    def tearDown(self):
        self.mock_search.stop()
        self.mock_summarize.stop()

    def test_product_specs_id_exists(self):
        self.mock_search.return_value = product_specs_exists
        product_id = "11111"
        result = WalmartProduct._product_specs(product_id)
        expected = {
            "basic_info": {
                "us_item_id": product_id,
                "product_id": "aaaaa",
                "title": "New Product Title",
                "product_page_url": "https://example.com",
                "price": {"amount": 100.0, "currency": "USD"},
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
        result = WalmartProduct._product_specs(product_id)
        expected = {
            "basic_info": {"error": "The product id does not exist.", "product_id": product_id}
        }
        self.assertEqual(result, expected)

    def test_product_specs_keys_missing(self):
        self.mock_search.return_value = product_specs_missing_keys
        product_id = "33333"
        result = WalmartProduct._product_specs(product_id)
        expected = {
            "basic_info": {
                "us_item_id": product_id,
                "product_id": "ccccc",
                "title": None,
                "product_page_url": "https://example.com",
                "price": {"amount": None, "currency": None},
                "images": [],
                "total_reviews": 500,
                "rating": 4.1
            },
            "specifications": []
        }
        self.assertEqual(result, expected)

    def test_product_reviews_id_exists(self):
        self.mock_search.return_value = product_reviews_exists
        product_id = "11111"
        result = WalmartProduct._product_reviews(product_id)
        expected = {
            "reviews": {
                "ratings": [
                    {"count": 1, "stars": 1},
                    {"count": 100, "stars": 2},
                    {"count": 100, "stars": 3},
                    {"count": 50, "stars": 4},
                    {"count": 1000, "stars": 5}
                ],
                "reviews": ["Good", "Bad", "Okay", "Terrible", "The best"],
                "summary": "Overall some reviews are positive and some are negative.",
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
        result = WalmartProduct._product_reviews(product_id)
        expected = {"reviews": {"error": "No reviews exist for provided id."}}
        self.assertEqual(result, expected)

    def test_product_reviews_keys_missing(self):
        self.mock_search.return_value = product_reviews_missing_keys
        product_id = "33333"
        result = WalmartProduct._product_reviews(product_id)
        expected = {
            "reviews": {
                "ratings": [
                    {"count": 1, "stars": 1},
                    {"count": 100, "stars": 2},
                    {"count": 100, "stars": 3},
                    {"count": 50, "stars": 4},
                    {"count": 1000, "stars": 5}
                ],
                "reviews": ["Good", "Bad", "Okay", "Terrible", "The best"],
                "summary": "Overall some reviews are positive and some are negative.",
                "top_negative": {"rating": None, "text": None, "title": None},
                "top_positive": {"rating": None, "text": None, "title": None},
            }
        }
        self.assertEqual(result, expected)

    @patch("src.scraper.walmart_scraper.summarize")
    def test_aggregate_data_id_exists(self, summarize_mock):
        summarize_mock.return_value = "Overall some reviews are positive and some are negative."
        self.maxDiff = None
        self.mock_search.side_effect = [product_specs_exists, product_reviews_exists]
        product_id = "11111"
        result = WalmartProduct.aggregate_data(product_id)
        expected = {
            "basic_info": {
                "us_item_id": product_id,
                "product_id": "aaaaa",
                "title": "New Product Title",
                "product_page_url": "https://example.com",
                "price": {"amount": 100.0, "currency": "USD"},
                "images": ["https://image1.png", "https://image2.jpeg"],
                "total_reviews": 500,
                "rating": 4.1,
            },
            "specifications": [
                {"name": "Colour", "value": "Red"},
                {"name": "Size", "value": "Small"},
            ],
            "reviews": {
                "ratings": [
                    {"count": 1, "stars": 1},
                    {"count": 100, "stars": 2},
                    {"count": 100, "stars": 3},
                    {"count": 50, "stars": 4},
                    {"count": 1000, "stars": 5}
                ],
                "reviews": ["Good", "Bad", "Okay", "Terrible", "The best"],
                "summary": "Overall some reviews are positive and some are negative.",
                "top_negative": {
                    "rating": 1, "text": "Do not buy this product", "title": "Worst Product",
                },
                "top_positive": {
                    "rating": 5, "text": "This product is a must-buy", "title": "Best Product",
                }
            }
        }
        self.assertEqual(result, expected)
