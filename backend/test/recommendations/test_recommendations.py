import unittest
from unittest.mock import patch

from test.recommendations.data.scraping import \
    trending_exists, trending_nonexistent, popular_exists, popular_nonexistent, api_error, sku_to_upc_exists, sku_to_upc_nonexistent, master_list
from test.recommendations.data.preferences import \
    preferences_filled, preferences_some_missing, preferences_all_missing, importance_filled, importance_some_missing, importance_all_missing
from test.recommendations.data.products import products
from src.recommendations.recommendations import Recommendation

class TestRecommendation(unittest.TestCase):
    def setUp(self):
        self.mock_search = patch("src.recommendations.recommendations.requests.get").start()

    def tearDown(self):
        self.mock_search.stop()

    def test_scraping_exists(self):
        self.mock_search.side_effect = [trending_exists, popular_exists, sku_to_upc_exists]
        result = Recommendation._scrape_popularity()
        expected = [master_list, 3, 3]
        self.assertEqual(result, expected)

    def test_trending_nonexistent(self):
        self.mock_search.side_effect = [trending_nonexistent, popular_exists, sku_to_upc_exists]
        result = Recommendation._scrape_popularity()
        expected = [{}, 0, 3]
        self.assertEqual(result, expected)

    def test_popular_nonexistent(self):
        self.mock_search.side_effect = [trending_exists, popular_nonexistent, sku_to_upc_exists]
        result = Recommendation._scrape_popularity()
        expected = [{}, 3, 0]
        self.assertEqual(result, expected)

    def test_sku_to_upc_nonexistent(self):
        self.mock_search.side_effect = [trending_exists, popular_exists, sku_to_upc_nonexistent]
        result = Recommendation._scrape_popularity()
        expected = [{}, 0, 0]
        self.assertEqual(result, expected)

    def test_trending_error(self):
        self.mock_search.side_effect = [api_error, popular_exists, sku_to_upc_exists]
        result = Recommendation._scrape_popularity()
        expected = [{}, 0, 0]
        self.assertEqual(result, expected)

    def test_popular_error(self):
        self.mock_search.side_effect = [trending_exists, api_error, sku_to_upc_exists]
        result = Recommendation._scrape_popularity()
        expected = [{}, 0, 0]
        self.assertEqual(result, expected)

    def test_sku_to_upc_error(self):
        self.mock_search.side_effect = [trending_exists, popular_exists, api_error]
        result = Recommendation._scrape_popularity()
        expected = [{}, 0, 0]
        self.assertEqual(result, expected)

    def test_preferences_complete(self):
        result = Recommendation._model(preferences_filled, importance_filled, products, master_list, 6)
        expected = [
            {
                "product_id": "111",
                "title": "New Product Title",
                "price": 300.0,
                "source": "Best Buy",
                "score": 4.09,
            },
            {
                "product_id": "444",
                "title": "New Product Title",
                "price": 600.0,
                "source": "Walmart",
                "score": 1.60,
            },
            {
                "product_id": "999",
                "title": "New Product Title",
                "price": None,
                "source": "Best Buy",
                "score": 0.78,
            },
        ]
        self.assertEqual(result, expected)

    def test_preferences_semi_complete(self):
        result = Recommendation._model(preferences_some_missing, importance_filled, products, master_list, 6)
        expected = [
            {
                "product_id": "111",
                "title": "New Product Title",
                "price": 300.0,
                "source": "Best Buy",
                "score": 4.09,
            },
            {
                "product_id": "444",
                "title": "New Product Title",
                "price": 600.0,
                "source": "Walmart",
                "score": 3.49,
            },
            {
                "product_id": "999",
                "title": "New Product Title",
                "price": None,
                "source": "Best Buy",
                "score": 2.67,
            },
        ]
        self.assertEqual(result, expected)

    def test_preferences_not_complete(self):
        result = Recommendation._model(preferences_all_missing, importance_filled, products, master_list, 6)
        self.maxDiff = None
        expected = [
            {
                "product_id": "111",
                "title": "New Product Title",
                "price": 300.0,
                "source": "Best Buy",
                "score": 4.41,
            },
            {
                "product_id": "444",
                "title": "New Product Title",
                "price": 600.0,
                "source": "Walmart",
                "score": 3.49,
            },
            {
                "product_id": "999",
                "title": "New Product Title",
                "price": None,
                "source": "Best Buy",
                "score": 3.15,
            },
        ]
        self.assertEqual(result, expected)

    def test_importance_semi_complete(self):
        result = Recommendation._model(preferences_filled, importance_some_missing, products, master_list, 6)
        expected = [
            {
                "product_id": "111",
                "title": "New Product Title",
                "price": 300.0,
                "source": "Best Buy",
                "score": 3.79,
            },
            {
                "product_id": "444",
                "title": "New Product Title",
                "price": 600.0,
                "source": "Walmart",
                "score": 1.55,
            },
            {
                "product_id": "999",
                "title": "New Product Title",
                "price": None,
                "source": "Best Buy",
                "score": 0.26,
            },
        ]
        self.assertEqual(result, expected)

    def test_importance_not_complete(self):
        result = Recommendation._model(preferences_filled, importance_all_missing, products, master_list, 6)
        expected = [
            {
                "product_id": "111",
                "title": "New Product Title",
                "price": 300.0,
                "source": "Best Buy",
                "score": 3.93,
            },
            {
                "product_id": "444",
                "title": "New Product Title",
                "price": 600.0,
                "source": "Walmart",
                "score": 1.94,
            },
            {
                "product_id": "999",
                "title": "New Product Title",
                "price": None,
                "source": "Best Buy",
                "score": 0.45,
            },
        ]
        self.assertEqual(result, expected)

    def test_all_not_complete(self):
        result = Recommendation._model(preferences_all_missing, importance_all_missing, products, master_list, 6)
        expected = [
            {
                "product_id": "111",
                "title": "New Product Title",
                "price": 300.0,
                "source": "Best Buy",
                "score": 4.48,
            },
            {
                "product_id": "444",
                "title": "New Product Title",
                "price": 600.0,
                "source": "Walmart",
                "score": 3.59,
            },
            {
                "product_id": "999",
                "title": "New Product Title",
                "price": None,
                "source": "Best Buy",
                "score": 3.22,
            },
        ]
        self.assertEqual(result, expected)

    def test_aggregate_all_populated(self):
        self.mock_search.side_effect = [trending_exists, popular_exists, sku_to_upc_exists]
        result = Recommendation.aggregate_data(preferences_filled, importance_filled, products)
        expected = [
            {
                "product_id": "111",
                "title": "New Product Title",
                "price": 300.0,
                "source": "Best Buy",
                "score": 4.09,
            },
            {
                "product_id": "444",
                "title": "New Product Title",
                "price": 600.0,
                "source": "Walmart",
                "score": 1.60,
            },
            {
                "product_id": "999",
                "title": "New Product Title",
                "price": None,
                "source": "Best Buy",
                "score": 0.78,
            },
        ]
        self.assertEqual(result, expected)