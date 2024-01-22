import React from "react";
import "./ProductOption.css";

function ProductOption(props) {
	return (
		<div className="product-container">
            <div className="product-content">
                <img className="product-image" src={props.thumbnail} alt=""/>
                <h3>{props.title}</h3>
                <p>{props.rating} {props.reviews}</p>
                <p>{props.extensions.join(" | ")}</p>
                <br/>
                <h3>${props.price}</h3>
                <a
                    href={props.link}
                    target="_blank"
                    rel="noreferrer"
                >{props.source}</a>
            </div>
		</div>
	);
}

export default ProductOption;
