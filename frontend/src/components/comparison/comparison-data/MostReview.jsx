import React from "react";

import "./ComparisonData.css";
import Rating from "../../rating/Rating";

function MostReview(props) {
    const reviewType = props.isPositive ? "POSITIVE" : "NEGATIVE";
    const reviewClass = props.isPositive ? "positive-review-title" : "negative-review-title"

	return (
		<div className="most-review-container">
            <p className={`body-3-bold ${reviewClass}`}>MOST {reviewType} REVIEW</p>
            <div className="ratings-container">
                <Rating rating={props.rating} reviews={null} isCenter={false} />
            </div>
            <p className="body-1">{props.text}</p>
        </div>
	);
}

export default MostReview;
