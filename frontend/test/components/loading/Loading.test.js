import React from "react";
import { render } from "@testing-library/react";

import Loading from "../../../src/components/loading/Loading";

describe("Loading", () => {
    it("displays correct percentage text", () => {
        const { getByText } = render(<Loading isLoading={true} percent={50} size={100} strokeWidth={5} />);
        expect(getByText("50%")).toBeInTheDocument();
    });

    it("renders loading component when isLoading is true", () => {
        const { container } = render(<Loading isLoading={true} percent={50} size={200} strokeWidth={12} />);
        const loadingElement = container.querySelector(".custom-loading");

        expect(loadingElement).toBeInTheDocument();
    });

    it("does not render loading component when isLoading is false", () => {
        const { container } = render(<Loading isLoading={false} percent={50} size={200} strokeWidth={12} />);
        const loadingElement = container.querySelector(".custom-loading");

        expect(loadingElement).not.toBeInTheDocument();
    });
});
