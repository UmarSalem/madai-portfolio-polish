import React, { useState, useEffect } from 'react';
import './ProfileStyle.css';
import Navbar from '../components/layout/Navbar';
import { useNavigate } from 'react-router';
import { getMyProfile, updateMyProfile } from '../api/auth';
import { clearAuthUser } from '../api/authSession';

function Profile() {
  const [profileName, setProfileName] = useState('');
  const [profileLastName, setProfileLastName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setMessage('');
        const res = await getMyProfile();
        const data = res.data;
        setProfileName(data.firstName || '');
        setProfileLastName(data.lastName || '');
        setProfileEmail(data.email || '');
      } catch (error) {
        if (error?.response?.status === 401) {
          clearAuthUser();
          navigate('/login');
          return;
        }
        setMessage('Error fetching profile data.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setSaving(true);
    try {
      const response = await updateMyProfile({
        firstName: profileName,
        lastName: profileLastName,
        email: profileEmail,
      });
      const data = response.data;
      setProfileName(data.firstName || '');
      setProfileLastName(data.lastName || '');
      setProfileEmail(data.email || '');
      setMessage('Profile updated successfully.');
    } catch (error) {
      if (error?.response?.status === 401) {
        clearAuthUser();
        navigate('/login');
        return;
      }
      setMessage('Error updating profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <Navbar />
      <section>
        <div className='main-div'>
          <div className='profile-inputer-div'>
            <div className='profile-header'>
              <h1>My Profile</h1>
            </div>
            {loading && <p>Loading profile...</p>}
            {message && <p>{message}</p>}
            <form className='profile-form' onSubmit={handleSubmit}>
              <div className='profile-name-inputer'>
                <label htmlFor='firstName'>First Name:</label>
                <input
                  type='text'
                  id='firstName'
                  className='profile-inputer'
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  disabled={loading || saving}
                  required
                />
              </div>
              <div className='profile-name-inputer'>
                <label htmlFor='lastName'>Last Name:</label>
                <input
                  type='text'
                  id='lastName'
                  className='profile-inputer'
                  value={profileLastName}
                  onChange={(e) => setProfileLastName(e.target.value)}
                  disabled={loading || saving}
                  required
                />
              </div>
              <div className='profile-name-inputer'>
                <label htmlFor='email'>Email:</label>
                <input
                  type='email'
                  id='email'
                  className='profile-inputer'
                  value={profileEmail}
                  onChange={(e) => setProfileEmail(e.target.value)}
                  disabled={loading || saving}
                  required
                />
              </div>
              <button type='submit' disabled={loading || saving}>
                {saving ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
