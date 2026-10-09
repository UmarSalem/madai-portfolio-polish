import React from 'react';
import { render, screen, fireEvent, within, cleanup } from '@testing-library/react';
import { checkSymptoms, searchDoctors, getMyMedicalReports, uploadMedicalReport } from '../api/features';
import { ROUTE } from '../routes/ReactLinks';

jest.mock('../api/features', () => ({ checkSymptoms: jest.fn(), searchDoctors: jest.fn(), getMyMedicalReports: jest.fn(), uploadMedicalReport: jest.fn() }));
jest.mock('../login/Login', () => function LoginDestination() {
  const { useLocation } = require('react-router');
  return <p>Login required for {useLocation().state?.from?.pathname}</p>;
});
process.env.REACT_APP_ROUTER_MODE = 'hash';
const ReactRoute = require('../routes/ReactRoute').default;

const open = (path) => {
  window.history.replaceState(null, '', `/#${path}`);
  return render(<ReactRoute />);
};
let storageWrite;
beforeEach(() => {
  localStorage.clear(); sessionStorage.clear(); jest.clearAllMocks();
  storageWrite = jest.spyOn(Storage.prototype, 'setItem');
});
afterEach(() => {
  [checkSymptoms, searchDoctors, getMyMedicalReports, uploadMedicalReport].forEach(fn => expect(fn).not.toHaveBeenCalled());
  expect(storageWrite).not.toHaveBeenCalled();
  storageWrite.mockRestore();
  expect(localStorage.getItem('user')).toBeNull();
  expect(sessionStorage.length).toBe(0);
});

test('demo journey uses fixed inputs, simulated results, fictional directory and sample reports without API or storage', async () => {
  open(ROUTE.Demo);
  expect(screen.getByLabelText('Demo Patient Name')).toHaveAttribute('readonly');
  expect(screen.getByLabelText('Demo Symptoms or Health Question')).toHaveAttribute('readonly');
  fireEvent.click(screen.getByRole('button', { name: 'Show simulated guidance' }));
  expect(screen.getByRole('heading', { name: 'Simulated result — not live AI' })).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Fictional scenario'), { target: { value: 'question' } });
  expect(screen.queryByText('Prewritten sample guidance:')).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole('button', { name: 'Show simulated guidance' }));
  expect(screen.getByText(/routine visit can include/i)).toBeInTheDocument();
  const nav = () => within(screen.getByRole('navigation', { name: 'Demo navigation' }));
  fireEvent.click(nav().getByRole('link', { name: 'Fictional doctors' }));
  expect(window.location.hash).toBe('#/demo/doctors');
  fireEvent.click(screen.getByRole('button', { name: 'Show fictional doctors' }));
  expect(screen.getByText('Example Family Clinic')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Specialty'), { target: { value: 'Cardiology' } });
  fireEvent.click(screen.getByRole('button', { name: 'Show fictional doctors' }));
  expect(screen.getByText('Sample Heart Clinic')).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Specialty'), { target: { value: 'Dermatology' } });
  fireEvent.click(screen.getByRole('button', { name: 'Show fictional doctors' }));
  expect(screen.getByText(/No doctors found/i)).toBeInTheDocument();
  fireEvent.click(nav().getByRole('link', { name: 'Sample reports' }));
  expect(await screen.findByText('fictional-sample-report.pdf')).toBeInTheDocument();
  expect(screen.getByText(/No PDF was uploaded, read or analysed/i)).toBeInTheDocument();
  expect(document.querySelector('input[type="file"]')).toBeNull();
  expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  expect(screen.queryByRole('button', { name: /upload/i })).not.toBeInTheDocument();
  expect(nav().getByRole('link', { name: 'Exit demo' })).toHaveAttribute('href', '#/');
  fireEvent.click(nav().getByRole('link', { name: 'Symptom examples' }));
  expect(screen.queryByText('Prewritten sample guidance:')).not.toBeInTheDocument();
});

test.each([ROUTE.Demo, ROUTE.DemoDoctors, ROUTE.DemoReports])('direct Pages hash entry %s needs no account', path => {
  open(path);
  expect(screen.getByRole('heading', { name: 'Madai — frontend demo mode' })).toBeInTheDocument();
  expect(window.location.hash).toBe(`#${path}`);
});

test.each([ROUTE.AiDoctor, ROUTE.SymptomChecker, ROUTE.DoctorSearch, ROUTE.MedicalHistory, ROUTE.Profile])('visiting demo does not unlock real route %s', path => {
  open(ROUTE.Demo);
  fireEvent.click(screen.getByRole('button', { name: 'Show simulated guidance' }));
  cleanup();
  open(path);
  expect(window.location.hash).toBe('#/login');
  expect(screen.getByText(`Login required for ${path}`)).toBeInTheDocument();
});
