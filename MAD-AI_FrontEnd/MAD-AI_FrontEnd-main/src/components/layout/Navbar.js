import React, { useEffect, useRef, useState } from 'react'
import { LuLogIn } from 'react-icons/lu';
import { Link, useNavigate } from 'react-router'
import { ROUTE } from '../../routes/ReactLinks';
import { MdLogout } from 'react-icons/md';
import { clearAuthUser, getStoredAuthUser } from '../../api/authSession';
import './NavbarStyle.css';

const Navbar = () => {
  const navigate = useNavigate();
  const authUser = getStoredAuthUser();
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
    clearAuthUser();
    setIsOpen(false);
    navigate(ROUTE.Home);
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
            <img id="logoOne" src={"/logoOne.png"} alt="Madai logo" />
          </div>
          <nav className="nav-bar">
            <ul>
              <li>
                <Link to={ROUTE.Home}>Home</Link>
              </li>
              <li>
                <Link to={ROUTE.AiDoctor}>AI Doctor</Link>
              </li>
              {/* <li>
                    <a href="#">Lab Test</a>
                  </li> */}
              <li>
                <Link to={ROUTE.About}>About</Link>
              </li>
              <li>
                <Link to={ROUTE.Contact}>Contact</Link>
              </li>
            </ul>
          </nav>
          <div className="two-icon-menu-div">
            <nav className="navbar">
              {!authUser?.token ? (
                <Link to={ROUTE.Login}>
                  <span className="loginars">
                    <LuLogIn />
                    {" Login"}
                  </span>
                </Link>
              ) : (
                <div className="navbar-right" ref={dropdownRef}>
                  <div className="login-button-diver">
                    <button
                      type="button"
                      className="login"
                      onClick={() => setIsOpen(!isOpen)}
                      aria-label="User menu"
                    >
                      <i className="ri-account-circle-line"></i>
                    </button>
                  </div>

                  {isOpen && (
                    <div className="dropdown-menu">
                      <Link
                        to={ROUTE.Profile}
                        onClick={() => setIsOpen(false)}
                      >
                        <i className="ri-profile-line"></i> Profile
                      </Link>
                      <Link
                        to={ROUTE.SymptomChecker}
                        onClick={() => setIsOpen(false)}
                      >
                        <i className="ri-psychotherapy-line"></i>{" "}
                        SymptomChecker
                      </Link>
                      <Link
                        to={ROUTE.Recommendation}
                        onClick={() => setIsOpen(false)}
                      >
                        <i className="ri-registered-line"></i>{" "}
                        Find My Doctor
                      </Link>
                      <Link
                        to={ROUTE.DoctorSearch}
                        onClick={() => setIsOpen(false)}
                      >
                        <i className="ri-survey-line"></i> Find Best Doctor
                      </Link>
                      
                      {/* <Link to="/doctor" onClick={() => setIsOpen(false)}>
                              <i className="ri-nurse-fill"></i> Add Medical History
                            </Link> */}

                      <Link
                        to={ROUTE.MedicalHistory}
                        onClick={() => setIsOpen(false)}
                      >
                        <i className="ri-medicine-bottle-line"></i>{" "}
                        Medical History
                      </Link>

                      {/* <Link to="/record" onClick={() => setIsOpen(false)}>
                              <i className="ri-record-mail-line icon"></i>{" "}
                              Record
                            </Link> */}
                      <button
                        type="button"
                        id="loginars"
                        onClick={handleLogOut}
                      >
                        <span className="loginars">
                          <MdLogout />
                          {" Logout"}
                        </span>
                      </button>
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
