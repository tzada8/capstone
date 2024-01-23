import React, { useState } from "react";

import "./ComparisonSection.css";

function ComparisonSection(props) {
    const [collapseSection, setCollapseSection] = useState(false);

	return (
		<div>
            <h3>{props.section_title}</h3>
            <button onClick={() => setCollapseSection(!collapseSection)}>
                <i className={collapseSection ? "arrow down-direction" : "arrow up-direction"} />
            </button>
            <div className={collapseSection ? "column-layout hide-section" : " column-layout show-section"} >
                {props.product1}
                {props.product2}
                {props.product3}
            </div>
            <br />
        </div>
	);
}

export default ComparisonSection;
