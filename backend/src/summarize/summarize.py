from openai import OpenAI, OpenAIError, APIError, APIConnectionError, RateLimitError
from os import environ
from typing import List
import logging

def summarize(reviews: List[str]) -> str:
    if len(reviews) == 0:
        return "Product has no reviews."

    # Limit to under 4000 tokens.
    shorted_reviews = []
    max_tokens = 3000 # Actual max is 4098, but would prefer some buffer.
    total_tokens = 0
    for review in reviews:
        tokens = len(review.split())
        if total_tokens + tokens <= max_tokens:
            shorted_reviews.append(review)
            total_tokens += tokens

    try:
        client = OpenAI(api_key=environ.get("OPENAI_API_KEY"))
        # TODO: Maybe can add more to prompt (e.g. "using at most 100 words").
        bullet_reviews = "\n- ".join(shorted_reviews)
        prompt = f"Summarize and aggregate the following list of product reviews into 1 paragraph:\n- {bullet_reviews}"
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        return response.choices[0].message.content.strip()
    except OpenAIError as e:
        logging.error(f"OpenAI Summarize => {e}")
        return ""
    except APIError as e:
        # Handle API error here, e.g. retry or log
        logging.error(f"OpenAI Summarize => OpenAI API returned an API Error: {e}")
        return ""
    except APIConnectionError as e:
        # Handle connection error here
        logging.error(f"OpenAI Summarize => Failed to connect to OpenAI API: {e}")
        return ""
    except RateLimitError as e:
        # Handle rate limit error (we recommend using exponential backoff)
        logging.error(f"OpenAI Summarize => OpenAI API request exceeded rate limit: {e}")
        return ""
    except:
        return ""