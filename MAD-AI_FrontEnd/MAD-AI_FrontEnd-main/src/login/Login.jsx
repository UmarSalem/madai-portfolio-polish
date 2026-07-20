import React, { useEffect, useState } from 'react';
import './LoginStyle.css';
import { Link, NavLink, useNavigate } from 'react-router';
import { ROUTE } from '../routes/ReactLinks';
import Navbar from '../components/layout/Navbar';
import { login } from '../api/auth';
import { getStoredAuthUser, saveAuthUser } from '../api/authSession';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getStoredAuthUser();
    if (user?.token) {
      navigate('/'); // Redirect to home if user is already logged in
    }
  }, [navigate]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    if (!email || !password) {
      setMessage('Please fill in all fields.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await login(email, password);
      saveAuthUser(res.data);
      setMessage('Login successful.');
      navigate('/doctor');
    } catch (error) {
      const apiMessage = error?.response?.data?.message;
      setMessage(apiMessage || 'Login failed. Please check your email and password.');
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <div>
      <Navbar />
      <section>
        <div className='miner-div'>
          <Link id='back' to="/">{"< Back"}</Link>
          <div className='main-div grid sm:grid-cols-2 items-center sm:grid-cols-1'>
            <div className='inputer-div  grid sm:order-2 order-1'>
              <div className='login-register'>

                <NavLink className="logina" to={ROUTE.Register}>
                  Register
                </NavLink>
              </div>
              <form onSubmit={handleSubmit}>



                <div className='three-main-or-div'>

                  <div className='responsive-div' >
                    <label for="Email ID">Email ID <br />
                      <input
                        type="email"
                        id="input"
                        value={email}

                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </label> <br />
                    <label for="Password">Password <br />
                      <input
                        type="password"
                        id="input"
                        value={password}

                        onChange={(e) => setPassword(e.target.value)}
                        required
                      /><br />
                    </label><br />
                  </div>
                  {message && <p>{message}</p>}
                  <div className='buttoner-div'>
                    <button id='sign' type='submit' disabled={isSubmitting}>
                      {isSubmitting ? 'Signing in...' : 'Sign In'}
                    </button>
                    <a className='forgot-a-password' href="#">Forgot Password?</a>
                  </div>
                </div>
              </form>
            </div>
            <figure className='mobile grid sm:order-2 order-1'>
              <img id='image-mobile' src={'./doctors.png'} alt="" />
            </figure>
          </div>
        </div>
      </section>

    </div>
  )
}

export default Login
