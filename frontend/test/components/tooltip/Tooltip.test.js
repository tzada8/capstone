import React from "react";
import { render, fireEvent } from "@testing-library/react";

import Tooltip from "../../../src/components/tooltip/Tooltip";

describe("Tooltip", () => {
    it("renders without crashing", () => {
        render(<Tooltip content="Test content" />);
    });

    it("renders the icon", () => {
        const { container } = render(<Tooltip content="Test content" />);
        const icon = container.querySelector(".score-info-tooltip");
        expect(icon).toBeInTheDocument();
    });

    it("renders tooltip content on hover", () => {
        const { container, getByText } = render(<Tooltip content="Test content" />);
        const tooltipContainer = container.querySelector(".custom-tooltip-container");

        fireEvent.mouseEnter(tooltipContainer);
        const tooltipContent = getByText("Test content");
        expect(tooltipContent).toBeInTheDocument();

        fireEvent.mouseLeave(tooltipContainer);
        expect(tooltipContent).not.toBeInTheDocument();
    });
});
