import { Link } from 'react-router';
import React from "react";
import Navbar from "../components/layout/Navbar";
import "./about.css"
const About = () => {
  return (
   <>
      <Navbar />
      <div className="about-page">
        <main className="about-main">
          {/* About Us Section */}
          <section className="about-section text-center">
            <h2 className="section-subtitle">About Us</h2>
            <h1 className="section-title">About the Madai demonstration</h1>
            <p className="section-description">
              Madai began as a bachelor group project. This portfolio version demonstrates React and ASP.NET Core architecture. The planned AI guidance, report analysis and follow-up chat are incomplete; it does not provide diagnosis or access to medical care.
            </p>
          </section>

          {/* Planned Features */}
          <section className="steps-section">
            <h2 className="section-subtitle">Planned Features</h2>
            <h3 className="section-title">Conceptual flow — not verified end to end</h3>
            <div className="steps-grid">
              <div className="step-card">
                <h4>1. Describe Your Symptoms</h4>
                <p>
                  Input your symptoms or upload lab results. AI interpretation is a planned feature.
                </p>
              </div>
              <div className="step-card">
                <h4>2. Explore Initial Guidance</h4>
                <p>
                  Guidance may be simulated or unavailable; it is not medical advice.
                </p>
              </div>
              <div className="step-card">
                <h4>3. Connect to a Doctor</h4>
                <p>
                  Search integration requires a configured backend. Demo listings do not arrange real appointments.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="cta-section">
            <Link to="/demo" className="cta-button">
              Explore frontend demo — no login
            </Link>
          </section>
        </main>

        <footer className="footer">
          &copy; 2026 Madai — bachelor group project with later portfolio improvements.
        </footer>
      </div>
    </>
  );
};

export default About;
