import React from "react";

import "./ProductOption.css";
import Rating from "../rating/Rating";

function ProductOption(props) {
    const selectedStyle = props.isSelected ? "selected-product" : "unselected-product"

	return (
		<button className={`product-container ${selectedStyle}`} onClick={() => props.changeSelection(props.data)}>
            <div className="product-content">
                <img className="product-image" src={props.data.thumbnail} alt=""/>
                <h3>{props.data.title}</h3>
                <Rating rating={props.data.rating} reviews={props.data.reviews} isCenter={false} />
                <p>{props.data.extensions.join(" | ")}</p>
                <br/>
                <h3>${props.data.price}</h3>
                <a
                    href={props.data.link}
                    target="_blank"
                    rel="noreferrer"
                >{props.data.source}</a>
            </div>
		</button>
	);
}

export default ProductOption;
