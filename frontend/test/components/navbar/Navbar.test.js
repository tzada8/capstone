import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';

import Navbar from '../../../src/components/navbar/Navbar';

describe('Navbar', () => {
    it('renders correctly', () => {
        const { getByText } = render(
            <Router>
                <Navbar />
            </Router>
        );

        expect(getByText('LOGO')).toBeInTheDocument();
        expect(getByText('Restart Search')).toBeInTheDocument();
    });

    it('contains correct links', () => {
        const { getByText } = render(
            <Router>
                <Navbar />
            </Router>
        );

        expect(getByText('LOGO').getAttribute('href')).toBe('/');
        expect(getByText('Restart Search').getAttribute('href')).toBe('/');
    });
});
