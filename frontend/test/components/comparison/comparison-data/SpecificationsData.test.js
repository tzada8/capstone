import React from "react";
import { render, fireEvent } from "@testing-library/react";

import SpecificationsData from "../../../../src/components/comparison/comparison-data/SpecificationsData";

describe("SpecificationsData", () => {
    const specifications = [
        { name: "Spec 1", value: "Value 1" },
        { name: "Spec 2", value: "Value 2" },
        { name: "Spec 3", value: "Value 3" },
        { name: "Spec 4", value: "Value 4" },
        { name: "Spec 5", value: "Value 5" },
    ];

    it("renders the component with limited specs initially", () => {
        const { getByText, queryByText } = render(
            <SpecificationsData specifications={specifications} />
        );

        specifications.slice(0, 4).forEach((spec) => {
            expect(getByText(`${spec.name}:`)).toBeInTheDocument();
            expect(getByText(spec.value)).toBeInTheDocument();
        });

        expect(queryByText("Spec 5")).not.toBeInTheDocument();
    });

    it("toggles full details when the button is clicked", () => {
        const { getByText, queryByText } = render(
            <SpecificationsData specifications={specifications} />
        );

        const button = getByText("Show full details");
        fireEvent.click(button);

        specifications.forEach((spec) => {
            expect(getByText(`${spec.name}:`)).toBeInTheDocument();
            expect(getByText(spec.value)).toBeInTheDocument();
        });

        expect(queryByText("Hide full details")).toBeInTheDocument();

        fireEvent.click(button);

        specifications.slice(0, 4).forEach((spec) => {
            expect(getByText(`${spec.name}:`)).toBeInTheDocument();
            expect(getByText(spec.value)).toBeInTheDocument();
        });

        expect(queryByText("Spec 5")).not.toBeInTheDocument();
        expect(queryByText("Show full details")).toBeInTheDocument();
    });
});
