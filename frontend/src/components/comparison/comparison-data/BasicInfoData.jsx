import React from "react";

import "./ComparisonData.css";

function BasicInfoData(props) {
	return (
		<div>
            <img className="comparison-product-image" src={props.basicInfo.images[0]} alt=""/>
            <p><b>{props.basicInfo.title}</b></p>
            <p>${props.basicInfo.price.amount}</p>
            <p>Rating: {props.basicInfo.rating} ({props.basicInfo.total_reviews} reviews)</p>
            <a
                href={props.basicInfo.product_page_url}
                target="_blank"
                rel="noreferrer"
            >{props.basicInfo.source}</a>
        </div>
	);
}

export default BasicInfoData;
