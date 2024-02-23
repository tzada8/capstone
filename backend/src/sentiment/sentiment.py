from typing import List, Dict
from nltk.sentiment import SentimentIntensityAnalyzer

def sentiment(reviews: List[Dict]) -> Dict:
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

def analyze(review: Dict) -> float:
    sia = SentimentIntensityAnalyzer()
    return sia.polarity_scores(review.get("comment")).get("compound")