import unittest
from unittest.mock import patch

from test.recommendations.data.scraping import \
    trending_exists, trending_nonexistent, popular_exists, popular_nonexistent, sku_to_upc_exists, sku_to_upc_nonexistent, master_list
from test.recommendations.data.preferences import \
    preferences_filled, preferences_some_missing, preferences_all_missing, importance
from test.recommendations.data.products import products
from src.recommendations.recommendations import Recommendation

class TestRecommendation(unittest.TestCase):
    def setUp(self):
        self.mock_search = patch("src.recommendations.recommendations.requests.get").start()

    def tearDown(self):
        self.mock_search.stop()

    def test_scraping_exists(self):
        self.mock_search.side_effect = [trending_exists, popular_exists, sku_to_upc_exists]
        result = Recommendation._scrape_bestbuy()
        expected = [master_list, 3, 3]
        self.assertEqual(result, expected)

    def test_trending_nonexistent(self):
        self.mock_search.side_effect = [trending_nonexistent, popular_exists, sku_to_upc_exists]
        result = Recommendation._scrape_bestbuy()
        expected = [{}, 0, 3]
        self.assertEqual(result, expected)

    def test_popular_nonexistent(self):
        self.mock_search.side_effect = [trending_exists, popular_nonexistent, sku_to_upc_exists]
        result = Recommendation._scrape_bestbuy()
        expected = [{}, 3, 0]
        self.assertEqual(result, expected)

    def test_sku_to_upc_nonexistent(self):
        self.mock_search.side_effect = [trending_exists, popular_exists, sku_to_upc_nonexistent]
        result = Recommendation._scrape_bestbuy()
        expected = [{}, 3, 3]
        self.assertEqual(result, expected)

    def test_preferences_complete(self):
        result = Recommendation._model(preferences_filled, importance, products, master_list, 6)
        expected = [
            {
                "product_id": "444",
                "title": "New Product Title",
                "price": 600.0,
                "source": "Walmart",
                "score": 3.28,
            },
            {
                "product_id": "111",
                "title": "New Product Title",
                "price": 300.0,
                "source": "Best Buy",
                "score": 1.97,
            },
            {
                "product_id": "999",
                "title": "New Product Title",
                "price": None,
                "source": "Best Buy",
                "score": 0.00,
            },
        ]
        self.assertEqual(result, expected)

    def test_preferences_semi_complete(self):
        result = Recommendation._model(preferences_some_missing, importance, products, master_list, 6)
        expected = [
            {
                "product_id": "444",
                "title": "New Product Title",
                "price": 600.0,
                "source": "Walmart",
                "score": 4.02,
            },
            {
                "product_id": "111",
                "title": "New Product Title",
                "price": 300.0,
                "source": "Best Buy",
                "score": 3.20,
            },
            {
                "product_id": "999",
                "title": "New Product Title",
                "price": None,
                "source": "Best Buy",
                "score": 1.97,
            },
        ]
        self.assertEqual(result, expected)

    def test_preferences_not_complete(self):
        result = Recommendation._model(preferences_all_missing, importance, products, master_list, 6)
        expected = [
            {
                "product_id": "111",
                "title": "New Product Title",
                "price": 300.0,
                "source": "Best Buy",
                "score": 4.67,
            },
            {
                "product_id": "444",
                "title": "New Product Title",
                "price": 600.0,
                "source": "Walmart",
                "score": 4.02,
            },
            {
                "product_id": "999",
                "title": "New Product Title",
                "price": None,
                "source": "Best Buy",
                "score": 3.69,
            },
        ]
        self.assertEqual(result, expected)

    def test_aggregate_all_populated(self):
        self.mock_search.side_effect = [trending_exists, popular_exists, sku_to_upc_exists]
        result = Recommendation.aggregate_data(preferences_filled, importance, products)
        expected = [
            {
                "product_id": "444",
                "title": "New Product Title",
                "price": 600.0,
                "source": "Walmart",
                "score": 3.28,
            },
            {
                "product_id": "111",
                "title": "New Product Title",
                "price": 300.0,
                "source": "Best Buy",
                "score": 1.97,
            },
            {
                "product_id": "999",
                "title": "New Product Title",
                "price": None,
                "source": "Best Buy",
                "score": 0.00,
            },
        ]
        self.assertEqual(result, expected)