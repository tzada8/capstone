import requests_mock
import mock

product_specs_exists = requests_mock.Mocker()
product_specs_exists.json = mock.Mock(
    return_value = {
        "products": [{
            "us_item_id": "11111",
            "sku": "aaaaa",
            "modelNumber": "12345",
            "manufacturer": "AAAAA",
            "upc": "00000",
            "name": "New Product Title",
            "url": "https://example.com",
            "regularPrice": 100.0,
            "currency": "USD",
            "image": ["https://image1.png", "https://image2.jpeg"],
            "customerReviewCount": 500,
            "customerReviewAverage": 4.1,
            "details": [
                {
                    "name": "Colour",
                    "value": "Red",
                },
                {
                    "name": "Size",
                    "value": "Small",
                }
            ],
            "customerTopRated": False,
            "source": "Best Buy",
            "extra_info": {
                "field1": "Not included",
                "field2": "Excluded too",
            },
        }]
    }
)

product_specs_nonexistent = requests_mock.Mocker()
product_specs_nonexistent.json = mock.Mock(
    return_value = {
        "product_id": "22222",
        "total": 0,
        "extra_info": {
            "field1": "Not included",
            "field2": "Excluded too",
        },
    }
)

product_specs_incorrect_format = requests_mock.Mocker()
product_specs_incorrect_format.json = mock.Mock(
    return_value = {
        "product_id": "0",
        "errorCode": "400",
        "errorMessage": "The request is missing key information or is malformed.",
        "extra_info": {
            "field1": "Not included",
            "field2": "Excluded too",
        },
    }
)

# Missing title, price, images, and specs.
product_specs_missing_keys = requests_mock.Mocker()
product_specs_missing_keys.json = mock.Mock(
    return_value = {
        "products": [{
            "us_item_id": "33333",
            "sku": "ccccc",
            "url": "https://example.com",
            "customerReviewCount": 500,
            "customerReviewAverage": 4.1,
            "extra_info": {
                "field1": "Not included",
                "field2": "Excluded too",
            },
        }]
    }
)