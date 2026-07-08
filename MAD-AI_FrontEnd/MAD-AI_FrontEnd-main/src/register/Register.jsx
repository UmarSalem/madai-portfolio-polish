import React, { useEffect, useState } from 'react';
import './RegisterStyle.css';
import { NavLink, useNavigate } from 'react-router-dom';
import { ROUTE } from '../routes/ReactLinks';
import Navbar from '../components/layout/Navbar';
import { register } from '../api/auth';
import { getStoredAuthUser } from '../api/authSession';

const Register = () => {
  const [fname, setFirstName] = useState('');
  const [lname, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [passwords, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    const user = getStoredAuthUser();
    if (user) {
      navigate('/'); // Redirect to home if user is already logged in
    }
  }, [navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!email || !passwords || !fname || !lname) {
      setMessage('Please fill in all fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register({
        firstName: fname,
        lastName: lname,
        email,
        password: passwords,
        role: 'Patient',
      });

      setMessage('Registered successfully. You can now log in.');
      navigate('/login');
    } catch (error) {
      const apiMessage = error?.response?.data?.error || error?.response?.data?.message;
      setMessage(apiMessage || 'Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
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
                  {message && <p>{message}</p>}
                  <br /><br />

                  <div className='buttoner-div'>
                    <button type='submit' id='sign' disabled={isSubmitting}>
                      {isSubmitting ? 'Registering...' : 'Register'}
                    </button>
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
