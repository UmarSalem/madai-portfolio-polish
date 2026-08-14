import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import MedicalHistory from './MedicalHistory';
import { getMyMedicalReports } from '../api/features';

jest.mock('../components/layout/Navbar', () => () => <nav aria-label="Main navigation" />);
jest.mock('../api/features', () => ({
  getMyMedicalReports: jest.fn(),
  uploadMedicalReport: jest.fn(),
}));

describe('MedicalHistory', () => {
  beforeEach(() => {
    localStorage.clear();
    getMyMedicalReports.mockReset();
    getMyMedicalReports.mockResolvedValue({ data: [] });
  });

  test('renders report upload safety warning and empty history state', async () => {
    render(
      <MemoryRouter>
        <MedicalHistory />
      </MemoryRouter>
    );

    expect(screen.getByText(/educational demo only/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/demo patient name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/demo pdf report/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /upload demo report/i })).toBeInTheDocument();

    await waitFor(() => {
      expect(getMyMedicalReports).toHaveBeenCalledTimes(1);
      expect(screen.getByText(/no demo reports yet/i)).toBeInTheDocument();
    });
  });
});
