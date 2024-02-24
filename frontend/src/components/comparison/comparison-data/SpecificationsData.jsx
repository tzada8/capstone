import React from "react";

import "./ComparisonData.css";

// TODO: Maybe look into using AI to better format these specifications.
function SpecificationsData(props) {
	return (
		<div>
            {props.specifications.map(spec => (
                <p className="body-1" key={spec.name}>{spec.name}: {spec.value}</p>
            ))}
        </div>
	);
}

export default SpecificationsData;
