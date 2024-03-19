import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import HowItWorks from "../../../../src/pages/home/how-it-works/HowItWorks";

describe("HowItWorks", () => {
    it("renders HowItWorks component", () => {
        const { getByText } = render(
            <Router>
                <HowItWorks />
            </Router>
        );

        expect(getByText("to use Juxtapose")).toBeInTheDocument();
        expect(getByText("1. Search")).toBeInTheDocument();
        expect(getByText("2. Set filters & preferences")).toBeInTheDocument();
        expect(getByText("3. View recommendations")).toBeInTheDocument();
        expect(getByText("4. Compare")).toBeInTheDocument();
        expect(document.querySelector(".how-it-works-diagram")).toBeInTheDocument();
    });
});
