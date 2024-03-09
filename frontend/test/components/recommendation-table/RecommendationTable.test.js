import React from "react";
import { render } from "@testing-library/react";

import RecommendationTable from "../../../src/components/recommendation-table/RecommendationTable";

const recommendations = [
  { title: "Product 1", price: 10.99, source: "Source 1", score: 9.5 },
  { title: "Product 2", price: 20.99, source: "Source 2", score: 8.7 },
  { title: "Product 3", price: 15.99, source: "Source 3", score: 7.8 },
];

describe("RecommendationTable", () => {
    it("renders correctly with recommendations", () => {
        const { getByText } = render(<RecommendationTable recommendations={recommendations} />);

        expect(getByText("Rank")).toBeInTheDocument();
        expect(getByText("Item")).toBeInTheDocument();
        expect(getByText("Price")).toBeInTheDocument();
        expect(getByText("Source")).toBeInTheDocument();
        expect(getByText("Score (out of 5)")).toBeInTheDocument();

        recommendations.forEach((product, i) => {
            expect(getByText((content, element) => {
                return element.tagName.toLowerCase() === "td" && element.textContent === `${i + 1}`;
            })).toBeInTheDocument();
            expect(getByText(product.title)).toBeInTheDocument();
            expect(getByText(`$${product.price}`)).toBeInTheDocument();
            expect(getByText(product.source)).toBeInTheDocument();
            expect(getByText(product.score.toString())).toBeInTheDocument();
        });
    });
});
