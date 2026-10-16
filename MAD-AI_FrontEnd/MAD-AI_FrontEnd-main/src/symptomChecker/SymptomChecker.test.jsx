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

  test.each([
    [true, /Static fallback guidance.*not live AI/i],
    [false, /Provider-generated guidance/i],
    [undefined, /Guidance source not supplied/i],
  ])('labels response provenance %s without assuming live AI', async (isDemo, label) => {
    checkSymptoms.mockResolvedValueOnce({ data: { summary: 'Fictional guidance.', isDemo } });
    render(<MemoryRouter><SymptomChecker /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/demo patient name/i), { target: { value: 'Demo Patient' } });
    fireEvent.change(screen.getByLabelText(/demo symptoms or health question/i), { target: { value: 'Fictional question' } });
    fireEvent.click(screen.getByRole('button', { name: /submit demo symptoms or question/i }));
    expect(await screen.findByText(label)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Find doctors', exact: true })).toHaveAttribute('href', '/doctorSearch');
  });

  test('rejects whitespace before requesting guidance', () => {
    render(<MemoryRouter><SymptomChecker /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/demo patient name/i), { target: { value: '   ' } });
    fireEvent.change(screen.getByLabelText(/demo symptoms or health question/i), { target: { value: '   ' } });
    fireEvent.submit(screen.getByRole('form', { name: 'Symptom intake' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/Please enter/i);
    expect(checkSymptoms).not.toHaveBeenCalled();
  });

  test.each([
    [400, /API rejected this input/i],
    [401, /Please log in/i],
    [403, /Please log in/i],
  ])('displays API failure %s without a success/handoff', async (status, message) => {
    checkSymptoms.mockRejectedValueOnce({ response: { status } });
    render(<MemoryRouter><SymptomChecker /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/demo patient name/i), { target: { value: 'Demo Patient' } });
    fireEvent.change(screen.getByLabelText(/demo symptoms or health question/i), { target: { value: 'Fictional headache' } });
    fireEvent.click(screen.getByRole('button', { name: /submit demo symptoms or question/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(message);
    expect(screen.queryByRole('link', { name: 'Find doctors', exact: true })).not.toBeInTheDocument();
  });

  test('does not display an empty API response as guidance', async () => {
    checkSymptoms.mockResolvedValueOnce({ data: { summary: '' } });
    render(<MemoryRouter><SymptomChecker /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/demo patient name/i), { target: { value: 'Demo Patient' } });
    fireEvent.change(screen.getByLabelText(/demo symptoms or health question/i), { target: { value: 'Fictional headache' } });
    fireEvent.click(screen.getByRole('button', { name: /submit demo symptoms or question/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/Unable to check/i);
    expect(screen.queryByText('Demo Result')).not.toBeInTheDocument();
  });

});
