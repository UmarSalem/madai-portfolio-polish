import React from 'react';
import './DetailCardStyle.css';

const DetailCard = () => {
  return (
    <div>

      <section>
        <div className='main-card-div'>
          <div className='image-dr-div'>
            <div className='image-div'>
            </div>
            <div className='dr-text'>
              <h1>Dr Nauman Iftikhar</h1>
              <p id='heart'>Heart Specialist</p>
              <p>Experience:10+</p>
              <p id='heart'>Charges 5000 Rs</p>
            </div>
          </div>
          <div className='two-dr-button-div'>
            <div className='first-button'>
              <button>Book Online Consult</button>
            </div>
            <div className='second-button'>
              <button>Book Hospital Visit</button>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}

export default DetailCard