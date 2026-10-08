import React from 'react';
import './CardStyle.css';

const Card = () => {
  return (
    <div>
      <div className='card flex '>

        <section>
          <div className='card-one'>
            <h1 className='heading'>+2.700</h1>
            <p className='text'>Fictional Patients</p>
          </div>
        </section>

        <hr />
        
        <section>
          <div className='card-one'>
            <h1 className='heading'>+980</h1>
            <p className='text'>Fictional Experts</p>
          </div>
        </section>

        <hr />

        <section>
          <div className='card-one'>
            <h1 className='heading'>+10</h1>
            <p className='text'>Illustrative Years</p>
          </div>
        </section>

      </div>
    </div>
  )
}

export default Card;