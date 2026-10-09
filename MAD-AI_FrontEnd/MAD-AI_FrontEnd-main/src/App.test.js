import { render, screen } from '@testing-library/react';
import axios from 'axios';
import App from './App';

beforeEach(() => {
  localStorage.clear();
  axios.get.mockReset();
});

test('renders the Madai home route', async () => {
  axios.get.mockResolvedValue({ data: [] });

  render(<App />);

  expect(screen.getByText(/welcome to madai/i)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Login', exact: true })).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Explore frontend demo — no login' }).getAttribute('href')).toMatch(/^#?\/demo$/);
  expect(await screen.findByText(/no demo blog posts are available right now/i)).toBeInTheDocument();
});
