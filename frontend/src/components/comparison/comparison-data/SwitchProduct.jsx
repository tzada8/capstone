import React from "react";

import "./ComparisonData.css";

function SwitchProduct(props) {
	return (
		<div className="product-switch-container">
            <select
                className="body-1 product-switch-dropdown"
                id={`switch-product-${props.i}`}
                name={`switch-product-${props.i}`}
                value={props.selectedTitle}
                onChange={props.handleSwitch}
            >
                {props.productTitles.map(title => (
                    <option value={title}>{title}</option>
                ))}
            </select>
        </div>
	);
}

export default SwitchProduct;
