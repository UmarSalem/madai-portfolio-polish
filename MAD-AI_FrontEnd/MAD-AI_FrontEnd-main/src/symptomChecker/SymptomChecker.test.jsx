import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SymptomChecker from './SymptomChecker';
import { MemoryRouter } from 'react-router';
import { checkSymptoms } from '../api/features';

jest.mock('../api/features', () => ({
  checkSymptoms: jest.fn()
}));

describe('SymptomChecker', () => {
  beforeEach(() => {
    checkSymptoms.mockReset();
    checkSymptoms.mockResolvedValue({
      data: {
        summary: 'Demo symptom checker response only.',
        suggestedConditions: ['Demo-only possible condition'],
        nextSteps: ['Use fictional demo data only.']
      }
    });
  });

  test('shows disclaimer and submits demo symptoms successfully', async () => {
    render(
      <MemoryRouter>
        <SymptomChecker />
      </MemoryRouter>
    );

    expect(screen.getByText(/educational demo and not medical advice/i)).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/demo patient name/i), {
      target: { value: 'Demo Patient' }
    });
    fireEvent.change(screen.getByLabelText(/demo symptoms/i), {
      target: { value: 'fictional headache' }
    });
    fireEvent.click(screen.getByRole('button', { name: /check demo symptoms/i }));

    await waitFor(() => {
      expect(checkSymptoms).toHaveBeenCalledWith(expect.objectContaining({
        patientName: 'Demo Patient',
        symptomsText: 'fictional headache'
      }));
      expect(screen.getByText('Demo Result')).toBeInTheDocument();
      expect(screen.getByText('Demo symptom checker response only.')).toBeInTheDocument();
    });
  });
});
