from flask import Flask, request
from flask_cors import CORS
from os import environ
import time

from src.scraper.walmart_scraper import WalmartProduct


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

@app.route("/api/walmart-product")
def walmart_data():
    # Note: Was testing with product_id "711035416" (exists) and "123" (does not exist).
    product_id = request.args.get("product_id")
    product_data = WalmartProduct.aggregate_data(product_id)
    return product_data

@app.route("/api/summarize")
def summ():
    r = [
        # "This product stinks",
        # "One of the best purchases I ever made",
        # "I was wondering why it was so expensive, but after purchasing, I know it was definitely worth my money",
        # "I'mm stll lrning to tpe, but my fvorite prodct ever",
        "4.5 stars? How is that possible. Should have a negative rating",
    ]
    summary = summarize(r)
    return {"summary": summary}

if __name__ == "__main__":
    app.run(host="0.0.0.0", threaded=True, port=5000)
