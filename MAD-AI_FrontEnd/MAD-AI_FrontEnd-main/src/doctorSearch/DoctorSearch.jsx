import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import './DoctorSearchStyle.css';
import { searchDoctors } from '../api/features';

const normalizeDoctor = (doctor, index) => ({
  id: doctor?.id || doctor?.placeId || `${doctor?.name || 'doctor'}-${index}`,
  name: doctor?.name || 'Demo doctor clinic',
  address: doctor?.address || 'Address not available',
  location: doctor?.location || 'Demo location',
  specialty: doctor?.specialty || 'Demo specialty',
  rating: doctor?.rating || 0,
  userRatingsTotal: doctor?.userRatingsTotal || 0,
  phoneNumber: doctor?.phoneNumber || 'Demo phone not available',
  website: doctor?.website || '',
  isDemo: Boolean(doctor?.isDemo),
});

function DoctorSearch() {
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (event) => {
    event.preventDefault();
    setError('');

    const trimmedLocation = location.trim();
    const trimmedSpecialty = specialty.trim();

    if (!trimmedLocation || !trimmedSpecialty) {
      setError('Please enter a demo location and specialty.');
      setDoctors([]);
      return;
    }

    setLoading(true);
    setHasSearched(true);

    try {
      const response = await searchDoctors(trimmedLocation, trimmedSpecialty);
      const normalizedDoctors = Array.isArray(response.data)
        ? response.data.map(normalizeDoctor)
        : [];

      setDoctors(normalizedDoctors);
    } catch (requestError) {
      const status = requestError?.response?.status;
      setDoctors([]);

      if (status === 401 || status === 403) {
        setError('Please log in as a demo patient before searching for doctors.');
      } else {
        setError('Unable to search demo doctors right now. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <Navbar />
      <div className="doctor-search-page">
        <div className="doctor-search-panel">
          <h1>Find Doctor</h1>
          <p className="doctor-search-note">
            Use demo search terms only. Live results require a Google Places key configured outside Git; otherwise Madai shows fictional demo doctors.
          </p>

          <form className="doctor-search-form" onSubmit={handleSearch}>
            <div className="doctor-form-group">
              <label htmlFor="location-input">Demo Location</label>
              <input
                id="location-input"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                type="text"
                placeholder="e.g. Demo City"
                disabled={loading}
              />
            </div>

            <div className="doctor-form-group">
              <label htmlFor="specialty-input">Specialty</label>
              <input
                id="specialty-input"
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                type="text"
                placeholder="e.g. Cardiology"
                disabled={loading}
              />
            </div>

            {error && <p className="doctor-search-error">{error}</p>}

            <button type="submit" className="doctor-search-button" disabled={loading}>
              {loading ? 'Searching...' : 'Search Demo Doctors'}
            </button>
          </form>
        </div>

        <div className="doctor-results-section">
          <h2>Results</h2>

          {!hasSearched && !loading && (
            <p className="doctor-empty-state">Enter a demo location and specialty to search.</p>
          )}

          {loading && <p className="doctor-empty-state">Loading doctors...</p>}

          {hasSearched && !loading && !error && doctors.length === 0 && (
            <p className="doctor-empty-state">No doctors found for those demo search terms.</p>
          )}

          {doctors.length > 0 && (
            <div className="doctor-results-grid">
              {doctors.map((doctor) => (
                <article key={doctor.id} className="doctor-result-card">
                  <div className="doctor-card-header">
                    <h3>{doctor.name}</h3>
                    {doctor.isDemo && <span className="doctor-demo-badge">Demo</span>}
                  </div>
                  <p><strong>Address:</strong> {doctor.address}</p>
                  <p><strong>Location:</strong> {doctor.location}</p>
                  <p><strong>Specialty:</strong> {doctor.specialty}</p>
                  <p>
                    <strong>Rating:</strong>{' '}
                    {doctor.rating > 0 ? `${doctor.rating} (${doctor.userRatingsTotal} reviews)` : 'N/A'}
                  </p>
                  <p><strong>Phone:</strong> {doctor.phoneNumber}</p>
                  <p>
                    <strong>Website:</strong>{' '}
                    {doctor.website ? (
                      <a href={doctor.website} target="_blank" rel="noopener noreferrer">
                        Visit
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </p>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default DoctorSearch;
