import React from "react";
import { render } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import DataPipeline from "../../../../src/pages/home/data-pipeline/DataPipeline";

describe("DataPipeline", () => {
    test("renders DataPipeline component", () => {
        const { getByText } = render(
            <Router>
                <DataPipeline />
            </Router>
        );

        expect(getByText("recommendations")).toBeInTheDocument();
        expect(document.querySelector(".data-pipeline-diagram")).toBeInTheDocument();
    });
});
