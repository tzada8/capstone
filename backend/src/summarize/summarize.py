from openai import OpenAI
from os import environ
from typing import List

def summarize(reviews: List[str]) -> str:
    if len(reviews) == 0:
        return "Product has no reviews."

    # Limit to under 4000 tokens.
    shorted_reviews = []
    max_tokens = 4000 # Actual max is 4098, but would prefer some buffer.
    total_tokens = 0
    for review in reviews:
        tokens = len(review.split())
        if total_tokens + tokens <= max_tokens:
            shorted_reviews.append(review)
            total_tokens += tokens

    client = OpenAI(api_key=environ.get("OPENAI_API_KEY"))
    # TODO: Maybe can add more to prompt (e.g. "using at most 100 words").
    bullet_reviews = "\n- ".join(shorted_reviews)
    prompt = f"Summarize and aggregate the following list of product reviews into 1 paragraph:\n- {bullet_reviews}"
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}]
    )
    return response.choices[0].message.content.strip()
