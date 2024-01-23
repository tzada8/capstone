from flask import Flask, request
from flask_cors import CORS
from os import environ

from src.scraper.google_shopping_scraper import scrape_google_products
from src.scraper.bestbuy_scraper import BestBuyProduct
from src.scraper.walmart_scraper import WalmartProduct
from src.scraper.consumer_reports_scraper import scrape_expert_reviews
from src.scraper.youtube_scraper import scrape_videos
from src.summarize.summarize import summarize

app = Flask(__name__)
CORS(app)

@app.route("/")
def default_backend():
    key = environ.get("EXAMPLE_ENV", "does not exist")
    env = environ.get("FLASK_ENV", "does not exist")
    return {"message": "Routing to backend home GET", "key": key, "env": env}

@app.route("/api/number", methods=["POST"])
def show_number_x10():
    data = request.get_json()
    number_x10 = data["number"] * 10
    return {"number": number_x10}

@app.route("/api/search-products")
def search_products():
    q = request.args.get("q")
    return scrape_google_products(q)

# Note: Was testing with product_id "6522416" (exists) and "0" (does not exist).
@app.route("/api/bestbuy-product")
def bestbuy_product():
    product_id = request.args.get("product_id")
    product_data = BestBuyProduct.aggregate_data(product_id)

    # TODO: Summarize reviews.

    # Scrape YouTube videos.
    title = product_data["basic_info"].get("title")
    if title:
        product_data.update(scrape_videos(title))

    if title:
        product_data.update(scrape_expert_reviews(title, upc = product_data["basic_info"].get("upc")))
    
    return product_data

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
        product_data.update(scrape_expert_reviews(title, walmart_id = product_id))

    return product_data

if __name__ == "__main__":
    app.run(host="0.0.0.0", threaded=True, port=5000)
