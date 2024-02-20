import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import Home from "../../../src/pages/home/Home";

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
  }));

describe("Home", () => {
    it("renders home page with correct title", () => {
        const { getByText } = render(
            <Router>
                <Home />
            </Router>
        );
        expect(getByText((content, element) => {
            return element.tagName.toLowerCase() === 'h1' && content.includes("purchasing decisions");
        })).toBeInTheDocument();
        expect(getByText("simplified")).toBeInTheDocument();
    });

    it("calls toProductSearch function when form is submitted", () => {
        const navigateMock = jest.fn();
        require('react-router-dom').useNavigate.mockReturnValue(navigateMock);
        const { getByText, getByPlaceholderText } = render(
            <Router>
                <Home />
            </Router>
        );

        fireEvent.change(getByPlaceholderText("Search for a product"), { target: { value: "camera" } });
        fireEvent.submit(getByText("Search"));

        expect(navigateMock).toHaveBeenCalledWith("/product-search", { state: { query: "camera" } });
    });

    it("updates search query state when input value changes", () => {
        const { getByPlaceholderText } = render(
            <Router>
                <Home />
            </Router>
        );

        fireEvent.change(getByPlaceholderText("Search for a product"), { target: { value: "camera" } });
        expect(getByPlaceholderText("Search for a product")).toHaveValue("camera");
    });
});
