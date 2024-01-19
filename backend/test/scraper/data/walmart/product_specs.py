product_specs_exists = {
    "product_result": {
        "us_item_id": "11111",
        "product_id": "aaaaa",
        "title": "New Product Title",
        "product_page_url": "https://example.com",
        "price_map": {
            "price": 100.0,
            "currency": "USD",
        },
        "images": ["https://image1.png", "https://image2.jpeg"],
        "reviews": 500,
        "rating": 4.1,
        "specification_highlights": [
            {
                "display_name": "Colour",
                "value": "Red",
            },
            {
                "display_name": "Size",
                "value": "Small",
            }
        ],
        "extra_info": {
            "field1": "Not included",
            "field2": "Excluded too",
        },
    }
}

product_specs_nonexistent = {
    "search_parameters": {
        "product_id": "22222",
    },
    "error": "The product id does not exist.",
    "extra_info": {
        "field1": "Not included",
        "field2": "Excluded too",
    },
}

# Missing title, price, images, and specs.
product_specs_missing_keys = {
    "product_result": {
        "us_item_id": "33333",
        "product_id": "ccccc",
        "product_page_url": "https://example.com",
        "reviews": 500,
        "rating": 4.1,
        "extra_info": {
            "field1": "Not included",
            "field2": "Excluded too",
        },
    }
}
