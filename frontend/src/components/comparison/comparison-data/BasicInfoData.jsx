import React from "react";
import { Rate } from "antd";

import "./ComparisonData.css";

function BasicInfoData(props) {
	return (
		<div className="comparison-block">
            <img className="comparison-product-image" src={props.basicInfo.images[0]} alt=""/>
            <h4>{props.basicInfo.title}</h4>
            <p className="body-1">${props.basicInfo.price.amount}</p>
            <p className="body-3">
                {props.basicInfo.rating}
                <Rate allowHalf disabled value={props.basicInfo.rating} />
                ({props.basicInfo.total_reviews} reviews)
            </p>
            <a
                href={props.basicInfo.product_page_url}
                target="_blank"
                rel="noreferrer"
                className="body-1-medium product-page-link"
            >{props.basicInfo.source}</a>
        </div>
	);
}

export default BasicInfoData;
