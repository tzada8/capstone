import unittest
from unittest.mock import patch

from test.scraper.data.consumer_reports.expert_reviews import \
    all_products_returned, expert_reviews_returned, expert_reviews_no_bottomline, valid_status, invalid_status, api_error
from src.scraper.consumer_reports_scraper import scrape_expert_reviews

class TestConsumerReportsScraper(unittest.TestCase):
    def setUp(self):
        self.mock_search = patch("src.scraper.consumer_reports_scraper.requests.get").start()

    def tearDown(self):
        self.mock_search.stop()

    def test_scrape_expert_reviews_match(self):
        self.mock_search.side_effect = [all_products_returned, expert_reviews_returned, valid_status]
        query = "AAAAA"
        result = scrape_expert_reviews(query)
        expected = {
            "expert_review": {
                "review": "It was okay.",
                "score": "75/100",
                "source": "Consumer Reports",
                "link": "https://www.consumerreports.org/electronics-computers/cameras/brand-model/m111/",
            } 
        }
        self.assertEqual(result, expected)

    def test_scrape_expert_reviews_no_match(self):
        self.mock_search.side_effect = [all_products_returned, expert_reviews_returned, valid_status]
        query = "ZZZZZ"
        result = scrape_expert_reviews(query)
        expected = {
            "expert_review": {
                "product": "ZZZZZ",
                "error": "The review for this product does not exist.",
            }
        }
        self.assertEqual(result, expected)

    def test_scrape_expert_reviews_no_bottomline(self):
        self.mock_search.side_effect = [all_products_returned, expert_reviews_no_bottomline, valid_status]
        query = "AAAAA"
        result = scrape_expert_reviews(query)
        expected = {
            "expert_review": {
                "review": "It was okay.",
                "score": "75/100",
                "source": "Consumer Reports",
                "link": "https://www.consumerreports.org/electronics-computers/cameras/brand-model/m111/",
            } 
        }
        self.assertEqual(result, expected)

    def test_scrape_expert_reviews_invalid_link(self):
        self.mock_search.side_effect = [all_products_returned, expert_reviews_returned, invalid_status]
        query = "AAAAA"
        result = scrape_expert_reviews(query)
        expected = {
            "expert_review": {
                "review": "It was okay.",
                "score": "75/100",
                "source": "Consumer Reports",
                "link": None,
            }
        }
        self.assertEqual(result, expected)

    def test_scrape_expert_reviews_search_api_error(self):
        self.mock_search.return_value = api_error
        query = "AAAAA"
        result = scrape_expert_reviews(query)
        expected = {
            "expert_review": {
                "error": "Could not complete request.",
                "product": "AAAAA"
            } 
        }
        self.assertEqual(result, expected)

    def test_scrape_expert_reviews_product_api_error(self):
        self.mock_search.side_effect = [all_products_returned, api_error]
        query = "AAAAA"
        result = scrape_expert_reviews(query)
        expected = {
            "expert_review": {
                "error": "Could not complete request.",
                "product": "AAAAA"
            } 
        }
        self.assertEqual(result, expected)
