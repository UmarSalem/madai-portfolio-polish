import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import Login from './Login';

jest.mock('../components/layout/Navbar', () => () => <nav aria-label="Main navigation" />);
jest.mock('../api/auth', () => ({
  login: jest.fn(),
}));

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders the login form fields and actions', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/email id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /forgot password/i })).toBeInTheDocument();
  });
});
