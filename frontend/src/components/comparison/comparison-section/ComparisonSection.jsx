import React, { useState } from "react";
import { DownOutlined, UpOutlined } from '@ant-design/icons';

import "./ComparisonSection.css";

function ComparisonSection({ sectionTitle=null, products }) {
    const [collapseSection, setCollapseSection] = useState(false);

	return (
		<div className="comparison-block">
            {sectionTitle !== null && (
                <div className="section-title-container">
                    {/* <button className="section-title-container" onClick={() => setCollapseSection(!collapseSection)}> */}
                        <h3 className="comparison-section-title"><span>{sectionTitle}</span></h3>
                        {/* <div className="collapsible-section-arrow">
                            {collapseSection ? <DownOutlined /> : <UpOutlined />}
                        </div> */}
                    {/* </button> */}
                </div>
            )}
            <div className={" column-layout show-section"} >
                {products.map((p, i) => <div key={i}>{p}</div>)}
            </div>
            <br/>
        </div>
	);
}

export default ComparisonSection;
