import React from "react";
import { render } from "@testing-library/react";

import SpecificationsData from "../../../../src/components/comparison/comparison-data/SpecificationsData";

const specifications = [
    { name: "Color", value: "Black" },
    { name: "Size", value: "Large" },
    { name: "Weight", value: "10 lbs" }
];

describe("SpecificationsData", () => {
    it("renders correctly with specifications data", () => {
        const { getByText } = render(<SpecificationsData specifications={specifications} />);

        expect(getByText("Color: Black")).toBeInTheDocument();
        expect(getByText("Size: Large")).toBeInTheDocument();
        expect(getByText("Weight: 10 lbs")).toBeInTheDocument();
    });

    it("renders without crashing if specifications data is not provided", () => {
        const { container } = render(<SpecificationsData specifications={[]} />);

        expect(container.querySelector("div")).toBeInTheDocument();
        expect(container.querySelector("div")).toBeEmptyDOMElement();
    });
});
