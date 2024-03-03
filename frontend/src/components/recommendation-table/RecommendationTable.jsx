import React from "react";

import "./RecommendationTable.css";
import Tooltip from "../tooltip/Tooltip";

function RecommendationTable(props) {
    const scoreDescription = "A product score is determined by a combination of its popularity, your priority and preferences, and prior learnings"
	return (
		<table className="recommendation-table">
            <thead>
                <tr className="body-2-medium">
                    <th>Rank</th>
                    <th>Item</th>
                    <th>Price</th>
                    <th>Source</th>
                    <th>Score <Tooltip content={scoreDescription}/></th>
                </tr>
            </thead>
            <tbody>
                {props.recommendations.map((product, i) => (
                    <tr className="body-2" key={i + 1}>
                        <td>{i + 1}</td>
                        <td>{product.title}</td>
                        <td>${product.price}</td>
                        <td>{product.source}</td>
                        <td>{product.score}</td>
                    </tr>
                ))}
            </tbody>
        </table>
	);
}

export default RecommendationTable;
