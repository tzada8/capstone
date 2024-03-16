import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import Navbar from "../../../src/components/navbar/Navbar";

describe("Navbar", () => {
    it("renders regular navbar", () => {
        const { container } = render(
            <Router>
                <Navbar />
            </Router>
        );
        const navbar = container.querySelector(".regular-navbar");
        expect(navbar).toBeInTheDocument();
    });

    it("renders comparison navbar", () => {
        const { container } = render(
            <Router>
                <Navbar isComparisonNav showRecommendations />
            </Router>
        );
        const navbar = container.querySelector(".comparison-navbar");
        expect(navbar).toBeInTheDocument();
    });

    it("renders clickable logo link", () => {
        const { getByRole } = render(
            <Router>
                <Navbar />
            </Router>
        );
        const logoLink = getByRole("link", { name: /Ju x tapose/i });
        fireEvent.click(logoLink);
        expect(logoLink).toBeInTheDocument();
        expect(window.location.pathname).toEqual("/");
    });

    it("renders clickable restart button in comparison navbar", () => {
        const { getByRole } = render(
            <Router>
                <Navbar isComparisonNav />
            </Router>
        );
        const restartButton = getByRole("button", { name: /Restart Search/i });
        fireEvent.click(restartButton);
        expect(restartButton).toBeInTheDocument();
        expect(window.location.pathname).toEqual("/");
    });
});
