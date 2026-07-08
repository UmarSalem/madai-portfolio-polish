import React, { useState, useEffect } from 'react';
import './ProfileStyle.css';
import Navbar from '../components/layout/Navbar';
import axios from 'axios';
import { Config } from '../constant';

function Profile() {
  const [profileName, setProfileName] = useState('');
  const [profileLastName, setProfileLastName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePassword, setProfilePassword] = useState('');
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem(Config.userApiTokenName));
    const id = storedUser?.id;

    if (!id) {
      alert('User not found in local storage.');
      return;
    }

    setUserId(id);

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${Config.serverUrl}/users/${id}`);
        const data = res.data;
        setProfileName(data.fname || '');
        setProfileLastName(data.lname || '');
        setProfileEmail(data.email || '');
        setProfilePassword(data.password || '');
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        alert('Error fetching profile data.');
      }
    };

    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${Config.serverUrl}/users/${userId}`, {
        fname: profileName,
        lname: profileLastName,
        email: profileEmail,
        password: profilePassword,
      });
      alert('Profile updated successfully.');
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Error updating profile.');
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
            <form className='profile-form' onSubmit={handleSubmit}>
              <div className='profile-name-inputer'>
                <label htmlFor='name'>First Name:</label>
                <input
                  type='text'
                  id='name'
                  className='profile-inputer'
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                />
              </div>
              <div className='profile-name-inputer'>
                <label htmlFor='name'>Last Name:</label>
                <input
                  type='text'
                  id='name'
                  className='profile-inputer'
                  value={profileLastName}
                  onChange={(e) => setProfileLastName(e.target.value)}
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
                />
              </div>
              {/* <div className='profile-name-inputer'>
                <label htmlFor='password'>Password:</label>
                <input
                  type='password'
                  id='password'
                  className='profile-inputer'
                  value={profilePassword}
                  onChange={(e) => setProfilePassword(e.target.value)}
                />
              </div> */}
              <button type='submit'>Update Profile</button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
