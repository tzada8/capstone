import React from "react";

function RecommendationTable(props) {
	return (
		<table>
            <tr>
                <th>RANK</th>
                <th>ITEM</th>
                <th>PRICE</th>
                <th>SOURCE</th>
                <th>SCORE</th>
            </tr>
            {props.recommendations.map(r => (
                <tr>
                    <td>{r.rank}</td>
                    <td>{r.title}</td>
                    <td>{r.price}</td>
                    <td>{r.source}</td>
                    <td>{r.score}</td>
                </tr>
            ))}
        </table>
	);
}

export default RecommendationTable;
