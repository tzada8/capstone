import React, { useState } from "react";

import "./ComparisonData.css";
import consumerReportsIcon from "../../../images/comparisons/consumer-reports-icon.png";
import MostReview from "./MostReview";

function ReviewsData(props) {
    const wordLimit = 50;
    const expertReviewText = props.reviews.expert_review?.review || "";
    const [showMore, setShowMore] = useState(false);

    const numWords = expertReviewText.split(" ").length;
    const shortenedText = expertReviewText.split(" ").slice(0, wordLimit).join(" ");
    const displayableText = numWords > wordLimit ? shortenedText + "..." : shortenedText;
    const buttonText = numWords > wordLimit ? (showMore ? "Less" : "More") : "";

    const noReviews = props.reviews.summary.length === 0 &&
                        Object.keys(props.reviews.top_positive).length === 0 &&
                        Object.keys(props.reviews.top_negative).length === 0 &&
                        props.reviews.expert_review.hasOwnProperty("error");

	return (
		noReviews ? <p className="body-1">Product has no reviews.</p> : <div>
            {props.reviews.summary.length > 0 && <ul className="summary-bullet-container">
                {props.reviews.summary.map((point, i) => (
                    <li className="body-1 summary-bullet" key={i}>{point}</li>
                ))}
            </ul>}
            <br/>
            <br/>
            {Object.keys(props.reviews.top_positive).length > 0 && <MostReview
                isPositive={true}
                rating={props.reviews.top_positive?.rating}
                title={props.reviews.top_positive?.title}
                text={props.reviews.top_positive?.text}
            />}
            <br/>
            <br/>
            {Object.keys(props.reviews.top_negative).length > 0 && <MostReview
                isPositive={false}
                rating={props.reviews.top_negative?.rating}
                title={props.reviews.top_negative?.title}
                text={props.reviews.top_negative?.text}
            />}
            <br/>
            <br/>
            {!(props.reviews.expert_review.hasOwnProperty("error")) && <div className="expert-reviews-container">
                <div className="expert-reviews-title-position">
                    <img className="expert-reviews-icon" src={consumerReportsIcon} alt=""/>
                    <h4 className="expert-reviews-source">
                        {props.reviews.expert_review?.link ? <a
                            className="expert-reviews-source"
                            href={props.reviews.expert_review?.link}
                            target="_blank"
                            rel="noreferrer"
                        >{props.reviews.expert_review?.source}</a> :
                        props.reviews.expert_review?.source}
                    </h4>
                </div>
                <p className="body-3 expert-reviews-score">{props.reviews.expert_review?.score}</p>
                <p className="body-1">
                    {showMore ? expertReviewText : displayableText} <button className="show-more-text" onClick={() => setShowMore(!showMore)}>{buttonText}</button>
                </p>
            </div>}
        </div>
	);
}

export default ReviewsData;
