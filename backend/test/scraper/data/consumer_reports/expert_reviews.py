import requests_mock
import mock

all_products_returned = requests_mock.Mocker()
all_products_returned.json = mock.Mock(
    return_value = {
        "content": [
            {
                "modelName": "AAAAA",
                "_id": "11111",
            },
            {
                "modelName": "BBBBB",
                "_id": "22222",
            }
        ]
    }
)

expert_reviews_returned = requests_mock.Mocker()
expert_reviews_returned.json = mock.Mock(
    return_value = {
        "content": [
            {
                "expertReview": {
                    "bottomLine": "It was okay.",
                },
                "overallDisplayScore": 75,
                "slugName": "brand-model-111",
                "defaultUpc": "11111",
                "walmartId": 11111,
            } 
        ]
    }
)

expert_reviews_no_bottomline = requests_mock.Mocker()
expert_reviews_no_bottomline.json = mock.Mock(
    return_value = {
        "content": [
            {
                "expertReview": {
                    "summary": "It was okay.",
                },
                "overallDisplayScore": 75,
                "slugName": "brand-model-111",
                "defaultUpc": "11111",
                "walmartId": 11111,
            } 
        ]
    }
)