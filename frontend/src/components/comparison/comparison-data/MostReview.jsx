import React from "react";

import "./ComparisonData.css";

function MostReview(props) {
    const reviewType = props.isPositive ? "POSITIVE" : "NEGATIVE";
    const reviewClass = props.isPositive ? "positive-review-title" : "negative-review-title"
	return (
		<div>
            <p className={`body-3-bold ${reviewClass}`}>MOST {reviewType} REVIEW</p>
            <p className="body-2">Rating: {props.rating}</p>
            <p className="body-1">{props.text}</p>
        </div>
	);
}

export default MostReview;
