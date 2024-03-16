import React from "react";
import { render, fireEvent } from "@testing-library/react";

import SearchBar from "../../../src/components/search-bar/SearchBar";

describe("SearchBar", () => {
    it("renders with initial query value and placeholder", () => {
        const { getByPlaceholderText } = render(
            <SearchBar query="initial query" setQuery={() => {}} onSearchSubmit={() => {}} />
        );

        expect(getByPlaceholderText("Search products")).toBeInTheDocument();
        expect(getByPlaceholderText("Search products")).toHaveValue("initial query");
    });

    it("calls setQuery when input value changes", () => {
        const setQueryMock = jest.fn();
        const { getByPlaceholderText } = render(
            <SearchBar query="" setQuery={setQueryMock} onSearchSubmit={() => {}} />
        );

        fireEvent.change(getByPlaceholderText("Search products"), { target: { value: "new query" } });
        expect(setQueryMock).toHaveBeenCalledWith("new query");
    });

    it("calls onSearchSubmit when form is submitted", () => {
        const onSearchSubmitMock = jest.fn();
        const { getByText } = render(
            <SearchBar query="query" setQuery={() => {}} onSearchSubmit={onSearchSubmitMock} />
        );

        fireEvent.submit(getByText("Search"));
        expect(onSearchSubmitMock).toHaveBeenCalled();
    });
});
