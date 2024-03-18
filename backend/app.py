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

# HARDCODED DUMMY DATA USED WHEN IMPLEMENTING FRONTEND.
import time
from dummy_data.dummy_search_products import dummy_search_products, dummy_search_products2
from dummy_data.dummy_recommendation import dummy_recommendation
from dummy_data.dummy_product import dummy_product, dummy_product_basic_info, dummy_product_detailed_info
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

# Note: For basic testing, can try:
    # source=Best Buy&product_id=6522416
    # source=Walmart&product_id=711035416
@app.route("/api/product/basic-info")
def product_basic_info():
    product_id = request.args.get("product_id")
    source = request.args.get("source")

    if "Best Buy" in source:
        return BestBuyProduct.product_specs(product_id)
    elif "Walmart" in source:
        return WalmartProduct.product_specs(product_id)
    return {}

@app.route("/api/product/detailed-info")
def product_detailed_info():
    product_id = request.args.get("product_id")
    product_title = request.args.get("product_title")
    source = request.args.get("source")

    product_data = {}
    if "Best Buy" in source:
        product_data = BestBuyProduct.product_reviews(product_title)
    elif "Walmart" in source:
        product_data = WalmartProduct.product_reviews(product_id)

    # Summarize reviews.
    text_reviews = product_data["reviews"].get("reviews")
    if text_reviews:
        summary = {"summary": summarize(text_reviews)}
        product_data["reviews"].update(summary)
        del product_data["reviews"]["reviews"]
    else:
        product_data["reviews"]["summary"] = []
        product_data["reviews"]["top_positive"] = {}
        product_data["reviews"]["top_negative"] = {}

    if product_title:
        # Scrape YouTube videos.
        product_data.update(scrape_videos(product_title))
        # Scrape Expert reviews.
        product_data["reviews"].update(scrape_expert_reviews(product_title))
    else:
        product_data["videos"] = []
        product_data["reviews"]["expert_review"] = {}

    return product_data


# HARDCODED DUMMY DATA USED WHEN IMPLEMENTING FRONTEND.
@app.route("/api/dummy/search-products")
def dummy_api_search_products():
    time.sleep(5)
    return dummy_search_products

@app.route("/api/dummy/search-products2")
def dummy_api_search_products2():
    return dummy_search_products2

@app.route("/api/dummy/recommendation")
def dummy_api_recommendation():
    time.sleep(2)
    return dummy_recommendation

@app.route("/api/dummy/product")
def dummy_api_product():
    time.sleep(2)
    return dummy_product

@app.route("/api/dummy/product/basic-info")
def dummy_api_product_basic_info():
    time.sleep(3)
    return dummy_product_basic_info

@app.route("/api/dummy/product/detailed-info")
def dummy_api_product_detailed_info():
    time.sleep(5)
    return dummy_product_detailed_info

if __name__ == "__main__":
    app.run(host="0.0.0.0", threaded=True, port=5000)
