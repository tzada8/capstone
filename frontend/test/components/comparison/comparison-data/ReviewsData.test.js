import React from "react";
import { render } from "@testing-library/react";

import ReviewsData from "../../../../src/components/comparison/comparison-data/ReviewsData";

const reviewsData = {
    summary: "This is a summary of the reviews",
    top_positive: {
        rating: 5,
        title: "Positive Review Title",
        text: "This is a positive review text."
    },
    top_negative: {
        rating: 1,
        title: "Negative Review Title",
        text: "This is a negative review text."
    }
};

describe("ReviewsData", () => {
    it("renders correctly with reviews data", () => {
        const { getByText } = render(<ReviewsData reviews={reviewsData} />);

        expect(getByText("This is a summary of the reviews")).toBeInTheDocument();
        expect(getByText("MOST POSITIVE REVIEW")).toBeInTheDocument();
        expect(getByText("MOST NEGATIVE REVIEW")).toBeInTheDocument();
        expect(getByText("Rating: 5")).toBeInTheDocument();
        expect(getByText("Title: Positive Review Title")).toBeInTheDocument();
        expect(getByText("This is a positive review text.")).toBeInTheDocument();
        expect(getByText("Rating: 1")).toBeInTheDocument();
        expect(getByText("Title: Negative Review Title")).toBeInTheDocument();
        expect(getByText("This is a negative review text.")).toBeInTheDocument();
    });

    it("renders without crashing if top_positive and top_negative are not provided", () => {
        const reviewsDataWithoutReviews = { summary: "No reviews available" };
        const { getByText } = render(<ReviewsData reviews={reviewsDataWithoutReviews} />);

        expect(getByText("No reviews available")).toBeInTheDocument();
    });

    it("renders without crashing if top_positive or top_negative are null", () => {
        const reviewsDataWithNullReviews = {
            summary: "Reviews are present but null values for positive and negative reviews",
            top_positive: null,
            top_negative: null,
        };
        const { getByText } = render(<ReviewsData reviews={reviewsDataWithNullReviews} />);

        expect(getByText("Reviews are present but null values for positive and negative reviews")).toBeInTheDocument();
  });
});
