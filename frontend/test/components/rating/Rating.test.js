import React from "react";
import { render } from "@testing-library/react";

import Rating from "../../../src/components/rating/Rating";

describe("Rating", () => {
    it("renders rating without reviews", () => {
        const { getByText, queryByText } = render(<Rating rating={4} />);

        expect(getByText("4")).toBeInTheDocument();
        expect(queryByText("reviews")).toBeNull();
    });

    it("renders rating with reviews", () => {
        const { getByText } = render(<Rating rating={4.5} reviews={10} />);

        expect(getByText("4.5")).toBeInTheDocument();
        expect(getByText("(10 reviews)")).toBeInTheDocument();
    });

    it("renders half-star rating", () => {
        const { container } = render(<Rating rating={3.5} />);
        const halfStar = container.querySelector(".star-outline");

        expect(halfStar).toBeInTheDocument();
    });

    it("applies proper positioning class", () => {
        const { container } = render(<Rating rating={4} />);
        const starRatingBlock = container.querySelector(".star-rating-block");
        expect(starRatingBlock.classList.contains("left-star-block")).toBe(true);
    });
});
