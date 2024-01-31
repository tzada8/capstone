from openai import OpenAI
from os import environ
from typing import List, Dict
import spacy
from spacytextblob.spacytextblob import SpacyTextBlob

# Takes ~1 min to run on 100 reviews.
# python -m textblob.download_corpora
# python -m spacy download en_core_web_sm
def sentiment(reviews: List[Dict]) -> Dict:
    if len(reviews) == 0:
        return "Product has no reviews."

    sentiments = list(map(analyze, reviews))
    positive_index = sentiments.index(max(sentiments))
    negative_index = sentiments.index(min(sentiments))
    
    return {
        "top_positive": {
            "title": reviews[positive_index].get("title"),
            "text": reviews[positive_index].get("comment"),
            "rating": reviews[positive_index].get("rating"),
        },
        "top_negative": {
            "title": reviews[negative_index].get("title"),
            "text": reviews[negative_index].get("comment"),
            "rating": reviews[negative_index].get("rating"),
        }
    }

def analyze(review: Dict) -> Dict:
    nlp = spacy.load('en_core_web_sm')
    nlp.add_pipe('spacytextblob')
    return nlp(review['comment'])._.blob.polarity