import { render, screen } from '@testing-library/react';
import AboutReact from './AboutReact';

test('renders learn react link', () => {
  render(<AboutReact />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
