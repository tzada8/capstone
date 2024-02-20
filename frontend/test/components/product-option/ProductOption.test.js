import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import ProductOption from "../../../src/components/product-option/ProductOption";

const testData = {
    thumbnail: 'test-thumbnail.jpg',
    title: 'Test Product',
    rating: 4.5,
    reviews: 100,
    extensions: ['extension1', 'extension2'],
    price: 50,
    link: 'http://example.com',
    source: 'Example Source'
};

describe('ProductOption', () => {
    it('renders correctly with provided props', () => {
        const { getByText } = render(
            <ProductOption
                isSelected={true}
                changeSelection={() => {}}
                data={testData}
            />
        );

        expect(getByText(testData.title)).toBeInTheDocument();
        expect(getByText(`${testData.rating} ${testData.reviews}`)).toBeInTheDocument();
        expect(getByText(testData.extensions.join(" | "))).toBeInTheDocument();
        expect(getByText(`$${testData.price}`)).toBeInTheDocument();
        expect(screen.getByRole("img")).toHaveAttribute("src", testData.thumbnail);
        expect(getByText(testData.source)).toHaveAttribute("href", testData.link);
    });

    it('calls changeSelection prop when button is clicked', () => {
        const changeSelectionMock = jest.fn();
        const { getByText } = render(
            <ProductOption
                isSelected={false}
                changeSelection={changeSelectionMock}
                data={testData}
            />
        );

        fireEvent.click(getByText(testData.title));
        expect(changeSelectionMock).toHaveBeenCalledWith(testData);
    });

    it('applies selected style when isSelected prop is true', () => {
        const { container } = render(
            <ProductOption
                isSelected={true}
                changeSelection={() => {}}
                data={testData}
            />
        );

        expect(container.firstChild).toHaveClass('selected-product');
    });

    it('applies unselected style when isSelected prop is false', () => {
        const { container } = render(
            <ProductOption
                isSelected={false}
                changeSelection={() => {}}
                data={testData}
            />
        );

        expect(container.firstChild).toHaveClass('unselected-product');
    });
});
