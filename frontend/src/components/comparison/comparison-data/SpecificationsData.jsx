import React from "react";

import "./ComparisonData.css";

function SpecificationsData(props) {
	return (
		<div>
            {props.specifications.map(spec => (
                <p key={spec.name}>{spec.name}: {spec.value}</p>
            ))}
        </div>
	);
}

export default SpecificationsData;
