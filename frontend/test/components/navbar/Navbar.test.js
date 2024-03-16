import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import Navbar from "../../../src/components/navbar/Navbar";

describe("Navbar", () => {
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
});
