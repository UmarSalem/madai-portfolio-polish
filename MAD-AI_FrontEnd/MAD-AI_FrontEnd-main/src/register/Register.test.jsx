import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Register from './Register';

jest.mock('../components/layout/Navbar', () => () => <nav aria-label="Main navigation" />);
jest.mock('../api/auth', () => ({
  register: jest.fn(),
}));

describe('Register', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders the registration form fields and submit action', () => {
    render(
      <MemoryRouter>
        <Register />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email id/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
  });
});
