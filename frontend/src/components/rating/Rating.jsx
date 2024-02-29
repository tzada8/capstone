import React from "react";
import { Rate } from "antd";

import "./Rating.css";

function Rating(props) {
    const roundedRating = Math.round(props.rating * 2) / 2;
    const reviewsPositioningClass = props.isCenter ? "center-star-block" : "left-star-block";

	return (
		<div className={`star-rating-block ${reviewsPositioningClass}`}>
            {props.rating > 0 && <p className="body-3 rating-text">{props.rating}</p>}
            {props.rating > 0 && <Rate className="rating-stars" allowHalf disabled value={roundedRating} />}
            {props.reviews > 0 && <p className="body-3 rating-text">({props.reviews} reviews)</p>}
        </div>
	);
}

export default Rating;
