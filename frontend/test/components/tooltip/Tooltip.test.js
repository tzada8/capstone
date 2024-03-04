import React from "react";
import { render, fireEvent } from "@testing-library/react";

import Tooltip from "../../../src/components/tooltip/Tooltip";

describe("Tooltip", () => {
  it("Tooltip content is not initially visible", () => {
    const { queryByText } = render(<Tooltip content="Tooltip Content" />);
    const tooltipContent = queryByText("Tooltip Content");
    expect(tooltipContent).toBeNull();
  });

  it("Tooltip content becomes visible on mouse enter", () => {
    const { container, getByText } = render(<Tooltip content="Tooltip Content" />);
    const tooltipContainer = container.querySelector(".tooltip-container");
    fireEvent.mouseEnter(tooltipContainer);
    const tooltipContent = getByText("Tooltip Content");
    expect(tooltipContent).toBeInTheDocument();
  });

  it("Tooltip content disappears on mouse leave", () => {
    const { container, queryByText } = render(<Tooltip content="Tooltip Content" />);
    const tooltipContainer = container.querySelector(".tooltip-container");
    fireEvent.mouseEnter(tooltipContainer);
    fireEvent.mouseLeave(tooltipContainer);
    const tooltipContent = queryByText("Tooltip Content");
    expect(tooltipContent).toBeNull();
  });
});
