import React, { useState } from "react";

import "./ComparisonSection.css";

function ComparisonSection({ sectionTitle=null, products }) {
    const [collapseSection, setCollapseSection] = useState(false);

	return (
		<div>
            {sectionTitle !== null && (
                <div>
                    <h3>{sectionTitle}</h3>
                    <hr/>
                    <button onClick={() => setCollapseSection(!collapseSection)}>
                        <i className={collapseSection ? "arrow down-direction" : "arrow up-direction"} />
                    </button>
                </div>
            )}
            <div className={collapseSection ? "column-layout hide-section" : " column-layout show-section"} >
                {products.map((p, i) => <div key={i}>{p}</div>)}
            </div>
            <br/>
        </div>
	);
}

export default ComparisonSection;
