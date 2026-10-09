import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import { ROUTE } from './ReactLinks';

jest.mock('../home/Home', () => function HomeNavigation() {
  const Navbar = require('../components/layout/Navbar').default;
  return <Navbar />;
});
jest.mock('../login/Login', () => function LoginDestination() {
  const { useLocation } = require('react-router');
  return <p>Login required for {useLocation().state?.from?.pathname}</p>;
});
jest.mock('../medicalHistory/MedicalHistory', () => () => <h2>Report upload destination</h2>);
jest.mock('../doctorSearch/DoctorSearch', () => () => <h2>Doctor search destination</h2>);
jest.mock('../api/features', () => ({ checkSymptoms: jest.fn() }));

// Exercise the same router mode as the existing Pages build, independent of shell settings.
process.env.REACT_APP_ROUTER_MODE = 'hash';
const ReactRoute = require('./ReactRoute').default;

beforeEach(() => {
  localStorage.clear();
  window.history.replaceState(null, '', '/#/');
});

const signInFictionalUser = () => {
  localStorage.setItem('user', JSON.stringify({ token: 'fictional-test-token' }));
};

const openRoute = (path) => {
  window.history.replaceState(null, '', `/#${path}`);
  render(<ReactRoute />);
};

test('AI Doctor navigation opens symptom intake rather than report upload', () => {
  signInFictionalUser();
  openRoute(ROUTE.Home);
  fireEvent.click(screen.getByRole('link', { name: 'AI Doctor', exact: true }));

  expect(window.location.hash).toBe(`#${ROUTE.AiDoctor}`);
  expect(screen.getByRole('heading', { name: /AI Doctor.*Symptom Checker/i })).toBeInTheDocument();
  expect(screen.getByLabelText(/demo symptoms or health question/i)).toBeEnabled();
  expect(screen.queryByRole('heading', { name: 'Report upload destination' })).not.toBeInTheDocument();
});

test.each([ROUTE.AiDoctor, ROUTE.SymptomChecker])('direct hash entry %s opens guarded symptom intake', (path) => {
  signInFictionalUser();
  openRoute(path);
  expect(screen.getByLabelText(/demo symptoms or health question/i)).toBeInTheDocument();
});

test.each([ROUTE.AiDoctor, ROUTE.SymptomChecker, ROUTE.DoctorSearch, ROUTE.MedicalHistory])(
  'unauthenticated entry %s redirects to login and preserves the destination', (path) => {
    openRoute(path);
    expect(window.location.hash).toBe(`#${ROUTE.Login}`);
    expect(screen.getByText(`Login required for ${path}`)).toBeInTheDocument();
    expect(screen.queryByLabelText(/demo symptoms or health question/i)).not.toBeInTheDocument();
  }
);

test.each([
  ['Doctor search', ROUTE.DoctorSearch, 'Doctor search destination'],
  ['Report upload & history', ROUTE.MedicalHistory, 'Report upload destination'],
])('symptom intake keeps %s reachable as a separate action', (label, path, heading) => {
  signInFictionalUser();
  openRoute(ROUTE.AiDoctor);
  const actions = screen.getByRole('navigation', { name: 'Other demo actions' });
  fireEvent.click(within(actions).getByRole('link', { name: label, exact: true }));
  expect(window.location.hash).toBe(`#${path}`);
  expect(screen.getByRole('heading', { name: heading })).toBeInTheDocument();
});
