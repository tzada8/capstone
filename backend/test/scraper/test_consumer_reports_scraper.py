import unittest
from unittest.mock import patch

from test.scraper.data.consumer_reports.expert_reviews import \
    all_products_returned, expert_reviews_returned, expert_reviews_no_bottomline
from src.scraper.consumer_reports_scraper import scrape_expert_reviews

class TestConsumerReportsScraper(unittest.TestCase):
    def setUp(self):
        self.mock_search = patch("src.scraper.consumer_reports_scraper.requests.get").start()

    def tearDown(self):
        self.mock_search.stop()

    def test_scrape_expert_reviews_upc_exists(self):
        self.mock_search.side_effect = [all_products_returned, expert_reviews_returned]
        query = "AAAAA"
        result = scrape_expert_reviews(query, 11111, "defaultUpc")
        expected = {
            "expert_review": {
                "review": "It was okay.",
                "score": "75/100",
                "source": "Consumer Reports",
                "link": "https://www.consumerreports.org/electronics-computers/cameras/brand-model/m111/",
            } 
        }
        self.assertEqual(result, expected)

    def test_scrape_expert_reviews_walmart_id_exists(self):
        self.mock_search.side_effect = [all_products_returned, expert_reviews_returned]
        query = "AAAAA"
        result = scrape_expert_reviews(query, "11111", "walmartId")
        expected = {
            "expert_review": {
                "review": "It was okay.",
                "score": "75/100",
                "source": "Consumer Reports",
                "link": "https://www.consumerreports.org/electronics-computers/cameras/brand-model/m111/",
            } 
        }
        self.assertEqual(result, expected)

    def test_scrape_expert_reviews_no_bottomline(self):
        self.mock_search.side_effect = [all_products_returned, expert_reviews_no_bottomline]
        query = "AAAAA"
        result = scrape_expert_reviews(query, "11111", "walmartId")
        expected = {
            "expert_review": {
                "review": "It was okay.",
                "score": "75/100",
                "source": "Consumer Reports",
                "link": "https://www.consumerreports.org/electronics-computers/cameras/brand-model/m111/",
            } 
        }
        self.assertEqual(result, expected)

    def test_scrape_expert_reviews_upc_no_match(self):
        self.mock_search.side_effect = [all_products_returned, expert_reviews_returned]
        query = "AAAAA"
        result = scrape_expert_reviews(query, 22222, "defaultUpc")
        expected = {
            "expert_review": {
                "product": "AAAAA",
                "error": "The review for this product does not exist.",
            }
        }
        self.assertEqual(result, expected)

    def test_scrape_expert_reviews_walmart_id_no_match(self):
        self.mock_search.side_effect = [all_products_returned, expert_reviews_returned]
        query = "AAAAA"
        result = scrape_expert_reviews(query, "22222", "walmartId")
        expected = {
            "expert_review": {
                "product": "AAAAA",
                "error": "The review for this product does not exist.",
            }
        }
        self.assertEqual(result, expected)
