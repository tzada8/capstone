products_valid = {
    "search_metadata": {
        "status": "Success",
    },
    "shopping_results": [
        {
            "position": 1,
            "title": "Product 1",
            "link": "https://example1.com",
            "source": "Walmart",
            "price": "$100.00",
            "extracted_price": 100.00,
            "rating": 4.5,
            "reviews": 2,
            "extensions": ["Black", "Videos"],
            "thumbnail": "https://thumbnail1.com",
        },
    ],
    "serpapi_pagination": {
        "current": 1,
        "next": "https://next-page.com",
        "other_pages": {
            "https://next-page.com",
            "https://page3.com",
        }
    }
}

products_invalid = {
    "search_metadata": {
        "status": "Error",
    },
    "error": "An error occurred while attempting to pull products.",
}
