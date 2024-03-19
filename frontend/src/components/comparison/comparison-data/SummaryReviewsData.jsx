import React from "react";

import "./ComparisonData.css";

function SummaryReviewsData(props) {
	return (
		props.summary.length === 0 ? <p className="body-1">Product has no reviews.</p> : <div>
            <ul className="summary-bullet-container">
                {props.summary.map((point, i) => (
                    <li className="body-1 summary-bullet" key={i}>{point}</li>
                ))}
            </ul>
        </div>
	);
}

export default SummaryReviewsData;
