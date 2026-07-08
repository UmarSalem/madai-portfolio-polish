import React, { useEffect, useState, useRef } from 'react';
import './ContactStyle.css';
import { Link, useNavigate } from 'react-router';
import { ROUTE } from '../routes/ReactLinks';
import { LuLogIn } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import ContactCard from '../components/contactcard/ContactCard';
import Navbar from '../components/layout/Navbar';

const Contact = () => {
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
  localStorage.removeItem('names');
  localStorage.removeItem('namers');
  localStorage.removeItem('email');
  localStorage.removeItem('passwords');
  localStorage.removeItem('firstName');
  localStorage.removeItem('lastName');
  localStorage.removeItem('age');
  localStorage.removeItem('lastCheckup');
  localStorage.removeItem('symptoms');
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
   document.addEventListener('mousedown', handleClickOutside);
   return () => {
    document.removeEventListener('mousedown', handleClickOutside);
   };
  }, [ref, callback]);
 }

 return (
  <div>
<Navbar/>

   <section>
    <div className="ai-main-div">
     <div className="diagnory-one">
      <div id="back">
       <a href="/doctor">{'< Back'}</a>
      </div>
     </div>
    </div>
   </section>

   <section>
    <div className='contact-page'>
     <div className='main-contact-div'>
      <div className='first-contact-div'>
       <div className='contact-text-div'>
        <h1>Contact Our Sales Team</h1>
        <p>We will be happy to answer your sale question. Fill out the form and we will get back to you shortly.</p>
       </div>
       <div className='responsivers-div'>
        <label for="Name">Name <br />
         <input
          type="names"
          id="full-inputs"
          required
         />
        </label> <br />
        <label for="subject">Subject <br />
         <input
          type="subject"
          id="full-inputs"
          required
         />
        </label><br />
        <label for="Email">Email <br />
         <input
          type="Email"
          id="full-inputs"
          required
         />
        </label> <br />
        <label for="Message">Message <br />
         <textarea name="message" id="full-inputs"></textarea>
        </label> <br />
        <button id='button-submit'>Submit</button>
       </div>
      </div>
      <div className='question-contact-div'>
       <div className='first-question-contact-div'>
        <h1>Contact Us</h1>
        <p>Have any Questions? We'd love to hear from you.</p>
       </div>
       <div className='second-question-contact-div'>
        <ContactCard id="card-contacts" firstText={'Press'} secondText={'Get in touch with our sales team to see how we can work togather.'} buttonText={'Visit Page'} />
        <ContactCard id="card-contacts" firstText={'Help & Support'} secondText={'Get in touch with our sales team to see how we can work togather.'} buttonText={'Visit Page'} />
        <ContactCard id="card-contacts" firstText={'Sales'} secondText={'Get in touch with our sales team to see how we can work togather.'} buttonText={'Contact Sales'} />
       </div>
      </div>
      <div className='second-contact-div'>
       <div className='map-text-div'>
        <h1>Enter Your Home Location</h1>
        <p>We will enter the home location I am give the map to your enter the location on the map.</p>
       </div>
       <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d294932.436065358!2d-73.97950600000001!3d40.697141499999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e1!3m2!1sen!2s!4v1746703068193!5m2!1sen!2s" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
      </div>
     </div>
     <div className='footer-div'>
      <div className='footer-first-div'>
       <i class="ri-twitter-line"></i>
       <i class="ri-facebook-box-line"></i>
       <i class="ri-swap-line"></i>
       <i class="ri-instagram-line"></i>
      </div>
      <div className='footer-second-div'>

       <div className='footer-second-div-part-one'>
        <h1>Our Services</h1>
        <p>AI Diagnostic</p>
        <p>AI Test Diagnostic</p>
        <p>Specilist Recomendation</p>
       </div>

       <div className='footer-second-div-part-two'>
        <h1>Quick Links</h1>
        <p>AI Doctor</p>
        <p>Lab Test Analyser</p>
        <p>Find Specilist</p>
        <p>Contact</p>
        <p>Media</p>
        <p>Blogs</p>
       </div>

       <div className='footer-second-div-part-three'>
        <h1>Contact Us</h1>
        <p>Timing 24 Hours</p>
        <p>Contact Information</p>
        <p><i class="ri-smartphone-line"></i>+45-71444404</p>
        <p><i class="ri-mail-line"></i>Naumandk1@gmail.com</p>
        <div className='footer-button-div'>
         <button className='call-button'>Call</button>
         <button className='call-contact-button'>Contact</button>
        </div>
       </div>

      </div>
     </div>
    </div>
   </section>

  </div>
 )
}

export default Contact;