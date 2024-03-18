import React from "react";

import "./ComparisonData.css";
import Rating from "../../rating/Rating";

function BasicInfoData(props) {
	return (
		<div>
            {/* <p className="body-1-bold selection-number">{props.title}</p> */}
            <p className="body-1-bold comparison-score">3.3</p>
            {/* <p className="body-1-bold comparison-score">{props.recommendations.score}</p> */}
            <img className="comparison-product-image" src={props.basicInfo.images[0]} alt=""/>
            <h4 className="center-text basic-info-title-spacing">{props.basicInfo.title}</h4>
            <h5 className="center-text">${props.basicInfo.price.amount}</h5>
            <div className="basic-info-ratings-container">
                <Rating rating={props.basicInfo.rating} reviews={props.basicInfo.total_reviews} isCenter={true} />
            </div>
            <div className="center-text">
                <a
                    href={props.basicInfo.product_page_url}
                    target="_blank"
                    rel="noreferrer"
                    className="body-1-medium product-page-link"
                >{props.basicInfo.source}</a>
            </div>
        </div>
	);
}

export default BasicInfoData;
