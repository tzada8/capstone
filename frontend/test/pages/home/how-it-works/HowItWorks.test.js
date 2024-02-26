import React from "react";
import { render } from "@testing-library/react";

import HowItWorks from "../../../../src/pages/home/how-it-works/HowItWorks";

describe("HowItWorks", () => {
    it("renders HowItWorks component", () => {
        const { getByText } = render(<HowItWorks />);

        expect(getByText("it works")).toBeInTheDocument();
        expect(getByText(/Search for products that interest you./i)).toBeInTheDocument();
        expect(getByText(/Provide your product preferences and prioritization of features./i)).toBeInTheDocument();
        expect(getByText(/View your recommended products and make comparisons./i)).toBeInTheDocument();
        expect(document.querySelector(".how-it-works-diagram")).toBeInTheDocument();
    });
});
