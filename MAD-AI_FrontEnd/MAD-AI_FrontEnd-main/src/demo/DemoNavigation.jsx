import React from 'react';
import { NavLink, Link } from 'react-router';
import { ROUTE } from '../routes/ReactLinks';
import './DemoStyle.css';

export default function DemoNavigation() {
  return <aside className="demo-navigation" aria-label="Frontend demo mode">
    <h1>Madai — frontend demo mode</h1>
    <p>Fictional seeded data and simulated responses. No login, live AI or medical advice. Nothing you select is saved or sent to a backend. Do not enter real health information.</p>
    <nav aria-label="Demo navigation">
      <NavLink end to={ROUTE.Demo}>Symptom examples</NavLink>
      <NavLink to={ROUTE.DemoDoctors}>Fictional doctors</NavLink>
      <NavLink to={ROUTE.DemoReports}>Sample reports</NavLink>
      <Link to={ROUTE.Home}>Exit demo</Link>
    </nav>
  </aside>;
}
