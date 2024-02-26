import React from "react";

import "./ComparisonData.css";
import Rating from "../../rating/Rating";

function BasicInfoData(props) {
	return (
		<div>
            <img className="comparison-product-image" src={props.basicInfo.images[0]} alt=""/>
            <h4 className="center-text basic-info-title-spacing">{props.basicInfo.title}</h4>
            <p className="body-1 center-text">${props.basicInfo.price.amount}</p>
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
