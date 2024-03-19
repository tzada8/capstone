import React from "react";
import { render } from "@testing-library/react";

import MostReview from "../../../../src/components/comparison/comparison-data/MostReview";

describe("MostReview", () => {
    it("renders with positive review", () => {
        const { getByText } = render(
        <MostReview
            isPositive={true}
            rating={4.5}
            text="This is a positive review."
        />
        );

        expect(getByText("MOST HELPFUL POSITIVE REVIEW")).toBeInTheDocument();
        expect(getByText("4.5")).toBeInTheDocument();
        expect(getByText("This is a positive review.")).toBeInTheDocument();
    });

    it("renders with negative review", () => {
        const { getByText } = render(
        <MostReview
            isPositive={false}
            rating={2.5}
            text="This is a negative review."
        />
        );

        expect(getByText("MOST HELPFUL CRITICAL REVIEW")).toBeInTheDocument();
        expect(getByText("2.5")).toBeInTheDocument();
        expect(getByText("This is a negative review.")).toBeInTheDocument();
    });
});
