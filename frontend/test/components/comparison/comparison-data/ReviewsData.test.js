import React from "react";
import { render } from "@testing-library/react";

import ReviewsData from "../../../../src/components/comparison/comparison-data/ReviewsData";

const reviewsData = {
    top_positive: {
        rating: 5,
        title: "Positive Review Title",
        text: "This is a positive review text."
    },
    top_negative: {
        rating: 1,
        title: "Negative Review Title",
        text: "This is a negative review text."
    },
    expert_review: {
        link: null,
        review: "The product is good",
        score: "50/100",
        source: "Consumer Reports"
    }
};

describe("ReviewsData", () => {
    it("renders correctly with reviews data", () => {
        const { getByText } = render(<ReviewsData reviews={reviewsData} />);

        expect(getByText("MOST POSITIVE REVIEW")).toBeInTheDocument();
        expect(getByText("MOST NEGATIVE REVIEW")).toBeInTheDocument();
        expect(getByText("5")).toBeInTheDocument();
        expect(getByText("This is a positive review text.")).toBeInTheDocument();
        expect(getByText("1")).toBeInTheDocument();
        expect(getByText("This is a negative review text.")).toBeInTheDocument();
    });
});
