import React from "react";

import "./ComparisonData.css";

function SwitchProduct(props) {
	return (
		<div>
            <select
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
