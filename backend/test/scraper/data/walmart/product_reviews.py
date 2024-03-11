product_reviews_exists = {
    "ratings": [
        {"count": 1, "stars": 1},
        {"count": 100, "stars": 2},
        {"count": 100, "stars": 3},
        {"count": 50, "stars": 4},
        {"count": 1000, "stars": 5},
    ],
    "top_positive": {
        "title": "Best Product",
        "text": "This product is a must-buy",
        "rating": 5,
    },
    "top_negative": {
        "title": "Worst Product",
        "text": "Do not buy this product",
        "rating": 1,
    },
    "reviews": [
        {"text": "Good"},
        {"text": "Bad"},
        {"text": "Okay"},
        {"text": "Terrible"},
        {"text": "The best"},
        {"text": None}
    ],
    "extra_info": {
        "field1": "Not included",
        "field2": "Excluded too",
    },
}

product_reviews_nonexistent = {
    "error": "No reviews exist for provided id.",
    "extra_info": {
        "field1": "Not included",
        "field2": "Excluded too",
    },
}

# Missing top positive and top negative.
product_reviews_missing_keys = {
    "ratings": [
        {"count": 1, "stars": 1},
        {"count": 100, "stars": 2},
        {"count": 100, "stars": 3},
        {"count": 50, "stars": 4},
        {"count": 1000, "stars": 5},
    ],
    "reviews": [
        {"text": "Good"},
        {"text": "Bad"},
        {"text": "Okay"},
        {"text": "Terrible"},
        {"text": "The best"},
    ],
    "extra_info": {
        "field1": "Not included",
        "field2": "Excluded too",
    },
}

review_api_error = {
    "error": "Could not complete request."
}