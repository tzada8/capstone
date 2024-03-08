import React from "react";

import "./ComparisonData.css";
import consumerReportsIcon from "../../../images/comparisons/consumer-reports-icon.png";
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
            <br/>
            <br/>
            {props.reviews.expert_review && <div className="expert-reviews-container">
                <div className="expert-reviews-title-position">
                    <img className="expert-reviews-icon" src={consumerReportsIcon} alt=""/>
                    <h4 className="expert-reviews-source">{props.reviews.expert_review?.source}</h4>
                </div>
                <p className="body-3 expert-reviews-score">{props.reviews.expert_review?.score}</p>
                <p className="body-1">{props.reviews.expert_review?.review}</p>
            </div>}
        </div>
	);
}

export default ReviewsData;
