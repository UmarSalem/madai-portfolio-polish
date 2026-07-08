import React from 'react';
import './ContactCardStyle.css';

const ContactCard = ({ firstText, secondText, buttonText }) => {
  return (
    <div>

      <section>
        <div className='main-contact-card-div'>
          <h1>{firstText}</h1>
          <p>{secondText}</p>
          <button>{buttonText}</button>
        </div>
      </section>
      
    </div>
  )
}

export default ContactCard