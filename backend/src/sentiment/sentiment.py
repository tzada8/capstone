from typing import List, Dict
import spacy
from spacytextblob.spacytextblob import SpacyTextBlob

# Takes ~1 min to run on 100 reviews.
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

# TODO: If sentiment analysis becomes too slow, we can only analyze reviews with 1 or 5 star ratings.
def analyze(review: Dict) -> float:
    nlp = spacy.load('en_core_web_sm')
    nlp.add_pipe('spacytextblob')
    return nlp(review['comment'])._.blob.polarity