import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import Footer from "../../../src/components/footer/Footer";

describe("Footer", () => {
    it("renders clickable logo link", () => {
        const { getByRole } = render(
        <Router>
            <Footer />
        </Router>
        );
        const logoLink = getByRole("link", { name: /Ju x tapose/i });

        fireEvent.click(logoLink);
        expect(logoLink).toBeInTheDocument();
        expect(window.location.pathname).toEqual("/");
    });

    it("renders the footer options with correct routes", () => {
        const { getByText } = render(
        <Router>
            <Footer />
        </Router>
        );

        expect(getByText("About the Tool")).toHaveAttribute("href", "/");
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
