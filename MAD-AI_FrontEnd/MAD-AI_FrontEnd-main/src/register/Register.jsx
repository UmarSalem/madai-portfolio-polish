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
    if (user?.token) {
      navigate(ROUTE.Home); // Redirect to home if user is already logged in
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
      navigate(ROUTE.Login);
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
            <NavLink id='back' to={ROUTE.Home}>{"< Back"}</NavLink>
            <div className='inputers-div'>
              <div className='login-register'>
                <NavLink className="logina" to={ROUTE.Login}>Login</NavLink>
              </div>
              <form onSubmit={handleSubmit}>
                <div className='register-user'>

                  <div className='responsive-input'>
                    <label htmlFor="register-first-name">First Name<br />
                      <input type="text" id="register-first-name" className="form-input" value={fname} onChange={(e) => setFirstName(e.target.value)} required />
                    </label><br />

                    <label htmlFor="register-last-name">Last Name<br />
                      <input type="text" id="register-last-name" className="form-input" value={lname} onChange={(e) => setLastName(e.target.value)} required />
                    </label><br />

                    <label htmlFor="register-email">Email ID<br />
                      <input type="email" id="register-email" className="form-input" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </label><br />

                    <label htmlFor="register-password">Password<br />
                      <input type="password" id="register-password" className="form-input" value={passwords} onChange={(e) => setPassword(e.target.value)} required />
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
