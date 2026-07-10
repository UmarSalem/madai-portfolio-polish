import React, { useState } from 'react';
import { checkSymptoms } from '../api/features';
import './SymptomChecker.css';
import Navbar from '../components/layout/Navbar';

const normalizeList = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === 'string' && value.trim()) {
    return value.split(',').map(item => item.trim()).filter(Boolean);
  }
  return [];
};

const normalizeDiagnosis = (diagnosis, patientName, symptomsText) => ({
  id: Date.now(),
  patientName,
  enteredSymptoms: symptomsText,
  possibleConditions: normalizeList(diagnosis?.suggestedConditions),
  advice: diagnosis?.summary || 'No demo response was returned.',
  recommendedActions: normalizeList(diagnosis?.nextSteps),
  date: new Date().toLocaleString(),
});

function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [patient, setPatient] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const patientName = patient.trim();
    const symptomsText = symptoms.trim();

    if (!patientName || !symptomsText) {
      setError('Please enter a fictional demo patient name and demo symptoms.');
      return;
    }

    setLoading(true);

    try {
      const response = await checkSymptoms({
        patientName,
        symptomsText,
        dateSubmitted: new Date().toISOString(),
      });

      const resultObj = normalizeDiagnosis(response.data, patientName, symptomsText);

      setResult(resultObj);
      setHistory(prev => [resultObj, ...prev].slice(0, 10));
      setSymptoms('');
      setPatient('');
    } catch (requestError) {
      const status = requestError?.response?.status;
      if (status === 401) {
        setError('Please log in before using the symptom checker demo.');
      } else {
        setError('Unable to check demo symptoms right now. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="symptom-checker-pro">
        <div className="sc-card sc-form-card">
          <h2>Symptom Checker</h2>
          <p className="sc-disclaimer">
            This is an educational demo and not medical advice. Do not use it for diagnosis or emergencies. Do not enter real patient data or private health information.
          </p>
          <form onSubmit={handleSubmit}>
            <div className="sc-form-group">
              <label htmlFor="symptom-patient">Demo Patient Name</label>
              <input
                id="symptom-patient"
                type="text"
                value={patient}
                onChange={e => setPatient(e.target.value)}
                placeholder="e.g. Demo Patient"
                disabled={loading}
                required
              />
            </div>
            <div className="sc-form-group">
              <label htmlFor="symptom-text">Demo Symptoms</label>
              <textarea
                id="symptom-text"
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                placeholder="Use fictional symptoms only, e.g. demo headache and mild tiredness"
                disabled={loading}
                required
                rows={4}
              />
            </div>
            {error && <p className="sc-error">{error}</p>}
            <button type="submit" className="sc-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Checking...
                </>
              ) : 'Check Demo Symptoms'}
            </button>
          </form>
        </div>

        {!result && !loading && (
          <div className="sc-card sc-empty-card">
            <h3>No demo result yet</h3>
            <p>Submit fictional symptoms to see the backend response format.</p>
          </div>
        )}

        {result && (
          <div className="sc-card sc-result-card">
            <h2>Demo Result</h2>
            <div className="sc-result-grid">
              <div>
                <strong>Demo patient:</strong> {result.patientName}
              </div>
              <div>
                <strong>Demo symptoms:</strong> {result.enteredSymptoms}
              </div>
              <div>
                <strong>Possible conditions:</strong>
                {result.possibleConditions.length > 0 ? (
                  <ul>
                    {result.possibleConditions.map((condition, index) => <li key={index}>{condition}</li>)}
                  </ul>
                ) : (
                  <p>No structured conditions returned.</p>
                )}
              </div>
              <div>
                <strong>Recommended actions:</strong>
                {result.recommendedActions.length > 0 ? (
                  <ul>
                    {result.recommendedActions.map((action, index) => <li key={index}>{action}</li>)}
                  </ul>
                ) : (
                  <p>No structured actions returned.</p>
                )}
              </div>
              <div>
                <strong>Backend summary:</strong>
                <div className="sc-advice">{result.advice}</div>
              </div>
              <div>
                <strong>Date:</strong> {result.date}
              </div>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="sc-card sc-history-card">
            <h3>Demo History</h3>
            <ul>
              {history.map(item => (
                <li key={item.id}>
                  <span className="sc-history-date">{item.date}</span>
                  <span className="sc-history-patient">{item.patientName}</span>
                  <span className="sc-history-symptoms">{item.enteredSymptoms}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default SymptomChecker;
