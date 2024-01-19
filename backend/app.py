from flask import Flask, request
from flask_cors import CORS
from os import environ
import time

from src.scraper.walmart_scraper import WalmartProduct

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

if __name__ == "__main__":
    app.run(host="0.0.0.0", threaded=True, port=5000)
