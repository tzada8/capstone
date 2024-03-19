import React, { useState } from "react";

import "./ComparisonData.css";
import Rating from "../../rating/Rating";

function MostReview(props) {
    const wordLimit = 50;
    const reviewText = props.text || "";
    const [showMore, setShowMore] = useState(false);

    const numWords = reviewText.split(" ").length;
    const shortenedText = reviewText.split(" ").slice(0, wordLimit).join(" ");
    const displayableText = numWords > wordLimit ? shortenedText + "..." : shortenedText;
    const buttonText = numWords > wordLimit ? (showMore ? "Less" : "More") : "";

    const reviewType = props.isPositive ? "POSITIVE" : "CRITICAL";
    const reviewClass = props.isPositive ? "positive-review-title" : "negative-review-title"

	return (
		<div className="most-review-container">
            <p className={`body-3-bold ${reviewClass}`}>MOST HELPFUL {reviewType} REVIEW</p>
            <div className="ratings-container">
                <Rating rating={props.rating} reviews={null} isCenter={false} />
            </div>
            <p className="body-1">
                {showMore ? reviewText : displayableText} <button className="show-more-text" onClick={() => setShowMore(!showMore)}>{buttonText}</button>
            </p>
        </div>
	);
}

export default MostReview;
