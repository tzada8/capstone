import React from "react";

import "./ProductOption.css";
import Rating from "../rating/Rating";

function ProductOption(props) {
    const selectedStyle = props.selectionNumber ? "selected-product" : "unselected-product";
    const selectedLineStyle = props.selectionNumber ? "selected-product-line" : "unselected-product-line";

	return (
		<button className={`product-container ${selectedStyle}`} onClick={() => props.changeSelection(props.data)}>
            <div className="product-content">
                {props.selectionNumber && <p className="body-1-bold selection-number">{props.selectionNumber}</p>}
                <div className="basic-details-container">
                    <img className="product-image" src={props.data.thumbnail} alt=""/>
                    <p className="body-2-medium product-title">{props.data.title}</p>
                    <Rating rating={props.data.rating} reviews={props.data.reviews} isCenter={false}/>
                </div>
                <hr className={selectedLineStyle} />
                <div className="price-and-link-container">
                    <p className="body-1-bold product-price">${props.data.price}</p>
                    <a
                        className="body-3-medium product-page-link"
                        href={props.data.link}
                        target="_blank"
                        rel="noreferrer"
                    >{props.data.source}</a>
                </div>
            </div>
		</button>
	);
}

export default ProductOption;
