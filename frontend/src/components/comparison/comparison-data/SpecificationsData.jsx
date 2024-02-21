import React from "react";

import "./ComparisonData.css";

function SpecificationsData(props) {
	return (
		<div className="comparison-block">
            {props.specifications.map(spec => (
                <p className="body-1" key={spec.name}>{spec.name}: {spec.value}</p>
            ))}
        </div>
	);
}

export default SpecificationsData;
