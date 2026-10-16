import React, { useCallback, useEffect, useRef, useState } from 'react';
import './MedicalHistoryStyle.css';
import Navbar from '../components/layout/Navbar';
import { getMedicalReport, getMyMedicalReports, uploadMedicalReport } from '../api/features';
import DemoNavigation from '../demo/DemoNavigation';
import { demoReports } from '../demo/seedData';

const MAX_REPORT_SIZE_BYTES = 2 * 1024 * 1024;

const isPdfFile = (file) => {
  return file && (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));
};

const normalizeReport = (report) => ({
  id: report?.id || `${report?.fileName || 'report'}-${report?.dateUploaded || Date.now()}`,
  patientName: report?.patientName || 'Demo Patient',
  fileName: report?.fileName || 'demo-report.pdf',
  dateUploaded: report?.dateUploaded ? new Date(report.dateUploaded).toLocaleString() : 'N/A',
  summary: report?.summary || 'No demo analysis returned.',
  suggestedConditions: Array.isArray(report?.suggestedConditions) ? report.suggestedConditions : [],
  nextSteps: Array.isArray(report?.nextSteps) ? report.nextSteps : [],
  downloadAvailable: Boolean(report?.downloadAvailable),
  isDemo: report?.isDemo,
  extractedText: report?.extractedText,
  textTruncated: report?.textTruncated,
});

function MedicalHistory({ demo = false }) {
  const [patientName, setPatientName] = useState('Demo Patient');
  const [file, setFile] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selected, setSelected] = useState(null);
  const [opening, setOpening] = useState(false);
  const fileInputRef = useRef(null);

  const loadReports = useCallback(async () => {
    if (demo) {
      setReports(demoReports.map(normalizeReport));
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await getMyMedicalReports();
      if (!Array.isArray(response.data)) throw new Error('Invalid history response');
      const normalizedReports = response.data.map(normalizeReport);

      setReports(normalizedReports);
    } catch (requestError) {
      const status = requestError?.response?.status;
      setError(status === 401 || status === 403
        ? 'Please log in before viewing demo reports.'
        : 'Unable to load demo report history right now.');
    } finally {
      setLoading(false);
    }
  }, [demo]);

  const openReport = async (report) => {
    setSelected(null);
    setError('');
    setOpening(true);
    try {
      const response = await getMedicalReport(report.id);
      if (!response.data?.summary) throw new Error('Missing saved summary');
      setSelected(normalizeReport({ ...report, ...response.data }));
    } catch (requestError) {
      const status = requestError?.response?.status;
      setError(status === 401 || status === 403 ? 'Please log in to reopen your report.'
        : status === 404 ? 'Saved report unavailable for this account.'
        : 'Unable to reopen this report. Please try again.');
    } finally { setOpening(false); }
  };

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const handleFileChange = (event) => {
    setError('');
    setSuccess('');
    setFile(event.target.files?.[0] || null);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    if (demo) return;
    setError('');
    setSuccess('');

    const trimmedPatientName = patientName.trim();

    if (!trimmedPatientName || trimmedPatientName.length > 100) {
      setError('Please enter a fictional demo patient name up to 100 characters.');
      return;
    }

    if (!file) {
      setError('Please select a fictional demo PDF file.');
      return;
    }

    if (!isPdfFile(file)) {
      setError('Only PDF files are accepted for this demo.');
      return;
    }

    if (file.size > MAX_REPORT_SIZE_BYTES) {
      setError('Demo report files must be 2 MB or smaller.');
      return;
    }

    setUploading(true);

    try {
      const response = await uploadMedicalReport({
        patientName: trimmedPatientName,
        file,
      });

      if (!response.data?.id || !response.data?.summary) throw new Error('Invalid upload response');
      const saved = normalizeReport(response.data);
      setReports(prev => [saved, ...prev]);
      setSelected(saved);
      setSuccess('Report text and result saved. Original PDF bytes are not retained. Check the response source below.');
      setPatientName('Demo Patient');
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (requestError) {
      const status = requestError?.response?.status;
      if (status === 400 && requestError.response?.data) {
        setError(typeof requestError.response.data === 'string'
          ? requestError.response.data
          : 'The demo report could not be accepted. Check that it is a small PDF.');
      } else if (status === 401 || status === 403) {
        setError('Please log in before uploading a demo report.');
      } else if (status === 413) {
        setError('PDF upload is too large. Use a PDF of 2 MB or smaller.');
      } else {
        setError('Unable to upload the demo report right now. Please try again later.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <section className={demo ? 'demo-screen' : undefined}>
      {demo ? <DemoNavigation /> : <Navbar />}
      <div className="medical-history-page">
        <div className="medical-report-panel">
          <h1>{demo ? 'Sample report layout' : 'Medical Report Demo'}</h1>
          <p className="report-safety-warning">
            Educational demo only. Do not upload real medical reports or private health information. Not medical advice or a diagnosis.
          </p>

          {demo ? <p>File upload is unavailable in frontend demo mode. No file is selected, uploaded or analysed. The fictional report below is seeded sample text; report analysis and follow-up chat remain incomplete.</p> : <form className="medical-report-form" onSubmit={handleUpload}>
            <div className="medical-report-field">
              <label htmlFor="report-patient-name">Demo Patient Name</label>
              <input
                id="report-patient-name"
                value={patientName}
                onChange={(event) => setPatientName(event.target.value)}
                type="text"
                placeholder="Demo Patient"
                disabled={uploading}
                maxLength={100}
              />
            </div>

            <div className="medical-report-field">
              <label htmlFor="report-file">Demo PDF Report</label>
              <input
                id="report-file"
                ref={fileInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handleFileChange}
                disabled={uploading}
              />
              <span className="report-field-help">PDF only, maximum 2 MB. Use fictional files only. Up to 5,000 extracted characters and the result are saved locally; original PDF bytes are not retained. Encrypted PDFs and scans without text are unsupported.</span>
            </div>

            <button type="submit" className="medical-report-button" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Demo Report'}
            </button>
          </form>}
        </div>

        {error && <p className="medical-report-error" role="alert">{error}</p>}
        {success && <p className="medical-report-success" role="status">{success}</p>}
        {uploading && <p role="status">Uploading, extracting text and requesting an explanation...</p>}
        {opening && <p role="status">Opening saved report...</p>}
        {selected && <article className="medical-report-card" aria-label="Saved report result">
          <h2>Saved result: {selected.fileName}</h2>
          <ReportExplanation report={selected} />
          <button type="button" onClick={() => setSelected(null)}>Close saved result</button>
        </article>}

        <div className="medical-report-history">
          <h2>Demo Report History</h2>
          {!demo && <button type="button" onClick={loadReports} disabled={loading || uploading}>Refresh report history</button>}

          {loading && <p className="medical-report-empty" role="status">Loading demo reports...</p>}

          {!loading && reports.length === 0 && (
            <p className="medical-report-empty">No demo reports yet.</p>
          )}

          {reports.length > 0 && (
            <div className="medical-report-grid">
              {reports.map((report) => (
                <article key={report.id} className="medical-report-card">
                  <div className="medical-report-card-header">
                    <h3>{report.fileName}</h3>
                    {report.isDemo === true && <span>{demo ? 'Fictional sample' : 'Demo fallback'}</span>}
                  </div>
                  <p><strong>Patient:</strong> {report.patientName}</p>
                  <p><strong>{demo ? 'Fictional sample date:' : 'Uploaded:'}</strong> {report.dateUploaded}</p>
                  <p><strong>Download:</strong> {report.downloadAvailable ? 'Available' : 'Disabled for safe demo'}</p>
                  {demo ? <div><strong>Simulated explanation — not analysed:</strong><p>{report.summary}</p></div> : <>
                    <ReportExplanation report={report} />
                    <button type="button" disabled={opening} onClick={() => openReport(report)}>Open saved result for {report.fileName}</button>
                  </>}
                  {report.nextSteps.length > 0 && (
                    <div>
                      <strong>Next steps:</strong>
                      <ul>
                        {report.nextSteps.map((step, index) => <li key={index}>{step}</li>)}
                      </ul>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default MedicalHistory;

function ReportExplanation({ report }) {
  return <div className="medical-report-summary">
    <strong>{report.isDemo === true ? 'Static demo fallback — not analysis of this report'
      : report.isDemo === false ? 'Provider-generated explanation — not medical advice'
      : 'Unknown historical provenance — not verified live AI'}</strong>
    <p>{report.summary}</p>
    {report.textTruncated === true && <p>Text truncated: only the first 5,000 extracted characters were saved. When a provider is available, only this excerpt is supplied; omitted content is not explained.</p>}
    {report.extractedText && <details><summary>Extracted report text (untrusted document data)</summary><pre style={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}>{report.extractedText}</pre></details>}
  </div>;
}
