import React from "react";
import { render } from "@testing-library/react";

import ReviewsData from "../../../../src/components/comparison/comparison-data/ReviewsData";

const reviewsData = {
    summary: ["This is a summary of the reviews", "A second review"],
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

        expect(getByText("This is a summary of the reviews")).toBeInTheDocument();
        expect(getByText("A second review")).toBeInTheDocument();
        expect(getByText("MOST POSITIVE REVIEW")).toBeInTheDocument();
        expect(getByText("MOST NEGATIVE REVIEW")).toBeInTheDocument();
        expect(getByText("5")).toBeInTheDocument();
        expect(getByText("This is a positive review text.")).toBeInTheDocument();
        expect(getByText("1")).toBeInTheDocument();
        expect(getByText("This is a negative review text.")).toBeInTheDocument();
    });

    it("renders without crashing if top_positive and top_negative are not provided", () => {
        const reviewsDataWithoutReviews = {
            summary: ["No reviews available"],
            top_positive: {},
            top_negative: {},
            expert_review: {},
        };
        const { getByText } = render(<ReviewsData reviews={reviewsDataWithoutReviews} />);

        expect(getByText("No reviews available")).toBeInTheDocument();
    });

    it("renders without crashing if top_positive or top_negative are empty", () => {
        const reviewsDataWithNullReviews = {
            summary: ["Reviews are present but null values for positive and negative reviews"],
            top_positive: {},
            top_negative: {},
            expert_review: {},
        };
        const { getByText } = render(<ReviewsData reviews={reviewsDataWithNullReviews} />);

        expect(getByText("Reviews are present but null values for positive and negative reviews")).toBeInTheDocument();
  });
});
