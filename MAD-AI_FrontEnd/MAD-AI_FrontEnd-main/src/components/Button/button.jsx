import React from 'react';
import './ButtonStyle.css';
import { Link } from 'react-router';

const Button = ({ button, navigate }) => {
  return (
    <div>
      <section>
        <Link to={navigate} className='first-button'>{button}</Link>
      </section>
    </div>
  )
}

export default Button;