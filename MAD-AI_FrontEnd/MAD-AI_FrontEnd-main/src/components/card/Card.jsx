import React from 'react';
import './CardStyle.css';

const Card = () => {
  return (
    <div>
      <div className='card flex '>

        <section>
          <div className='card-one'>
            <h1 className='heading'>+2.700</h1>
            <p className='text'>Satisfied Patients</p>
          </div>
        </section>

        <hr />
        
        <section>
          <div className='card-one'>
            <h1 className='heading'>+980</h1>
            <p className='text'>Expert Available</p>
          </div>
        </section>

        <hr />

        <section>
          <div className='card-one'>
            <h1 className='heading'>+10</h1>
            <p className='text'>Years or Expertise</p>
          </div>
        </section>

      </div>
    </div>
  )
}

export default Card;