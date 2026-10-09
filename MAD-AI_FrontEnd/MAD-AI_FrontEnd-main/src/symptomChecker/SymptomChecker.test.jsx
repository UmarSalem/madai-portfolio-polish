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
    localStorage.clear();
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
    fireEvent.click(screen.getByRole('button', { name: /submit demo symptoms or question/i }));

    await waitFor(() => {
      expect(checkSymptoms).toHaveBeenCalledWith(expect.objectContaining({
        patientName: 'Demo Patient',
        symptomsText: 'fictional headache'
      }));
      expect(screen.getByText('Demo Result')).toBeInTheDocument();
      expect(screen.getByText('Demo symptom checker response only.')).toBeInTheDocument();
    });
  });

  test('submits a fictional health question with the unchanged API contract', async () => {
    checkSymptoms.mockResolvedValueOnce({ data: { summary: 'Fictional question response.' } });
    render(<MemoryRouter><SymptomChecker /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/demo patient name/i), { target: { value: 'Demo Patient' } });
    fireEvent.change(screen.getByLabelText(/demo symptoms or health question/i), {
      target: { value: '  What could a fictional mild headache mean?  ' }
    });
    fireEvent.click(screen.getByRole('button', { name: /submit demo symptoms or question/i }));
    expect(await screen.findByText('Fictional question response.')).toBeInTheDocument();
    expect(checkSymptoms).toHaveBeenLastCalledWith({
      patientName: 'Demo Patient',
      symptomsText: 'What could a fictional mild headache mean?',
      dateSubmitted: expect.any(String),
    });
  });

  test('shows a request error and retains fictional input for retry', async () => {
    checkSymptoms.mockRejectedValueOnce(new Error('Fictional backend unavailable'));
    render(<MemoryRouter><SymptomChecker /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/demo patient name/i), { target: { value: 'Demo Patient' } });
    fireEvent.change(screen.getByLabelText(/demo symptoms or health question/i), { target: { value: 'Fictional mild tiredness' } });
    fireEvent.click(screen.getByRole('button', { name: /submit demo symptoms or question/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/unable to check demo symptoms/i);
    expect(screen.getByLabelText(/demo symptoms or health question/i)).toHaveValue('Fictional mild tiredness');
    expect(screen.getByRole('button', { name: /submit demo symptoms or question/i })).toBeEnabled();
  });

});
