import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import Footer from "../../../src/components/footer/Footer";

describe("Footer", () => {
    it("renders the logo link with correct route", () => {
        const { getByText } = render(
        <Router>
            <Footer />
        </Router>
        );

        expect(getByText("LOGO")).toHaveAttribute("href", "/");
    });

    it("renders the footer options with correct routes", () => {
        const { getByText } = render(
        <Router>
            <Footer />
        </Router>
        );

        expect(getByText("About the Tool")).toHaveAttribute("href", "/");
        expect(getByText("Help")).toHaveAttribute("href", "/");
        expect(getByText("Contact Us")).toHaveAttribute("href", "/");
    });

    it("renders hr element in footer", () => {
        const { container } = render(
        <Router>
            <Footer />
        </Router>
        );
        const hrElement = container.querySelector("footer hr");

        expect(hrElement).toBeInTheDocument();
    });
});
