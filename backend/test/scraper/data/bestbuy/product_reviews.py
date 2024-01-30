import requests_mock
import mock

all_products_returned = requests_mock.Mocker()
all_products_returned.json = mock.Mock(
    return_value = {
        "total" : 1,
        "products": [
            {
                "sku": "123456",
                "name": "New Product Title 2",
            }
        ]
    }
)

no_products_returned = requests_mock.Mocker()
no_products_returned.json = mock.Mock(
    return_value = {
        "total" : 0,
        "products": []
    }
)

product_reviews_exists = requests_mock.Mocker()
product_reviews_exists.json = mock.Mock(
    return_value = {
        "totalPages": 1,
        "reviews": [
            {"comment": "Good"},
            {"comment": "Bad"},
            {"comment": "Okay"},
            {"comment": "Terrible"},
            {"comment": "The best"},
        ],
        "RatingSummary": {
            "OneStarCount": 1,
            "TwoStarCount": 100,
            "ThreeStarCount": 100,
            "FourStarCount": 50,
            "FiveStarCount": 1000,
        }
    }
)

product_reviews_nonexistent = requests_mock.Mocker()
product_reviews_nonexistent.json = mock.Mock(
    return_value = {
        "total" : 0,
        "reviews": []
    }
)
