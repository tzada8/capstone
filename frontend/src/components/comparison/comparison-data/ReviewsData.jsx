import React from "react";

import "./ComparisonData.css";
import MostReview from "./MostReview";

function ReviewsData(props) {
	return (
		<div>
            {props.reviews.summary && <p className="body-1">{props.reviews.summary}</p>}
            <br/>
            <br/>
            {props.reviews.top_positive && <MostReview
                isPositive={true}
                rating={props.reviews.top_positive?.rating}
                title={props.reviews.top_positive?.title}
                text={props.reviews.top_positive?.text}
            />}
            <br/>
            <br/>
            {props.reviews.top_negative && <MostReview
                isPositive={false}
                rating={props.reviews.top_negative?.rating}
                title={props.reviews.top_negative?.title}
                text={props.reviews.top_negative?.text}
            />}
            {/* TODO: Add expert reviews. */}
        </div>
	);
}

export default ReviewsData;
