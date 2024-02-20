import React from "react";
import { render } from "@testing-library/react";

import BasicInfoData from "../../../../src/components/comparison/comparison-data/BasicInfoData";

const basicInfo = {
    title: "Product Title",
    price: { amount: 19.99 },
    rating: 4.5,
    total_reviews: 100,
    product_page_url: "https://example.com/product",
    source: "Source Name",
    images: ["image_url.jpg"],
};

describe("BasicInfoData", () => {
    it("renders correctly with basic information", () => {
        const { getByText, getByAltText, getByRole } = render(<BasicInfoData basicInfo={basicInfo} />);

        expect(getByText("Product Title")).toBeInTheDocument();
        expect(getByText("$19.99")).toBeInTheDocument();
        expect(getByText("Rating: 4.5 (100 reviews)")).toBeInTheDocument();
        expect(getByRole("link")).toHaveAttribute("href", "https://example.com/product");
        expect(getByRole("link")).toHaveTextContent("Source Name");
        expect(getByAltText("")).toHaveAttribute("src", "image_url.jpg");
    });

    it("renders without crashing if images array is empty", () => {
        const basicInfoWithoutImage = { ...basicInfo, images: [] };
        const { getByAltText } = render(<BasicInfoData basicInfo={basicInfoWithoutImage} />);

        expect(getByAltText("")).toBeInTheDocument();
    });

    it("renders without crashing if price amount is missing", () => {
        const basicInfoWithoutPrice = { ...basicInfo, price: {} };
        const { getByText } = render(<BasicInfoData basicInfo={basicInfoWithoutPrice} />);

        expect(getByText("$")).toBeInTheDocument();
    });
});
