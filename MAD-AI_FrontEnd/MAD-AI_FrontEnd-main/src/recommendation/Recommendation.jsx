import React, { useState } from 'react';
import './RecommendationStyle.css';
import Navbar from '../components/layout/Navbar';

import { Config } from '../constant';

function Recommendation() {
  const [disease, setDisease] = useState('');
  const [location, setLocation] = useState('');
  const [allEntries, setAllEntries] = useState([]);  // all data fetched from API
  const [filteredEntries, setFilteredEntries] = useState([]); // filtered data to display
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!disease.trim() && !location.trim()) {
      alert('Please enter at least disease or city to search.');
      return;
    }

    setLoading(true);
    try {
      // Fetch all data first without parameters
      const response = await fetch(`${Config.serverUrl}/recommendation`);
      setAllEntries(response.data);

      // Filter locally
      const filtered = response.data.filter((entry) => {
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
      console.error('Error fetching doctor data:', error);
      alert('Failed to fetch doctor data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <Navbar />
      <div className="form-container">
        <h1>Doctor Recommendation by Disease and City</h1>

        <div className="former-group">
          <label htmlFor="disease-input">Disease:</label><br />
          <div className="form-group">
            <input
              id="disease-input"
              value={disease}
              onChange={(e) => setDisease(e.target.value)}
              type="text"
              placeholder="e.g. Eye, Heart, Skin"
            />
          </div>

          <label htmlFor="location-input">City/Location:</label><br />
          <div className="form-group">
            <input
              id="location-input"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              type="text"
              placeholder="e.g. Aarhus, Copenhagen"
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
        </div>

        <div className="table-container" style={{ marginTop: '30px' }}>
          {loading ? (
            <p>Loading doctors...</p>
          ) : filteredEntries.length === 0 ? (
            <p>No doctor found. Try searching by disease and location.</p>
          ) : (
            <table className="doctor-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Address</th>
                  <th>city</th>
                 
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
                    <td>{entry.rating ? `${entry.rating} ⭐` : 'N/A'}</td>
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
