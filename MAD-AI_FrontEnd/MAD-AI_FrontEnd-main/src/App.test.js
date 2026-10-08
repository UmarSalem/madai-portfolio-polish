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
  expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
  expect(await screen.findByText(/no demo blog posts are available right now/i)).toBeInTheDocument();
});
