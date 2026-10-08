import React from 'react';
import { Config } from './constant';
import ReactRoute from './routes/ReactRoute';



function App() {

  return (
    <div>
      <aside aria-label="Portfolio demonstration" style={{ padding: '12px 20px', background: '#fff4d6', color: '#292218', position: 'relative', zIndex: 1000 }}>
        <strong>Madai — bachelor group project and portfolio demonstration.</strong>{' '}
        Use fictional data only. Not medical advice. AI guidance, report analysis and follow-up chat are incomplete;
        simulated responses are not live AI or medical recommendations.
        {!Config.apiConfigured && <p role="status">Backend not connected. Login, profile, symptom checker, doctor search and report upload require a configured backend.</p>}
      </aside>
      <ReactRoute />
    </div>
  );
}

export default App;