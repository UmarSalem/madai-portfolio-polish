import React, { useState } from 'react';
import { checkSymptoms } from '../api/features';
import './SymptomChecker.css';
import Navbar from '../components/layout/Navbar';
import { Link } from 'react-router';
import { ROUTE } from '../routes/ReactLinks';
import DemoNavigation from '../demo/DemoNavigation';
import { demoScenarios } from '../demo/seedData';

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

function SymptomChecker({ demo = false }) {
  const [scenarioId, setScenarioId] = useState(demoScenarios[0].id);
  const scenario = demoScenarios.find(item => item.id === scenarioId) || demoScenarios[0];
  const [symptoms, setSymptoms] = useState('');
  const [patient, setPatient] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (demo) {
      setResult(normalizeDiagnosis(scenario.guidance, scenario.patient, scenario.text));
      return;
    }

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
    <div className={demo ? 'demo-screen' : undefined}>
      {demo ? <DemoNavigation /> : <Navbar />}
      <div className="symptom-checker-pro">
        <div className="sc-card sc-form-card">
          <h2>{demo ? 'Symptom examples — simulated guidance' : 'AI Doctor — Symptom Checker'}</h2>
          <p className="sc-disclaimer">
            This is an educational demo and not medical advice. Do not use it for diagnosis or emergencies. Do not enter real patient data or private health information.
          </p>
          <nav className="sc-actions" aria-label="Other demo actions">
            <Link to={demo ? ROUTE.DemoDoctors : ROUTE.DoctorSearch}>Doctor search</Link>
            <Link to={demo ? ROUTE.DemoReports : ROUTE.MedicalHistory}>{demo ? 'Sample reports' : 'Report upload & history'}</Link>
          </nav>
          <form onSubmit={handleSubmit}>
            {demo && <div className="sc-form-group">
              <label htmlFor="demo-scenario">Fictional scenario</label>
              <select id="demo-scenario" value={scenarioId} onChange={e => { setScenarioId(e.target.value); setResult(null); }}>
                {demoScenarios.map(item => <option key={item.id} value={item.id}>{item.text}</option>)}
              </select>
            </div>}
            <div className="sc-form-group">
              <label htmlFor="symptom-patient">Demo Patient Name</label>
              <input
                id="symptom-patient"
                type="text"
                value={demo ? scenario.patient : patient}
                readOnly={demo}
                onChange={e => setPatient(e.target.value)}
                placeholder="e.g. Demo Patient"
                disabled={loading}
                required
              />
            </div>
            <div className="sc-form-group">
              <label htmlFor="symptom-text">Demo Symptoms or Health Question</label>
              <textarea
                id="symptom-text"
                value={demo ? scenario.text : symptoms}
                readOnly={demo}
                onChange={e => setSymptoms(e.target.value)}
                placeholder="Fictional example: What could a demo headache and mild tiredness mean?"
                disabled={loading}
                required
                rows={4}
              />
            </div>
            {error && <p className="sc-error" role="alert">{error}</p>}
            <button type="submit" className="sc-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Checking...
                </>
              ) : demo ? 'Show simulated guidance' : 'Submit Demo Symptoms or Question'}
            </button>
          </form>
        </div>

        {!result && !loading && (
          <div className="sc-card sc-empty-card">
            <h3>No demo result yet</h3>
            <p>{demo ? 'Choose a fictional scenario to see a prewritten response.' : 'Submit fictional symptoms to see the backend response format.'}</p>
          </div>
        )}

        {result && (
          <div className="sc-card sc-result-card">
            <h2>{demo ? 'Simulated result — not live AI' : 'Demo Result'}</h2>
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
                <strong>{demo ? 'Prewritten sample guidance:' : 'Backend summary:'}</strong>
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
