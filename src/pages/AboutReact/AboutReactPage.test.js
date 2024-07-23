import { render, screen } from '@testing-library/react';
import AboutReactPage from './AboutReactPage';

test('renders learn react link', () => {
	render(<AboutReactPage />);
	const linkElement = screen.getByText(/learn react/i);
	expect(linkElement).toBeInTheDocument();
});
