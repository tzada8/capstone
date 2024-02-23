import React from "react";
import { Rate } from "antd";

import "./ComparisonData.css";
import Rating from "../../rating/Rating";

function MostReview(props) {
    const reviewType = props.isPositive ? "POSITIVE" : "NEGATIVE";
    const reviewClass = props.isPositive ? "positive-review-title" : "negative-review-title"

	return (
		<div>
            <p className={`body-3-bold ${reviewClass}`}>MOST {reviewType} REVIEW</p>
            <Rating rating={props.rating} reviews={null} isCenter={false} />
            <p className="body-1">{props.text}</p>
        </div>
	);
}

export default MostReview;
