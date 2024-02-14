import React from "react";

import "./ComparisonData.css";

function ReviewsData(props) {
	return (
		<div>
            <p>{props.reviews.summary}</p>
            <br/>

            <div>
                <h5>MOST POSITIVE REVIEW</h5>
                <p>Rating: {props.reviews.top_positive?.rating}</p>
                <p>Title: {props.reviews.top_positive?.title}</p>
                <p>{props.reviews.top_positive?.text}</p>
            </div>
            <br/>

            <div>
                <h5>MOST NEGATIVE REVIEW</h5>
                <p>Rating: {props.reviews.top_negative?.rating}</p>
                <p>Title: {props.reviews.top_negative?.title}</p>
                <p>{props.reviews.top_negative?.text}</p>
            </div>

            {/* TODO: Add expert reviews. */}
        </div>
	);
}

export default ReviewsData;
