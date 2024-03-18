import React from "react";
import { render, fireEvent } from "@testing-library/react";

import ComparisonSection from "../../../../src/components/comparison/comparison-section/ComparisonSection";

describe("ComparisonSection", () => {
    it("renders correctly with section title and products", () => {
        const { getByText } = render(
            <ComparisonSection
                sectionTitle="Section Title"
                products={[<div>Product 1</div>, <div>Product 2</div>, <div>Product 3</div>]}
            />
        );

        expect(getByText("Section Title")).toBeInTheDocument();
        expect(getByText("Product 1")).toBeInTheDocument();
        expect(getByText("Product 2")).toBeInTheDocument();
        expect(getByText("Product 3")).toBeInTheDocument();
    });

    it("renders without crashing if section title is null", () => {
        const { container } = render(
            <ComparisonSection
                sectionTitle={null}
                products={[<div>Product 1</div>, <div>Product 2</div>, <div>Product 3</div>]}
            />
        );

        expect(container.querySelector("h3")).toBeNull();
    });
});
