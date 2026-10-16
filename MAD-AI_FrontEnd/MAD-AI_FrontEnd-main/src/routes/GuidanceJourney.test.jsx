import React from 'react';
import axios from 'axios';
import { fireEvent, render, screen } from '@testing-library/react';

// Real router, guard, screens and feature clients; only HTTP transport is mocked
// by setupTests. This is not a real .NET runtime test.
process.env.REACT_APP_ROUTER_MODE = 'hash';
const ReactRoute = require('./ReactRoute').default;
const authorizeRequest = axios.interceptors.request.use.mock.calls[0][0];

beforeEach(() => {
  localStorage.clear();
  localStorage.setItem('user', JSON.stringify({ token: 'fictional-test-token' }));
  axios.post.mockReset(); axios.get.mockReset();
  window.history.replaceState(null, '', '/#/doctor');
});

test('authenticated symptom POST → labelled guidance → editable search GET without symptoms in URL or handoff state', async () => {
  let resolveGuidance;
  axios.post.mockReturnValueOnce(new Promise(resolve => { resolveGuidance = resolve; }));
  axios.get.mockResolvedValueOnce({ data: [{ name: 'Fictional Cardiology Clinic', isDemo: true, website: 'https://example.test/clinic' }] });
  render(<ReactRoute />);
  const request = authorizeRequest({ headers: {} });
  expect(request.headers.Authorization).toBe('Bearer fictional-test-token');
  fireEvent.change(screen.getByLabelText('Demo Patient Name'), { target: { value: ' Alex Example ' } });
  fireEvent.change(screen.getByLabelText('Demo Symptoms or Health Question'), { target: { value: ' Fictional mild tiredness ' } });
  fireEvent.click(screen.getByRole('button', { name: 'Submit Demo Symptoms or Question' }));
  expect(axios.post).toHaveBeenCalledWith('/api/SymptomChecker', {
    patientName: 'Alex Example', symptomsText: 'Fictional mild tiredness', dateSubmitted: expect.any(String),
  });
  expect(screen.getByRole('button', { name: /Checking/i })).toBeDisabled();
  expect(screen.getByText('Waiting for guidance from the API...')).toHaveAttribute('role', 'status');
  resolveGuidance({ data: { summary: 'Static fictional response.', isDemo: true, suggestedConditions: ['Example condition'] } });
  expect(await screen.findByText(/Static fallback guidance.*not live AI/i)).toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: 'Find doctors', exact: true }));
  expect(window.location.hash).toBe('#/doctorSearch');
  expect(window.history.state.usr).toEqual({ fromGuidance: true });
  expect(screen.getByText(/Guidance did not specify a specialty/i)).toBeInTheDocument();
  expect(screen.getByLabelText('Specialty')).toHaveValue('');
  fireEvent.change(screen.getByLabelText('Demo Location'), { target: { value: ' Demo City ' } });
  fireEvent.change(screen.getByLabelText('Specialty'), { target: { value: ' Cardiology ' } });
  fireEvent.click(screen.getByRole('button', { name: 'Search Demo Doctors' }));
  expect(await screen.findByRole('heading', { name: 'Fictional Cardiology Clinic' })).toBeInTheDocument();
  expect(axios.get).toHaveBeenCalledWith('/api/Doctors/search', { params: { location: 'Demo City', specialty: 'Cardiology' } });
  expect(screen.getByText(/Fictional fallback listings.*not live/i)).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: 'Visit' })).not.toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Report upload & history', exact: true })).toHaveAttribute('href', '#/admin/medicalHistory');
});

test('doctor search handles validation, loading, failure, retry and empty response', async () => {
  window.history.replaceState(null, '', '/#/doctorSearch');
  let rejectSearch;
  axios.get.mockReturnValueOnce(new Promise((resolve, reject) => { rejectSearch = reject; }));
  render(<ReactRoute />);
  fireEvent.click(screen.getByRole('button', { name: 'Search Demo Doctors' }));
  expect(screen.getByRole('alert')).toHaveTextContent(/enter a demo location and specialty/i);
  expect(axios.get).not.toHaveBeenCalled();
  fireEvent.change(screen.getByLabelText('Demo Location'), { target: { value: 'Demo City' } });
  fireEvent.change(screen.getByLabelText('Specialty'), { target: { value: 'General practice' } });
  fireEvent.click(screen.getByRole('button', { name: 'Search Demo Doctors' }));
  expect(screen.getByRole('button', { name: 'Searching...' })).toBeDisabled();
  rejectSearch({ response: { status: 401 } });
  expect(await screen.findByRole('alert')).toHaveTextContent(/log in as a demo patient/i);
  expect(screen.getByLabelText('Specialty')).toHaveValue('General practice');
  axios.get.mockResolvedValueOnce({ data: [] });
  fireEvent.click(screen.getByRole('button', { name: 'Search Demo Doctors' }));
  expect(await screen.findByText(/No doctors found/i)).toBeInTheDocument();
});
