import React from "react";

import "./ComparisonSection.css";

function ComparisonSection({ sectionTitle=null, products }) {
	return (
		<div className="comparison-block">
            {sectionTitle !== null && (
                <div className="section-title-container">
                    <h3 className="comparison-section-title"><span>{sectionTitle}</span></h3>
                </div>
            )}
            <div className="column-layout show-section">
                {products.map((p, i) => <div key={i}>{p}</div>)}
            </div>
            <br/>
        </div>
	);
}

export default ComparisonSection;
