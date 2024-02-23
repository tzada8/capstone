from flask import Flask, request
from flask_cors import CORS
from os import environ

from src.scraper.google_shopping_scraper import scrape_google_products
from src.recommendations.recommendations import Recommendation
from src.scraper.bestbuy_scraper import BestBuyProduct
from src.scraper.walmart_scraper import WalmartProduct
from src.scraper.consumer_reports_scraper import scrape_expert_reviews
from src.scraper.youtube_scraper import scrape_videos
from src.summarize.summarize import summarize

# TODO: DELETE AFTER FRONTEND FUNCTIONALITY IS IMPLEMENTED.
import time
from dummy_data.dummy_search_products import dummy_search_products, dummy_search_products2
from dummy_data.dummy_recommendation import dummy_recommendation
from dummy_data.dummy_product import dummy_product
from dummy_data.dummy_recommendation_products import dummy_recommendation_products
from dummy_data.dummy_preferences import dummy_preferences, dummy_importance

app = Flask(__name__)
CORS(app)

@app.route("/")
def default_backend():
    key = environ.get("EXAMPLE_ENV", "does not exist")
    env = environ.get("FLASK_ENV", "does not exist")
    return {"message": "Routing to backend home GET", "key": key, "env": env}

@app.route("/api/search-products")
def search_products():
    q = request.args.get("q")
    start = request.args.get("start", 0)
    return scrape_google_products(q, int(start))

@app.route("/api/recommendation", methods=["POST"])
def recommendation():
    data = request.get_json()
    return Recommendation.aggregate_data(data["preferences"], data["importance"], data["selected_products"])

@app.route("/api/product")
def product():
    product_id = request.args.get("product_id")
    source = request.args.get("source")

    product_data = {}
    source_details = {}
    if "Best Buy" in source:
        product_data = BestBuyProduct.aggregate_data(product_id)
        # TODO: Could match expert reviews on model_number/defaultMpc too.
        source_details = {"product_id": product_data["basic_info"].get("upc"), "id_field": "defaultUpc"}
    elif "Walmart" in source:
        product_data = WalmartProduct.aggregate_data(product_id)
        source_details = {"product_id": product_id, "id_field": "walmartId"}

    # Summarize reviews.
    text_reviews = product_data["reviews"].get("reviews")
    if text_reviews:
        summary = {"summary": summarize(text_reviews)}
        product_data["reviews"].update(summary)
        del product_data["reviews"]["reviews"]

    # Scrape YouTube videos.
    title = product_data["basic_info"].get("title")
    if title:
        product_data.update(scrape_videos(title))

    # Scrape Expert reviews.
    if title:
        product_data.update(scrape_expert_reviews(title, source_details["product_id"], source_details["id_field"]))

    return product_data


# TODO: Can remove endpoint.
# Note: Was testing with product_id "6522416" (exists) and "0" (does not exist).
@app.route("/api/bestbuy-product")
def bestbuy_product():
    product_id = request.args.get("product_id")
    product_data = BestBuyProduct.aggregate_data(product_id)

    text_reviews = product_data["reviews"].get("reviews")
    if text_reviews:
        # TODO: Can probably drop "reviews" field.
        summary = {"summary": summarize(text_reviews)}
        product_data["reviews"].update(summary)

    # Scrape YouTube videos.
    title = product_data["basic_info"].get("title")
    if title:
        product_data.update(scrape_videos(title))

    if title:
        product_data.update(scrape_expert_reviews(title, product_data["basic_info"].get("upc"), "defaultUpc"))
    
    return product_data

# TODO: Can remove endpoint.
# Note: Was testing with product_id "711035416" (exists) and "123" (does not exist).
@app.route("/api/walmart-product")
def walmart_product():
    product_id = request.args.get("product_id")
    product_data = WalmartProduct.aggregate_data(product_id)

    # Summarize reviews.
    text_reviews = product_data["reviews"].get("reviews")
    if text_reviews:
        # TODO: Can probably drop "reviews" field.
        summary = {"summary": summarize(text_reviews)}
        product_data["reviews"].update(summary)

    # Scrape YouTube videos.
    title = product_data["basic_info"].get("title")
    if title:
        product_data.update(scrape_videos(title))

    if title:
        product_data.update(scrape_expert_reviews(title, product_id, "walmartId"))

    return product_data

# TODO: DELETE AFTER FRONTEND FUNCTIONALITY IS IMPLEMENTED.
@app.route("/api/dummy/search-products")
def dummy_api_search_products():
    return dummy_search_products

# TODO: DELETE AFTER FRONTEND FUNCTIONALITY IS IMPLEMENTED.
@app.route("/api/dummy/search-products2")
def dummy_api_search_products2():
    return dummy_search_products2

# TODO: DELETE AFTER FRONTEND FUNCTIONALITY IS IMPLEMENTED.
@app.route("/api/dummy/recommendation")
def dummy_api_recommendation():
    return dummy_recommendation

# TODO: DELETE AFTER FRONTEND FUNCTIONALITY IS IMPLEMENTED.
@app.route("/api/dummy/product")
def dummy_api_product():
    time.sleep(5)
    return dummy_product


if __name__ == "__main__":
    app.run(host="0.0.0.0", threaded=True, port=5000)
