import React, { useEffect, useState } from 'react';
import './RegisterStyle.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTE } from '../routes/ReactLinks';
import bcrypt from 'bcryptjs';
import { Config } from '../constant';
import Navbar from '../components/layout/Navbar';
import { register } from '../api/auth';

const Register = () => {
  const [fname, setFirstName] = useState('');
  const [lname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [passwords, setPassword] = useState('');
  const navigate = useNavigate();


  useEffect(() => {
    const user = localStorage.getItem(Config.userApiTokenName);
    if (user) {
      navigate('/'); // Redirect to home if user is already logged in
    }
  }, []);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !passwords || !fname || !lname) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      // Check if user already exists
      const existing = await fetch(`${Config.serverUrl}/users?email=${email}`);
      const users = await existing.json();
      if (users.length > 0) {
        alert("User already exists with this email.");
        return;
      }

      // Encrypt password
      // const salt = bcrypt.genSaltSync(10);
      // const hashedPassword = bcrypt.hashSync(passwords, salt);
      const encodedPassword = btoa(passwords);
      // Save to db.json
      const newUser = {
        fname,
        lname,
        email,
        password: encodedPassword
      };

      const response = await fetch(`${Config.serverUrl}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newUser)
      });

      if (response.ok) {
        alert("Registered successfully!");
        navigate('/login');
      } else {
        alert("Something went wrong while registering.");
      }

    } catch (error) {
      console.error("Registration Error:", error);
      alert("An error occurred.");
    }
  };

  return (
    <div>
      <Navbar />
      <section>
        <div className='main-first-div'>
          <div className='main-div'>
            <NavLink id='back' to="/">{"< Back"}</NavLink>
            <div className='inputers-div'>
              <div className='login-register'>
                <NavLink className="logina" to={ROUTE.Login}>Login</NavLink>
              </div>
              <form onSubmit={handleSubmit}>
                <div className='register-user'>

                  <div className='responsive-input'>
                    <label>First Name<br />
                      <input type="text" id="input" value={fname} onChange={(e) => setFirstName(e.target.value)} required />
                    </label><br />

                    <label>Last Name<br />
                      <input type="text" id="input" value={lname} onChange={(e) => setLastName(e.target.value)} required />
                    </label><br />

                    <label>Email ID<br />
                      <input type="email" id="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </label><br />

                    <label>Password<br />
                      <input type="password" id="input" value={passwords} onChange={(e) => setPassword(e.target.value)} required />
                    </label><br />
                  </div>
                  <br /><br />

                  <div className='buttoner-div'>
                    <button type='submit' id='sign'>Register</button>
                    {/* <a href="#">Forgot Password?</a> */}
                  </div>

                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Register;
