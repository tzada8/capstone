import React from "react";
import { render, fireEvent } from "@testing-library/react";

import ComparisonSection from "../../../../src/components/comparison/comparison-section/ComparisonSection";

describe("ComparisonSection", () => {
    it("renders correctly with section title and products", () => {
        const { getByText } = render(
            <ComparisonSection
                section_title="Section Title"
                product1={<div>Product 1</div>}
                product2={<div>Product 2</div>}
                product3={<div>Product 3</div>}
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
                section_title={null}
                product1={<div>Product 1</div>}
                product2={<div>Product 2</div>}
                product3={<div>Product 3</div>}
            />
        );

        expect(container.querySelector("h3")).toBeNull();
    });

    it("toggles section visibility on button click", () => {
        const { getByRole, container } = render(
            <ComparisonSection
                section_title="Section Title"
                product1={<div>Product 1</div>}
                product2={<div>Product 2</div>}
                product3={<div>Product 3</div>}
            />
        );

        const collapseButton = getByRole("button");
        expect(container.querySelector('.show-section')).toBeInTheDocument();

        fireEvent.click(collapseButton);
        expect(container.querySelector('.hide-section')).toBeInTheDocument();

        fireEvent.click(collapseButton);
        expect(container.querySelector('.show-section')).toBeInTheDocument();
    });
});
