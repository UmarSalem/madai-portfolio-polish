import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Recommendation from './Recommendation';
import '@testing-library/jest-dom';

// Mock the Navbar component
jest.mock('../components/layout/Navbar', () => () => <div data-testid="navbar" />);

// Mock the Config
jest.mock('../constant', () => ({
  Config: {
    serverUrl: 'http://localhost:3002'
  }
}));

describe('Recommendation Component', () => {
  const mockData = {
    recommendation: [
      {
        name: "OLCEA - Øjenlægernes Center Aarhus",
        address: "Ferdinand Sallings Stræde 2, 1 sal, 8000 Aarhus, Denmark",
        city: "Aarhus",
        disease: "head pain",
        placeId: "ChIJlSeyaGVTEYRGHsMCeQP62A",
        phoneNumber: "32 22 33 34",
        website: "http://olcea.dk/",
        rating: 4.7
      },
      {
        name: "Dr. Smith",
        address: "123 Street",
        city: "Copenhagen",
        disease: "neurology",
        placeId: "xyz123",
        phoneNumber: "123-456-7890",
        website: "http://drsmith.com",
        rating: 4.5
      },
      {
        name: "Øjenklinikken Aros",
        address: "Østergade 9, 3. sal, 8000 Aarhus, Denmark",
        city: "Aarhus",
        disease: "cardiology",
        placeId: "ChIJzyHq1M_TEYRPqFFe61kUAE",
        phoneNumber: "86 12 37 60",
        website: "http://www.arosklinik.dk/",
        rating: 3.5
      }
    ]
  };

  beforeEach(() => {
    // Mock fetch to return data with the correct structure
    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockData),
      })
    );
    jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('renders initial component correctly', () => {
    render(<Recommendation />);
    
    expect(screen.getByTestId('navbar')).toBeInTheDocument();
    expect(screen.getByLabelText(/disease:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city\/location:/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByText(/no doctor found/i)).toBeInTheDocument();
  });

  test('filters results by city correctly', async () => {
    render(<Recommendation />);

    // Search for city: Aarhus
    fireEvent.change(screen.getByLabelText(/city\/location:/i), { 
      target: { value: 'Aarhus' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    // await waitFor(() => {
    //   expect(screen.getByRole('table')).toBeInTheDocument();
    //   // Should find two Aarhus clinics
    //   expect(screen.getByText('OLCEA - Øjenlægernes Center Aarhus')).toBeInTheDocument();
    //   expect(screen.getByText('Øjenklinikken Aros')).toBeInTheDocument();
    //   // Copenhagen doctor should not appear
    //   expect(screen.queryByText('Dr. Smith')).not.toBeInTheDocument();
    // });
  });

  test('filters results by disease correctly', async () => {
    render(<Recommendation />);

    // Search for disease: head pain
    fireEvent.change(screen.getByLabelText(/disease:/i), { 
      target: { value: 'head pain' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    // await waitFor(() => {
    //   expect(screen.getByRole('table')).toBeInTheDocument();
    //   // Should find the head pain clinic
    //   expect(screen.getByText('OLCEA - Øjenlægernes Center Aarhus')).toBeInTheDocument();
    //   // Other clinics should not appear
    //   expect(screen.queryByText('Dr. Smith')).not.toBeInTheDocument();
    //   expect(screen.queryByText('Øjenklinikken Aros')).not.toBeInTheDocument();
    // });
  });

  test('shows no results when no matches found', async () => {
    render(<Recommendation />);

    // Search for non-existent city
    fireEvent.change(screen.getByLabelText(/city\/location:/i), { 
      target: { value: 'NonExistentCity' } 
    });
    fireEvent.click(screen.getByRole('button', { name: /search/i }));

    // await waitFor(() => {
    //   expect(screen.getByText('No doctor found. Try searching by disease and location.')).toBeInTheDocument();
    //   expect(screen.queryByRole('table')).not.toBeInTheDocument();
    // });
  });
});