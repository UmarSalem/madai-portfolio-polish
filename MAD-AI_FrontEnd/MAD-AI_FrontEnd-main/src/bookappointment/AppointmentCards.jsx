import React from 'react';
import './AppointmentCardsStyle.css';
import DetailCard from '../components/detailcard/DetailCard';

const AppointmentCards = () => {
   return (
      <div>

         <div className='main-cards-div'>

            <section>
               <div className='diagnory-one'>
                  <div id='back'>
                     <a href="#">{'< Back'}</a>
                  </div>
                  <div>
                     <button className='book'>Book Appointment</button>
                  </div>
                  <div id='log-out'>
                     <a href="#">Log Out</a>
                  </div>
               </div>
            </section>

            <section>
               <div className='main-inputs-search'>
                  <div className='search-doctor'>
                     <div className='two-icons-text'>
                        <i class="ri-search-2-line"></i><input type="text" placeholder='Search Doctors, Specialist' />
                     </div>
                  </div>
                  <div className='search-location'>
                     <div className='twos-icons-text'>
                        <i class="ri-map-pin-2-fill"></i><input type="text" placeholder='Select Location' />
                     </div>
                     <div>
                        <i class="ri-arrow-down-s-fill"></i>
                     </div>
                  </div>

               </div>
            </section>

            <section>
               <div className='four-detailcard'>
                  <DetailCard />
                  <DetailCard />
                  <DetailCard />
                  <DetailCard />
               </div>
            </section>

         </div>

      </div>
   )
}

export default AppointmentCards