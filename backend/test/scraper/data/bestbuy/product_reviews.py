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
                "customerReviewCount": 5,
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
        "total": 7,
        "reviews": [
            {"comment": "[This review was collected as part of a promotion.] Good", "rating": 4, "title": "Good"},
            {"comment": "Bad", "rating": 2, "title": "Bad"},
            {"comment": "[This review was collected as part of a promotion.] Okay", "rating": 3, "title": "Okay"},
            {"comment": "Terrible", "rating": 1, "title": "Terrible"},
            {"comment": "The best", "rating": 5, "title": "The best"},
            {"rating": 1, "title": "The best"},
            {"comment": "", "rating": 2, "title": "The best"},
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

product_reviews_exists_threading = requests_mock.Mocker()
product_reviews_exists_threading.starmap = mock.ThreadingMock(
    return_value = [[
            {"comment": "[This review was collected as part of a promotion.] Good", "rating": 4, "title": "Good"},
            {"comment": "Bad", "rating": 2, "title": "Bad"},
            {"comment": "[This review was collected as part of a promotion.] Okay", "rating": 3, "title": "Okay"},
            {"comment": "Terrible", "rating": 1, "title": "Terrible"},
            {"comment": "The best", "rating": 5, "title": "The best"},
        ]]
)

product_reviews_nonexistent = requests_mock.Mocker()
product_reviews_nonexistent.json = mock.Mock(
    return_value = {
        "total" : 0,
        "reviews": []
    }
)
