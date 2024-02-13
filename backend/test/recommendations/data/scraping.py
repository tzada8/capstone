import requests_mock
import mock

trending_exists = requests_mock.Mocker()
trending_exists.json = mock.Mock(
    return_value = {
        "results": [
            {
                "sku": "111",
                "rank": 1
            },
            {
                "sku": "222",
                "rank": 2
            },
            {
                "sku": "333",
                "rank": 3
            },
        ]
    }
)

trending_nonexistent = requests_mock.Mocker()
trending_nonexistent.json = mock.Mock(
    return_value = {
        "results": []
    }
)

popular_exists = requests_mock.Mocker()
popular_exists.json = mock.Mock(
    return_value = {
        "results": [
            {
                "sku": "111",
                "rank": 1
            },
            {
                "sku": "222",
                "rank": 2
            },
            {
                "sku": "444",
                "rank": 3
            },
        ]
    }
)

popular_nonexistent = requests_mock.Mocker()
popular_nonexistent.json = mock.Mock(
    return_value = {
        "results": []
    }
)

sku_to_upc_exists = requests_mock.Mocker()
sku_to_upc_exists.json = mock.Mock(
    return_value = {
        "total": 4,
        "products": [
            {
                "sku": "111",
                "upc": "0111"
            },
            {
                "sku": "222",
                "upc": "0222"
            },
            {
                "sku": "333",
                "upc": "0333"
            },
            {
                "sku": "444",
                "upc": "0444"
            },
        ]
    }
)

sku_to_upc_nonexistent = requests_mock.Mocker()
sku_to_upc_nonexistent.json = mock.Mock(
    return_value = {
        "total": 0
    }
)

master_list = {
    "0111": 2,
    "0222": 4,
    "0333": 7,
    "0444": 7
}