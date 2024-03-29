import unittest
from unittest.mock import patch

from src.summarize.summarize import summarize

# TODO: Impove test by confirming .create() call_args takes in bullet list of reviews.
class TestSummarize(unittest.TestCase):
    def test_summarize_no_reviews(self):
        reviews = []
        result = summarize(reviews)
        expected = []
        self.assertEqual(result, expected)

    @patch("src.summarize.summarize.OpenAI")
    def test_summarize_with_reviews(self, openai_mock):
        reviews = [
            "This product stinks",
            "One of the best purchases I ever made",
            "I was wondering why it was so expensive, but after purchasing, I know it was definitely worth my money",
            "I'mm stll lrning to tpe, but my fvorite prodct ever",
            "4.5 stars? How is that possible. Should have a negative rating",
        ]
        summarize(reviews)
        kwargs = openai_mock.call_args.kwargs
        expected = {"api_key": None}
        self.assertEqual(kwargs, expected)

    @patch("src.summarize.summarize.OpenAI")
    def test_summarize_under_4000_tokens(self, openai_mock):
        reviews = ["two words"] * 5000
        summarize(reviews)
        kwargs = openai_mock.call_args.kwargs
        expected = {"api_key": None}
        self.assertEqual(kwargs, expected)
