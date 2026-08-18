import React, { useEffect, useState } from "react";
import Button from "../components/Button/button";
import Card from "../components/card/Card";
import Cards from "../components/cards/Cards";
import DataCards from "../components/dataCards/DataCards";
import "./HomeStyle.css";
import Navbar from "../components/layout/Navbar";
import { Config } from "../constant";
import axios from "axios";

const Home = () => {
 
  const [entries, setEntries] = useState([]);
  const [blogsLoading, setBlogsLoading] = useState(true);
  const [blogsError, setBlogsError] = useState('');

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setBlogsLoading(true);
        setBlogsError('');
        const response = await axios.get(`${Config.serverUrl}/blogs`);
        setEntries(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        setBlogsError('Unable to load demo blog posts right now.');
      } finally {
        setBlogsLoading(false);
      }
    };
  
    fetchBlogs();
  }, []);

  return (
    <div>
      <div className="main-div">
        
<Navbar/>
        <section>
          <div className="new-main-div">
            <div className="grid sm:grid-cols-2 md:items-center flex md:justify-items-center sm:grid-cols-1">
              <div className="new-first-div grid sm:order-2 order-1">
                <p id="well-come">Welcome to Madai</p>
                <h1 id="expert">Expert Care, Anytime, Anywhere</h1>
                <p>
                  Educational healthcare assistant demo for fictional symptoms,
                  doctor search, and report upload flows.
                </p>
                <div className="new-buttons-div">
                  <Button button={"ABOUT US"} navigate={"/about"} />
                  <Button button={"CONTACT US"} navigate={"/contact"} />
                </div>
              </div>
              <figure className="new-second-div grid sm:order-2 order-1">
                <img className="new-image" src={"/doctor.png"} alt="Doctor consultation illustration" />
              </figure>
            </div>
          </div>
        </section>

        <section>
          <div className="third-div">
            <div>
              <Cards />
            </div>
            <div className="third-div-part-one">
              <Card />
            </div>
          </div>
        </section>

        <section>
          <div className="fourth-div grid sm:grid-cols-2 mt-6 flex justify-items-center sm:grid-cols-1">
            <div className="part-one-of-four grid sm:order-2 order-1">
              <h1 id="lets-start">
                Let's start with your{" "}
                <strong id="first-name">first name.</strong>
              </h1>
              <input
                className="inputbox"
                type="text"
                aria-label="First name"
                placeholder="Type your first name here"
              />
              <button className="book">Book Appointment</button>
            </div>
            <figure className="part-two-of-four grid sm:order-2 order-1">
              <img className="one-image" src={"/doctors.png"} alt="Doctors team illustration" />
            </figure>
          </div>
        </section>

        <section>
          <div className="fifth-div">
            <h1 id="recent-blog">Recent Blogs</h1>
            {blogsLoading && <p>Loading demo blog posts...</p>}
            {blogsError && <p>{blogsError}</p>}
            {!blogsLoading && !blogsError && entries.length === 0 && (
              <p>No demo blog posts are available right now.</p>
            )}
            <div className="data-carders mx-auto grid lg:grid-cols-4 md:grid-cols-2 gap-6 px-[20px]">
              {entries.map((entry, index) => ( 
              <DataCards blog={entry} key={index}/>
            
            ))}
             
            </div>
          </div>
        </section>

        <section>
          <div className="footer-div">
            <div className="footer-first-div">
              <i className="ri-twitter-line"></i>
              <i className="ri-facebook-box-line"></i>
              <i className="ri-swap-line"></i>
              <i className="ri-instagram-line"></i>
            </div>
            <div className="footer-second-div">
              <div className="footer-second-div-part-one">
                <h1>Our Services</h1>
                <p>AI demo guidance</p>
                <p>Report demo analysis</p>
                <p>Specialist recommendation</p>
              </div>

              <div className="footer-second-div-part-two">
                <h1>Quick Links</h1>
                <p>AI Doctor</p>
                <p>Report demo</p>
                <p>Find specialist</p>
                <p>Contact</p>
                <p>Media</p>
                <p>Blogs</p>
              </div>

              <div className="footer-second-div-part-three">
                <h1>Contact Us</h1>
                <p>Timing 24 Hours</p>
                <p>Contact Information</p>
                <p>
                  <i className="ri-smartphone-line"></i>000-000-0000
                </p>
                <p>
                  <i className="ri-mail-line"></i>demo.contact@example.test
                </p>
                <div className="footer-button-div">
                  <button className="call-button">Call</button>
                  <button className="call-contact-button">Contact</button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
