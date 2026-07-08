import React, { useState } from 'react';
import { checkSymptoms } from '../api/features';
import './SymptomChecker.css';
import Navbar from '../components/layout/Navbar';

function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [patient, setPatient] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return alert("Please enter symptoms");
    if (!patient.trim()) return alert("Please enter patient name");

    setLoading(true);

    try {
      const response = await checkSymptoms({
        patientName: patient,
        symptomsText: symptoms,
        dateSubmitted: new Date().toISOString(),
      });

      const diagnosis = response.data;

      const resultObj = {
        id: Date.now(),
        patientName: patient,
        enteredSymptoms: symptoms,
        possibleConditions: diagnosis.suggestedConditions || [],
        advice: diagnosis.summary || '',
        urgencyLevel: diagnosis.urgencyLevel || 'N/A',
        recommendedActions: diagnosis.nextSteps
          ? (Array.isArray(diagnosis.nextSteps)
              ? diagnosis.nextSteps
              : diagnosis.nextSteps.split(','))
          : [],
        date: new Date().toLocaleString()
      };

      setResult(resultObj);
      setHistory(prev => [resultObj, ...prev].slice(0, 10));
      setSymptoms('');
      setPatient('');
    } catch (error) {
      console.error("Diagnosis error:", error);
      alert("Error getting diagnosis. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="symptom-checker-pro">
        <div className="sc-card sc-form-card">
          <h2>🩺 Symptom Checker</h2>
          <form onSubmit={handleSubmit}>
            <div className="sc-form-group">
              <label>Patient Name</label>
              <input
                type="text"
                value={patient}
                onChange={e => setPatient(e.target.value)}
                placeholder="e.g. John Doe"
                required
              />
            </div>
            <div className="sc-form-group">
              <label>Symptoms</label>
              <textarea
                value={symptoms}
                onChange={e => setSymptoms(e.target.value)}
                placeholder="Describe symptoms in detail (e.g. headache, fever for 3 days)"
                required
                rows={4}
              />
            </div>
            <button type="submit" className="sc-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Checking...
                </>
              ) : 'Check Symptoms'}
            </button>
          </form>
        </div>

        {result && (
          <div className="sc-card sc-result-card">
            <h2>Diagnosis Result</h2>
            <div className="sc-result-grid">
              <div>
                <strong>Patient:</strong> {result.patientName}
              </div>
              <div>
                <strong>Symptoms:</strong> {result.enteredSymptoms}
              </div>
              <div>
                <strong>Possible Conditions:</strong>
                <ul>
                  {result.possibleConditions.map((c, i) => <li key={i}>{c}</li>)}
                </ul>
              </div>
              <div>
                <strong>Urgency Level:</strong>
                <span className={`sc-urgency sc-urgency-${result.urgencyLevel.toLowerCase()}`}>
                  {result.urgencyLevel}
                </span>
              </div>
              <div>
                <strong>Advice:</strong>
                <div className="sc-advice">{result.advice}</div>
              </div>
              <div>
                <strong>Recommended Actions:</strong>
                <ul>
                  {result.recommendedActions.map((a, i) => <li key={i}>{a}</li>)}
                </ul>
              </div>
              <div>
                <strong>Date:</strong> {result.date}
              </div>
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div className="sc-card sc-history-card">
            <h3>History</h3>
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









/*
import React, { useState } from 'react';
import axios from 'axios';
import './SymptomChecker.css';
import { Config } from '../constant';
import Navbar from '../components/layout/Navbar';

const GEMINI_API_KEY = 'replace-with-local-gemini-api-key';
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

function SymptomChecker() {
  const [symptoms, setSymptoms] = useState('');
  const [patient, setPatient] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);

  const getGeminiDiagnosis = async (patientName, symptoms) => {
    try {
      const response = await axios.post(
        GEMINI_API_URL,
        {
          contents: [{
            parts: [{
              text: `Act as a medical expert. For patient ${patientName} reporting these symptoms: ${symptoms}. 
              Provide a strict JSON response with these exact fields:
              {
                "possibleConditions": ["array", "of", "possible", "conditions"],
                "advice": "professional medical advice",
                "urgencyLevel": "low/medium/high",
                "recommendedActions": ["array", "of", "actions"]
              }
              Return ONLY valid JSON with no Markdown formatting or additional text.`
            }]
          }]
        },
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Extract and clean the response
      const responseText = response.data.candidates[0].content.parts[0].text;
      const cleanedResponse = responseText.replace(/```json|```/g, '').trim();
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error("Gemini API error:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!symptoms.trim()) return alert("Please enter symptoms");
    if (!patient.trim()) return alert("Please enter patient name");

    setLoading(true);

    try {
      const diagnosis = await getGeminiDiagnosis(patient, symptoms);

      const result = {
        id: Date.now(),
        patientName: patient,
        enteredSymptoms: symptoms,
        possibleConditions: diagnosis.possibleConditions,
        advice: diagnosis.advice,
        urgencyLevel: diagnosis.urgencyLevel,
        recommendedActions: diagnosis.recommendedActions,
        date: new Date().toLocaleString()
      };
const storedUser = JSON.parse(localStorage.getItem(Config.userApiTokenName));
  const userId = storedUser?.id;
      // Save to backend
      await Promise.all([
        axios.post(`${Config.serverUrl}/symptoms`, {
          patient,
          userId,
          symptoms,
          date: result.date
        }),
        axios.post(`${Config.serverUrl}/results`, result)
      ]);

      setResult(result);
      setHistory(prev => [result, ...prev].slice(0, 10)); // Keep last 10 entries
      setSymptoms('');
      setPatient('');
    } catch (error) {
      console.error("Diagnosis error:", error);
      alert("Error getting diagnosis. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <section>
        <Navbar />
        <div className="form-container">
          <h1>🩺 Symptom Checker</h1>

          <div className="form-group-container">
            <div className="form-group">
              <label htmlFor="patient-input">Patient Name:</label>
              <input
                id="patient-input"
                value={patient}
                onChange={(e) => setPatient(e.target.value)}
                type="text"
                placeholder="e.g. John Doe"
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="symptoms-input">Symptoms:</label>
              <textarea
                id="symptoms-input"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Describe symptoms in detail (e.g. headache, fever for 3 days)"
                disabled={loading}
                rows="3"
              />
            </div>

            <button 
              type="submit" 
              onClick={handleSubmit} 
              disabled={loading}
              className={loading ? 'loading' : ''}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Analyzing...
                </>
              ) : 'Check Symptoms'}
            </button>
          </div>

          {result && (
            <div className="result-box">
              <h3 style={{ fontWeight: 'bold', color: '#007bff' }} >Diagnosis for {result.patientName}</h3>
              <div className="result-grid">
                <div>
                  <h4 style={{ fontWeight: 'bold', color: '#007bff' }}>Symptoms</h4>
                  <p>{result.enteredSymptoms}</p>
                </div>
                <div>
                  <h4 style={{ fontWeight: 'bold', color: '#007bff' }}>Possible Conditions</h4>
                  <ul>
                    {result.possibleConditions.map((condition, i) => (
                      <li key={i}>{condition}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 style={{ fontWeight: 'bold', color: '#007bff' }}>Urgency</h4>
                  <span className={`urgency-${result.urgencyLevel.toLowerCase()}`}>
                    {result.urgencyLevel}
                  </span>
                </div>
                <div>
                  <h4 style={{ fontWeight: 'bold', color: '#007bff' }}>Advice</h4>
                  <p>{result.advice}</p>
                </div>
                <div>
                  <h4 style={{ fontWeight: 'bold', color: '#007bff' }}>Recommended Actions</h4>
                  <ol>
                    {result.recommendedActions.map((action, i) => (
                      <li key={i}>{action}</li>
                    ))}
                  </ol>
                </div>
              </div>
              <p className="timestamp" style={{ fontWeight: 'bold', color: '#007bff' }}>Checked on: {result.date}</p>
            </div>
          )}

          {history.length > 0 && (
            <div className="history-section">
              <h3 style={{ fontWeight: 'bold', color: '#007bff' }}>Recent Checks</h3>
              <div className="history-grid">
                {history.map((entry) => (
                  <div key={entry.id} className="history-card">
                    <h4>{entry.patientName}</h4>
                    <p className="symptoms">{entry.enteredSymptoms}</p>
                    <p className="conditions">
                      {entry.possibleConditions.slice(0, 2).join(', ')}
                      {entry.possibleConditions.length > 2 ? '...' : ''}
                    </p>
                    <span className={`urgency-${entry.urgencyLevel?.toLowerCase()}`}>
                      {entry.urgencyLevel}
                    </span>
                    <p className="date">{new Date(entry.date).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default SymptomChecker;
*/
