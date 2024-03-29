from openai import OpenAI, OpenAIError, APIError, APIConnectionError, RateLimitError
from os import environ
from typing import List

def summarize(reviews: List[str]) -> List[str]:
    if len(reviews) == 0:
        return []

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
        bullet_reviews = "\n- ".join(shorted_reviews)
        prompt = f"Summarize and aggregate the following list of product reviews into a list of bullet points using at most 100 words and no more than 4 bullet points in total:\n- {bullet_reviews}"
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}]
        )
        text_resp = response.choices[0].message.content.strip()
        return text_resp.replace("- ", "").split("\n")
    except OpenAIError as e:
        print(f"OpenAI Summarize => {e}")
        return []
    except APIError as e:
        print(f"OpenAI Summarize => OpenAI API returned an API Error: {e}")
        return []
    except APIConnectionError as e:
        print(f"OpenAI Summarize => Failed to connect to OpenAI API: {e}")
        return []
    except RateLimitError as e:
        print(f"OpenAI Summarize => OpenAI API request exceeded rate limit: {e}")
        return []
    except:
        return []
