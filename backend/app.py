from flask import Flask, request
from flask_cors import CORS
from os import environ
import time

from src.scraper.walmart_scraper import WalmartProduct
from src.scraper.youtube_scraper import scrape_videos
from src.summarize.summarize import summarize

app = Flask(__name__)
CORS(app)

@app.route("/")
def default_backend():
    key = environ.get("EXAMPLE_ENV", "does not exist")
    env = environ.get("FLASK_ENV", "does not exist")
    return {"message": "Routing to backend home GET", "key": key, "env": env}

@app.route("/api/time")
def get_current_time():
    return {"time": time.time()}

@app.route("/api/number", methods=["POST"])
def show_number_x10():
    data = request.get_json()
    number_x10 = data["number"] * 10
    return {"number": number_x10}

# Note: Was testing with product_id "711035416" (exists) and "123" (does not exist).
@app.route("/api/walmart-product")
def walmart_data():
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

    # TODO: Scrape Expert reviews.
    return product_data

if __name__ == "__main__":
    app.run(host="0.0.0.0", threaded=True, port=5000)
