import React from 'react';
import './DiagnorySummaryStyle.css';

const DiagnorySummary = () => {
  return (
    <div>

      <div className='diagnory-main-file'>

        <section>
          <div className='diagnory-one'>
            <div id='back'>
              <a href="#">{'< Back'}</a>
            </div>
            <div id='log-out'>
              <a href="#">Log Out</a>
            </div>
          </div>
        </section>

        <section>
          <div className="diagnory-two">
            <h1>Diagnosis Summary</h1>
          </div>
        </section>

        <section>
          <div className="diagnory-three">

            <div className='main-blackers-div'>

              <div className='twers-black-div'>
                <div className='black-one'>
                  <p>Patient Name:</p>
                </div>
                <div className='blacks-one'>
                  <p>Umar Saleem</p>
                </div>
              </div>

              <div className='twos-black-div'>
                <div className='black-one'>
                  <p>Diagnosis:</p>
                </div>
                <div className='blacks-one'>
                  <p>Influenza</p>
                </div>
              </div>

              <div className='two-black-div'>
                <div className='black-one-div'>
                  <div className='blackers-one'>
                    <p> Symptoms:</p>
                  </div>
                </div>
                <div className='blacker-one'>
                  <p>Fever, cough, headache</p>
                </div>
              </div>

              <div className='two-black-div'>
                <div className='black-one-div'>
                  <div className='blackers-one'>
                    <p>Medicines:</p>
                  </div>
                </div>
                <div className='blacker-one'>
                  <p>Paracetamol, Cough Syrup, Ibuprofen</p>
                </div>
              </div>

            </div>

          </div>
        </section>

        <section>
          <div className="diagnory-four">
            <button>PRINT</button>
            <p>Created by Mad-My AI-Doctor</p>
          </div>
        </section>

      </div>
      
    </div>
  )
}

export default DiagnorySummary;