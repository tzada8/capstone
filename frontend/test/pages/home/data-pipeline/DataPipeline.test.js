import React from "react";
import { render } from "@testing-library/react";

import DataPipeline from "../../../../src/pages/home/data-pipeline/DataPipeline";

describe("DataPipeline", () => {
    test("renders DataPipeline component", () => {
        const { getByText } = render(<DataPipeline />);
        
        expect(getByText("pipeline")).toBeInTheDocument();
        expect(getByText(/Products are sourced from major retailers/i)).toBeInTheDocument();
        expect(getByText(/learning algorithms to make the final selection as easy as possible/i)).toBeInTheDocument();
        expect(document.querySelector(".data-pipeline-diagram")).toBeInTheDocument();
    });
});