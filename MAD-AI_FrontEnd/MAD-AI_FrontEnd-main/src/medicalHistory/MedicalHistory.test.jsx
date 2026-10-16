import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import MedicalHistory from './MedicalHistory';
import { getMedicalReport, getMyMedicalReports, uploadMedicalReport } from '../api/features';

jest.mock('../components/layout/Navbar', () => () => <nav aria-label="Main navigation" />);
jest.mock('../api/features', () => ({
  getMyMedicalReports: jest.fn(),
  uploadMedicalReport: jest.fn(),
  getMedicalReport: jest.fn(),
}));

describe('MedicalHistory', () => {
  beforeEach(() => {
    localStorage.clear();
    getMyMedicalReports.mockReset();
    uploadMedicalReport.mockReset();
    getMedicalReport.mockReset();
    getMyMedicalReports.mockResolvedValue({ data: [] });
  });

  test.each([
    [true, /Static demo fallback.*not analysis of this report/i],
    [false, /Provider-generated explanation.*not medical advice/i],
    [null, /Unknown historical provenance.*not verified live AI/i],
  ])('labels saved response source %s and reopens from the API', async (isDemo, label) => {
    getMyMedicalReports.mockResolvedValue({ data: [{ id: 'report-1', fileName: 'fictional.pdf', summary: 'Old saved explanation', isDemo }] });
    getMedicalReport.mockResolvedValue({ data: { summary: 'Reloaded fictional explanation', isDemo, extractedText: 'Fictional value 7', textTruncated: true } });
    render(<MemoryRouter><MedicalHistory /></MemoryRouter>);
    expect(await screen.findByText(label)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: /Open saved result for fictional.pdf/i }));
    const saved = await screen.findByRole('article', { name: 'Saved report result' });
    expect(getMedicalReport).toHaveBeenCalledWith('report-1');
    expect(within(saved).getByText('Reloaded fictional explanation')).toBeInTheDocument();
    expect(within(saved).getByText(label)).toBeInTheDocument();
    expect(within(saved).getByText(/Text truncated.*5,000/i)).toBeInTheDocument();
    expect(within(saved).getByText('Fictional value 7')).toBeInTheDocument();
  });

  test('uploads selected fictional PDF using existing client, then reloads from history', async () => {
    const report = { id: 'new-report', fileName: 'selected.pdf', summary: 'Static sample, not report analysis', isDemo: true, extractedText: 'Fictional selected text' };
    let complete;
    uploadMedicalReport.mockReturnValueOnce(new Promise(resolve => { complete = resolve; }));
    getMedicalReport.mockResolvedValue({ data: report });
    render(<MemoryRouter><MedicalHistory /></MemoryRouter>);
    await screen.findByText(/No demo reports yet/i);
    const file = new File(['fictional PDF fixture'], 'selected.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText('Demo PDF Report'), { target: { files: [file] } });
    fireEvent.click(screen.getByRole('button', { name: 'Upload Demo Report' }));
    expect(uploadMedicalReport).toHaveBeenCalledWith({ patientName: 'Demo Patient', file });
    expect(screen.getByText(/Uploading, extracting text/i)).toBeInTheDocument();
    complete({ data: report });
    expect(await screen.findByRole('article', { name: 'Saved report result' })).toBeInTheDocument();
    expect(screen.getByText(/Report text and result saved/i)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Close saved result' }));
    fireEvent.click(screen.getByRole('button', { name: 'Open saved result for selected.pdf' }));
    expect(await screen.findByRole('article', { name: 'Saved report result' })).toBeInTheDocument();
    expect(getMedicalReport).toHaveBeenCalledWith('new-report');
  });

  test('displays extraction rejection and keeps file available for retry', async () => {
    uploadMedicalReport.mockRejectedValueOnce({ response: { status: 400, data: 'Text extraction unavailable: scanned PDF.' } });
    render(<MemoryRouter><MedicalHistory /></MemoryRouter>);
    await screen.findByText(/No demo reports yet/i);
    fireEvent.change(screen.getByLabelText('Demo PDF Report'), { target: { files: [new File(['fake'], 'scan.pdf', { type: 'application/pdf' })] } });
    fireEvent.click(screen.getByRole('button', { name: 'Upload Demo Report' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/Text extraction unavailable/i);
    expect(screen.queryByText(/Report text and result saved/i)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Upload Demo Report' })).toBeEnabled();
  });

  test('reopen ownership failure shows no previous selected result', async () => {
    getMyMedicalReports.mockResolvedValue({ data: [{ id: 'other', fileName: 'unavailable.pdf', summary: 'Unknown', isDemo: null }] });
    getMedicalReport.mockRejectedValue({ response: { status: 404 } });
    render(<MemoryRouter><MedicalHistory /></MemoryRouter>);
    fireEvent.click(await screen.findByRole('button', { name: 'Open saved result for unavailable.pdf' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/unavailable for this account/i);
    expect(screen.queryByRole('article', { name: 'Saved report result' })).not.toBeInTheDocument();
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
