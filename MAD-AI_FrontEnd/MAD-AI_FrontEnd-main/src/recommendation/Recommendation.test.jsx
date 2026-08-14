import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Recommendation from './Recommendation';
import '@testing-library/jest-dom';

jest.mock('../components/layout/Navbar', () => () => <div data-testid="navbar" />);

jest.mock('../constant', () => ({
  Config: {
    serverUrl: 'http://localhost:3002'
  }
}));

describe('Recommendation Component', () => {
  const mockData = [
    {
      name: 'Demo Care Clinic',
      address: '100 Example Street, Demo City',
      city: 'Demo City',
      disease: 'head pain',
      placeId: 'demo-place-001',
      phoneNumber: '000-000-0000',
      website: 'https://example.test/demo-care-clinic',
      rating: 4.7
    },
    {
      name: 'Sample Wellness Clinic',
      address: '200 Sample Avenue, Demo City',
      city: 'Demo City',
      disease: 'neurology',
      placeId: 'demo-place-002',
      phoneNumber: '000-000-0000',
      website: 'https://example.test/sample-wellness-clinic',
      rating: 4.5
    },
    {
      name: 'Fictional Eye Health Center',
      address: '300 Placeholder Road, Demo Town',
      city: 'Demo Town',
      disease: 'cardiology',
      placeId: 'demo-place-003',
      phoneNumber: '000-000-0000',
      website: 'https://example.test/fictional-eye-health-center',
      rating: 3.5
    }
  ];

  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );
  });

  test('renders initial component correctly', () => {
    render(<Recommendation />);

    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByLabelText(/demo condition:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/demo city\/location:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByText(/enter a demo condition or city to search/i)).toBeInTheDocument();
  });

  test('accepts a demo city search', () => {
    render(<Recommendation />);

    fireEvent.change(screen.getByLabelText(/demo city\/location:/i), {
      target: { value: 'Demo City' }
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(global.fetch).toHaveBeenCalled();
  });

  test('accepts a demo disease search', () => {
    render(<Recommendation />);

    fireEvent.change(screen.getByLabelText(/demo condition:/i), {
      target: { value: 'head pain' }
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    expect(global.fetch).toHaveBeenCalled();
  });

  test('does not submit when no search criteria are entered', () => {
    render(<Recommendation />);

    expect(screen.getByRole('button', { name: /search/i })).toBeDisabled();

    expect(global.fetch).not.toHaveBeenCalled();
  });
});
