import React from 'react';
import './ContactStyle.css';
import ContactCard from '../components/contactcard/ContactCard';
import Navbar from '../components/layout/Navbar';

const Contact = () => {
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
        <p>We will be happy to answer your demo project questions. Fill out the form and we will get back to you shortly.</p>
       </div>
       <div className='responsivers-div'>
        <label htmlFor="contact-name">Name <br />
         <input
          type="text"
          id="contact-name"
          className="contact-input"
          required
         />
        </label> <br />
        <label htmlFor="contact-subject">Subject <br />
         <input
          type="text"
          id="contact-subject"
          className="contact-input"
          required
         />
        </label><br />
        <label htmlFor="contact-email">Email <br />
         <input
          type="email"
          id="contact-email"
          className="contact-input"
          required
         />
        </label> <br />
        <label htmlFor="contact-message">Message <br />
         <textarea name="message" id="contact-message" className="contact-input"></textarea>
        </label> <br />
        <button id='button-submit' type="button">Submit</button>
       </div>
      </div>
      <div className='question-contact-div'>
       <div className='first-question-contact-div'>
        <h1>Contact Us</h1>
        <p>Have any Questions? We'd love to hear from you.</p>
       </div>
       <div className='second-question-contact-div'>
        <ContactCard id="card-contacts" firstText={'Press'} secondText={'Get in touch with the demo project team.'} buttonText={'Visit Page'} />
        <ContactCard id="card-contacts" firstText={'Help & Support'} secondText={'Ask about this educational portfolio demo.'} buttonText={'Visit Page'} />
        <ContactCard id="card-contacts" firstText={'Sales'} secondText={'This is a fictional contact card for demo purposes.'} buttonText={'Contact Sales'} />
       </div>
      </div>
      <div className='second-contact-div'>
       <div className='map-text-div'>
        <h1>Demo Location</h1>
        <p>This map is placeholder content for the portfolio demo.</p>
       </div>
       <iframe title="Demo map location" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d294932.436065358!2d-73.97950600000001!3d40.697141499999994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e1!3m2!1sen!2s!4v1746703068193!5m2!1sen!2s" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
      </div>
     </div>
     <div className='footer-div'>
      <div className='footer-first-div'>
       <i className="ri-twitter-line"></i>
       <i className="ri-facebook-box-line"></i>
       <i className="ri-swap-line"></i>
       <i className="ri-instagram-line"></i>
      </div>
      <div className='footer-second-div'>

       <div className='footer-second-div-part-one'>
        <h1>Our Services</h1>
        <p>AI demo guidance</p>
        <p>Report demo analysis</p>
        <p>Specialist recommendation</p>
       </div>

       <div className='footer-second-div-part-two'>
        <h1>Quick Links</h1>
        <p>AI Doctor</p>
        <p>Report demo</p>
        <p>Find specialist</p>
        <p>Contact</p>
        <p>Media</p>
        <p>Blogs</p>
       </div>

       <div className='footer-second-div-part-three'>
        <h1>Contact Us</h1>
        <p>Timing 24 Hours</p>
        <p>Contact Information</p>
        <p><i className="ri-smartphone-line"></i>000-000-0000</p>
        <p><i className="ri-mail-line"></i>demo.contact@example.test</p>
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
