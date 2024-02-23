import React from "react";
import { Rate } from "antd";

import "./Rating.css";

function Rating(props) {
    const roundedRating = Math.round(props.rating * 2) / 2;
    const reviewsPositioningClass = props.isCenter ? "center-star-block" : "left-star-block";

	return (
		<div className={`star-rating-block ${reviewsPositioningClass}`}>
            <p className="body-3 rating-text">{props.rating}</p>
            <Rate className="rating-stars" allowHalf disabled value={roundedRating} />
            {props.reviews && <p className="body-3 rating-text">({props.reviews} reviews)</p>}
        </div>
	);
}

export default Rating;
