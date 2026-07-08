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
            <h1 className="section-title">Empowering Healthcare with AI</h1>
            <p className="section-description">
              At AI Doctor, we believe everyone deserves fast, expert medical
              care. Our AI-powered platform helps users understand their
              symptoms, analyze lab tests, and get personalized recommendations—
              all while offering access to licensed professionals.
            </p>
          </section>

          {/* How It Works */}
          <section className="steps-section">
            <h2 className="section-subtitle">How It Works</h2>
            <h3 className="section-title">Your Health Journey in 3 Simple Steps</h3>
            <div className="steps-grid">
              <div className="step-card">
                <h4>1. Describe Your Symptoms</h4>
                <p>
                  Input your symptoms or upload lab results. Our AI understands
                  natural language and structured data.
                </p>
              </div>
              <div className="step-card">
                <h4>2. Get AI Diagnosis</h4>
                <p>
                  The system provides an instant analysis, potential conditions,
                  and suggests the next steps.
                </p>
              </div>
              <div className="step-card">
                <h4>3. Connect to a Doctor</h4>
                <p>
                  Review results and consult a licensed doctor for treatment,
                  prescriptions, or advice.
                </p>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="cta-section">
            <a href="/ai-doctor" className="cta-button">
              Start Your Diagnosis
            </a>
          </section>
        </main>

        <footer className="footer">
          &copy; 2025 AI Doctor. All rights reserved.
        </footer>
      </div>
    </>
  );
};

export default About;
