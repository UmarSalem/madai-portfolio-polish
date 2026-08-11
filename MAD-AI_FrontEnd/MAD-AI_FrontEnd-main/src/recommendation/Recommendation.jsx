import React, { useState } from 'react';
import './RecommendationStyle.css';
import Navbar from '../components/layout/Navbar';

import { Config } from '../constant';

function Recommendation() {
  const [disease, setDisease] = useState('');
  const [location, setLocation] = useState('');
  const [filteredEntries, setFilteredEntries] = useState([]); // filtered data to display
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async () => {
    setError('');

    if (!disease.trim() && !location.trim()) {
      setError('Please enter a demo condition or city to search.');
      return;
    }

    setLoading(true);
    setHasSearched(true);
    try {
      // Fetch all data first without parameters
      const response = await fetch(`${Config.serverUrl}/recommendation`);
      if (!response.ok) {
        throw new Error('Unable to load demo recommendations.');
      }
      const data = await response.json();

      // Filter locally
      const filtered = data.filter((entry) => {
        const diseaseMatch = disease.trim()
          ? entry.disease?.toLowerCase().includes(disease.trim().toLowerCase())
          : true;
        const cityMatch = location.trim()
          ? entry.city?.toLowerCase().includes(location.trim().toLowerCase())
          : true;

        return diseaseMatch || cityMatch;
      });

      setFilteredEntries(filtered);
    } catch (error) {
      setFilteredEntries([]);
      setError('Unable to fetch demo doctor data right now. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <Navbar />
      <div className="form-container">
        <h1>Doctor Recommendation Demo</h1>

        <div className="former-group">
          <label htmlFor="disease-input">Demo condition:</label><br />
          <div className="form-group">
            <input
              id="disease-input"
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              type="text"
              placeholder="e.g. demo headache"
            />
          </div>

          <label htmlFor="location-input">Demo city/location:</label><br />
          <div className="form-group">
            <input
              id="location-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              type="text"
              placeholder="e.g. Demo City"
            />
          </div>

          <button
            onClick={handleSearch}
            id="add-button"
            disabled={loading || (!disease.trim() && !location.trim())}
            style={{ marginTop: '15px' }}
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
          {error && <p>{error}</p>}
        </div>

        <div className="table-container" style={{ marginTop: '30px' }}>
          {loading ? (
            <p>Searching demo doctors...</p>
          ) : !hasSearched ? (
            <p>Enter a demo condition or city to search.</p>
          ) : !error && filteredEntries.length === 0 ? (
            <p>No demo doctors found. Try another demo condition or location.</p>
          ) : error ? null : (
            <table className="doctor-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>City</th>
                 
                  <th>Place ID</th>
                  <th>Phone</th>
                  <th>Website</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {filteredEntries.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.name}</td>
                    <td>{entry.address}</td>
                    <td>{entry.city}</td>
                    
                    <td>{entry.placeId}</td>
                    <td>{entry.phoneNumber || 'N/A'}</td>
                    <td>
                      {entry.website ? (
                        <a href={entry.website} target="_blank" rel="noopener noreferrer">
                          Visit
                        </a>
                      ) : (
                        'N/A'
                      )}
                    </td>
                    <td>{entry.rating ? `${entry.rating} stars` : 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </section>
  );
}

export default Recommendation;
