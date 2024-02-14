import React from "react";

import "./RecommendationTable.css";

function RecommendationTable(props) {
	return (
		<table className="recommendation-table">
            <tr>
                <th>RANK</th>
                <th>ITEM</th>
                <th>PRICE</th>
                <th>SOURCE</th>
                <th>SCORE</th>
            </tr>
            {props.recommendations.map((product, i) => (
                <tr key={i + 1}>
                    <td>{i + 1}</td>
                    <td>{product.title}</td>
                    <td>{product.price}</td>
                    <td>{product.source}</td>
                    <td>{product.score}</td>
                </tr>
            ))}
        </table>
	);
}

export default RecommendationTable;
