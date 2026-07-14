import React, { useEffect, useRef, useState } from 'react';
import './MedicalHistoryStyle.css';
import Navbar from '../components/layout/Navbar';
import { getMyMedicalReports, uploadMedicalReport } from '../api/features';

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
  isDemo: report?.isDemo !== false,
});

function MedicalHistory() {
  const [patientName, setPatientName] = useState('Demo Patient');
  const [file, setFile] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef(null);

  const loadReports = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await getMyMedicalReports();
      const normalizedReports = Array.isArray(response.data)
        ? response.data.map(normalizeReport)
        : [];

      setReports(normalizedReports);
    } catch (requestError) {
      const status = requestError?.response?.status;
      setError(status === 401
        ? 'Please log in before viewing demo reports.'
        : 'Unable to load demo report history right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, []);

  const handleFileChange = (event) => {
    setError('');
    setSuccess('');
    setFile(event.target.files?.[0] || null);
  };

  const handleUpload = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    const trimmedPatientName = patientName.trim();

    if (!trimmedPatientName) {
      setError('Please enter a fictional demo patient name.');
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

      setReports(prev => [normalizeReport(response.data), ...prev]);
      setSuccess('Demo report uploaded. The PDF content was not stored for this safe portfolio demo.');
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
      } else if (status === 401) {
        setError('Please log in before uploading a demo report.');
      } else {
        setError('Unable to upload the demo report right now. Please try again later.');
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <section>
      <Navbar />
      <div className="medical-history-page">
        <div className="medical-report-panel">
          <h1>Medical Report Demo</h1>
          <p className="report-safety-warning">
            Educational demo only. Do not upload real medical reports or private health information.
          </p>

          <form className="medical-report-form" onSubmit={handleUpload}>
            <div className="medical-report-field">
              <label htmlFor="report-patient-name">Demo Patient Name</label>
              <input
                id="report-patient-name"
                value={patientName}
                onChange={(event) => setPatientName(event.target.value)}
                type="text"
                placeholder="Demo Patient"
                disabled={uploading}
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
              <span className="report-field-help">PDF only, maximum 2 MB. Use fictional files only.</span>
            </div>

            {error && <p className="medical-report-error">{error}</p>}
            {success && <p className="medical-report-success">{success}</p>}

            <button type="submit" className="medical-report-button" disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Demo Report'}
            </button>
          </form>
        </div>

        <div className="medical-report-history">
          <h2>Demo Report History</h2>

          {loading && <p className="medical-report-empty">Loading demo reports...</p>}

          {!loading && reports.length === 0 && (
            <p className="medical-report-empty">No demo reports yet.</p>
          )}

          {reports.length > 0 && (
            <div className="medical-report-grid">
              {reports.map((report) => (
                <article key={report.id} className="medical-report-card">
                  <div className="medical-report-card-header">
                    <h3>{report.fileName}</h3>
                    {report.isDemo && <span>Demo</span>}
                  </div>
                  <p><strong>Patient:</strong> {report.patientName}</p>
                  <p><strong>Uploaded:</strong> {report.dateUploaded}</p>
                  <p><strong>Download:</strong> {report.downloadAvailable ? 'Available' : 'Disabled for safe demo'}</p>
                  <div className="medical-report-summary">
                    <strong>Analysis summary:</strong>
                    <p>{report.summary}</p>
                  </div>
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
