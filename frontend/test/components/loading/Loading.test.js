import React from "react";
import { render } from "@testing-library/react";

import Loading from "../../../src/components/loading/Loading";

describe("Loading", () => {
    it("renders loading component when isLoading is true", () => {
        const { container } = render(<Loading isLoading={true} loadingPercent={50} />);
        const loadingElement = container.querySelector(".custom-loading");

        expect(loadingElement).toBeInTheDocument();
    });

    it("does not render loading component when isLoading is false", () => {
        const { container } = render(<Loading isLoading={false} loadingPercent={50} />);
        const loadingElement = container.querySelector(".custom-loading");

        expect(loadingElement).not.toBeInTheDocument();
    });

    it("does not render Progress component when isLoading is false", () => {
        const { container } = render(<Loading isLoading={false} loadingPercent={50} />);
        const progressElement = container.querySelector(".ant-progress-circle");

        expect(progressElement).not.toBeInTheDocument();
    });
});
