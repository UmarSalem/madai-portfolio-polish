import React, { useEffect, useRef, useState } from 'react'
import { LuLogIn } from 'react-icons/lu';
import { Link, useNavigate } from 'react-router'
import { ROUTE } from '../../routes/ReactLinks';
import { MdLogout } from 'react-icons/md';
import { Config } from '../../constant';
import './NavbarStyle.css';

const Navbar = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const hamburger = document.querySelector(".hamburger");
    const navBar = document.querySelector(".nav-bar");

    if (hamburger && navBar) {
      hamburger.onclick = function () {
        navBar.classList.toggle("active");
      };
    }
  }, []);

  const handleLogOut = () => {

    const user = localStorage.removeItem(Config.userApiTokenName);

    navigate('/'); // Redirect to home if user is already logged in


  };

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => setIsOpen(false));
  function useClickOutside(ref, callback) {
    useEffect(() => {
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          callback();
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref, callback]);
  }
  return (
    <section>
      <header>
        <div className="main-navbars-div">
          <div className="logo">
            <img id="logoOne" src={"/logoOne.png"} />
          </div>
          <nav className="nav-bar">
            <ul>
              <li>
                <Link to={"/"}>Home</Link>
              </li>
              <li>
                <Link to={"/doctor"}>AI Doctor</Link>
              </li>
              {/* <li>
                    <a href="#">Lab Test</a>
                  </li> */}
              <li>
                <Link to={"/about"}>About</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
            </ul>
          </nav>
          <div className="two-icon-menu-div">
            <nav className="navbar">
              {!localStorage.getItem(Config.userApiTokenName) ? (
                <Link to="/login">
                  <icon type="submit" className="loginars">
                    <LuLogIn />
                    {" Login"}
                  </icon>
                </Link>
              ) : (
                <div className="navbar-right" ref={dropdownRef}>
                  <div className="login-button-diver">
                    <icon
                      className="login"
                      onClick={() => setIsOpen(!isOpen)}
                      aria-label="User menu"
                    >
                      <i className="ri-account-circle-line"></i>
                    </icon>
                  </div>

                  {isOpen && (
                    <div className="dropdown-menu">
                      <Link
                        to="/profile"
                        onClick={() => setIsOpen(false)}
                      >
                        <i class="ri-profile-line"></i> Profile
                      </Link>
                      <Link
                        to="/symptomChecker"
                        onClick={() => setIsOpen(false)}
                      >
                        <i className="ri-psychotherapy-line"></i>{" "}
                        SymptomChecker
                      </Link>
                      <Link
                        to="/recommendation"
                        onClick={() => setIsOpen(false)}
                      >
                        <i className="ri-registered-line"></i>{" "}
                        Find My Doctor
                      </Link>
                      <Link
                        to="/doctorSearch"
                        onClick={() => setIsOpen(false)}
                      >
                        <i className="ri-survey-line"></i> Find Best Doctor
                      </Link>
                      
                      {/* <Link to="/doctor" onClick={() => setIsOpen(false)}>
                              <i className="ri-nurse-fill"></i> Add Medical History
                            </Link> */}

                      {/* <Link
                              to="/medicalHistory"
                              onClick={() => setIsOpen(false)}
                            >
                              <i className="ri-medicine-bottle-line"></i>{" "}
                              MedicalHistory
                            </Link> */}

                      {/* <Link to="/record" onClick={() => setIsOpen(false)}>
                              <i className="ri-record-mail-line icon"></i>{" "}
                              Record
                            </Link> */}
                      <Link
                        to={ROUTE.Login}
                        id="loginars"
                        onClick={handleLogOut}
                      >
                        <icon type='submit' className="loginars">
                          <MdLogout />
                          {" Logout"}
                        </icon>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </nav>
          </div>
          {/* <div className='login-button-diver'>
          <NavLink className='login' to={ROUTE.Login}>
            <button>{true ? 'Logout' : 'Login'}</button>
          </NavLink>
         </div> */}
          <div className="hamburger">
            <div className="line"></div>
            <div className="line"></div>
            <div className="line"></div>
          </div>
        </div>
      </header>
    </section>
  )
}

export default Navbar;