import React, { useState } from "react";

import "./ComparisonData.css";

function SpecificationsData(props) {
    const numDisplayedSpecs = 4;
    const [showDetails, setShowDetails] = useState(false);

    const buttonText = showDetails ? "Hide full details" : "Show full details";
    const displayedSpecs = showDetails ? props.specifications : props.specifications.slice(0, numDisplayedSpecs);

	return (
		<div>
            {displayedSpecs.map(spec => (
                <div key={spec.name} className="spec-section">
                    <p className="body-1-bold">{spec.name}:</p>
                    <p className="body-1">{spec.value}</p>
                </div>
            ))}
            {props.specifications.length > numDisplayedSpecs && <button
                className="show-more-text spec-more-details-button"
                onClick={() => setShowDetails(!showDetails)}
            >{buttonText}</button>}
        </div>
	);
}

export default SpecificationsData;
