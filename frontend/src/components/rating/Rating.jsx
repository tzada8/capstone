import React from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

import "./Rating.css";

function Rating(props) {
    const numStars = 5;
    const roundedRating = Math.round(props.rating * 2) / 2;
    const reviewsPositioningClass = props.isCenter ? "center-star-block" : "left-star-block";

    const renderStar = (i) => {
        if (i + 0.5 === roundedRating) {
            return <FaStarHalfAlt key={i} className="star-outline"/>;
        } else if (i + 1 <= roundedRating) {
            return <FaStar key={i} className="star-outline"/>;
        } else {
            return <FaRegStar key={i} className="star-outline"/>;
        }
    }

	return (
		<div className={`star-rating-block ${reviewsPositioningClass}`}>
            {props.rating > 0 && <p className="body-3 rating-text">{props.rating}</p>}
            {props.rating > 0 && <div className="star-rating-container">
                {[...Array(numStars)].map((_, i) => renderStar(i))}
            </div>}
            {props.reviews > 0 && <p className="body-3 rating-text">({props.reviews} reviews)</p>}
        </div>
	);
}

export default Rating;
