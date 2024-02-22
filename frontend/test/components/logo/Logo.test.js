import React from 'react';
import { render } from '@testing-library/react';

import Logo from '../../../src/components/logo/Logo';

describe('Logo', () => {
    test('renders the logo text', () => {
        const { getByText } = render(<Logo />);
        const logoText = getByText("x");
        expect(logoText).toBeInTheDocument();
    });

    test('renders the correct class names', () => {
        const { container } = render(<Logo />);
        const logoElement = container.firstChild;
        expect(logoElement).toHaveClass('logo');
    });
});
