import React, { useState } from 'react';
import axios from 'axios';
import Navbar from '../components/layout/Navbar';
import './DoctorSearchStyle.css';
import { Link } from 'react-router';
import { Config } from '../constant';
import { searchDoctors } from '../api/features';

function DoctorSearch() {
  const [location, setLocation] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [allDoctors, setAllDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!location.trim() || !specialty.trim()) {
      alert('Please enter both location and specialty.');
      return;
    }

    setLoading(true);
    try {
      const response = await searchDoctors(location, specialty);
      setFilteredDoctors(response.data);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      alert('Failed to fetch doctors. Please try again.');
    }
    setLoading(false);
  };

  return (
    <section>
      <Navbar />
      <div className="form-container">
        <h1>Find Doctor</h1>

        <div className="former-group">
          <div className="form-group">
            <label htmlFor="location-input">Location:</label>
            <input
              id="location-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              type="text"
              placeholder="e.g. Aarhus, Copenhagen"
            />
          </div>

          <div className="form-group">
            <label htmlFor="specialty-input">Specialty:</label>
            <input
              id="specialty-input"
              value={specialty}
              onChange={(e) => setSpecialty(e.target.value)}
              type="text"
              placeholder="Cardiology, Neurology, etc."
            />
          </div>

          <button
            onClick={handleSearch}
            id="add-button"
            disabled={loading}
            style={{ marginTop: '20px' }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div>
          <h3>Results:</h3>
          {loading ? (
            <p>Loading doctors...</p>
          ) : filteredDoctors.length === 0 ? (
            <p>No doctors found for the search criteria.</p>
          ) : (
            <div
              style={{
                display: 'grid',
                gap: '15px',
                marginTop: '5vh',
                gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
              }}
            >
              {filteredDoctors.map((entry) => (
                <div
                  key={entry.id || entry.placeId || entry.name}
                  style={{
                    background: 'white',
                    padding: '15px',
                    borderRadius: '10px',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  <p><strong>Name:</strong> {entry.name}</p>
                  <p><strong>Address:</strong> {entry.address || 'N/A'}</p>
                  <p><strong>Location:</strong> {entry.city || entry.location || 'N/A'}</p>
                  <p><strong>Specialty:</strong> {entry.specialty || 'N/A'}</p>
                  <p><strong>Rating:</strong> {entry.rating ? `${entry.rating} ⭐` : 'N/A'}</p>
                  <p><strong>Phone:</strong> {entry.phoneNumber || entry.phone || 'N/A'}</p>
                  <p>
                    <strong>Website:</strong>{' '}
                    {entry.website ? (
                      <a href={entry.website} target="_blank" rel="noopener noreferrer">
                        Visit
                      </a>
                    ) : (
                      'N/A'
                    )}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default DoctorSearch;
