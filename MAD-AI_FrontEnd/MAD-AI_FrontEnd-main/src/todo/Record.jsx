import React, { useState, useEffect } from 'react';
import './RecordStyle.css';
import { useNavigate } from 'react-router';

function Record() {
   const [patients, setPatients] = useState([]);
   const [newPatient, setNewPatient] = useState({
      firstName: '',
      lastName: '',
      age: '',
      date: new Date().toISOString().split('T')[0],
      symptoms: '',
   });
   const navigate = useNavigate();

   useEffect(() => {
      const loadPatients = () => {
         const storedPatients = JSON.parse(localStorage.getItem('patients')) || [];
         setPatients(storedPatients);
      };

      loadPatients();

      window.addEventListener('storage', loadPatients);
      return () => window.removeEventListener('storage', loadPatients);
   }, []);

   const handleInputChange = (e) => {
      const { name, value } = e.target;
      setNewPatient({
         ...newPatient,
         [name]: value,
      });
   };

   const addPatient = () => {
      if (newPatient.firstName && newPatient.lastName && newPatient.age && newPatient.symptoms) {
         const updatedPatients = [...patients, newPatient];
         setPatients(updatedPatients);
         localStorage.setItem('patients', JSON.stringify(updatedPatients));

         setNewPatient({
            firstName: '',
            lastName: '',
            age: '',
            date: new Date().toISOString().split('T')[0],
            symptoms: '',
         });
      } else {
         alert('Please fill in all fields');
      }
   };

   const deletePatient = (index) => {
      const updatedPatients = patients.filter((_, i) => i !== index);
      setPatients(updatedPatients);
      alert('If you want to delete this record!')
      localStorage.setItem('patients', JSON.stringify(updatedPatients));
   };

   // const deleteButtonIcon = () => {
   //    alert('If you want to delete this record')
   // }

   return (
      <div className="app-container">

         {/* <section>
            <div className="ai-main-div">
               <div className="diagnory-one">
                  <div id="back">
                     <a href="/doctor">{'< Back'}</a>
                  </div>
               </div>
            </div>
         </section> */}
  
         {/*
         <section>
         <div className="form-container">
            <h1>Add Patient</h1>
            <div className="form-group">
               <label>First Name:</label>
               <input
                  type="text"
                  name="firstName"
                  value={newPatient.firstName}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
               />
            </div>

            <div className="form-group">
               <label>Last Name:</label>
               <input
                  type="text"
                  name="lastName"
                  value={newPatient.lastName}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
               />
            </div>

            <div className="form-group">
               <label>Age:</label>
               <input
                  type="number"
                  name="age"
                  value={newPatient.age}
                  onChange={handleInputChange}
                  placeholder="Enter age"
               />
            </div>

            <div className="form-group">
               <label>Date:</label>
               <input
                  type="date"
                  name="date"
                  value={newPatient.date}
                  onChange={handleInputChange}
               />
            </div>

            <div className="form-group">
               <label>Symptoms:</label>
               <textarea
                  name="symptoms"
                  value={newPatient.symptoms}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Enter symptoms"
               />
            </div>

            <div className="button-group">
               <button onClick={addPatient} className="add-button">
                  Add Patient
               </button>
            </div>
         </div>
         </section> */}

         <section>
            <div className="patients-list">
               <h2>Patient Records</h2>
               {patients.length === 0 ? (
                  <p>No patients added yet.</p>
               ) : (
                  <div className="patient-cards">
                     {patients.map((patient, index) => (
                        <div key={index} className="patient-card">
                           <div className="patient-header">
                              <h3>
                                 {patient.firstName} {patient.lastName}
                              </h3>
                              <div>
                                 <button
                                    onClick={() => deletePatient(index)}
                                    className="delete-button" >
                                    ×
                                 </button>
                              </div>
                           </div>
                           <div className="patient-details">
                              <p>
                                 <strong>Age:</strong> {patient.age}
                              </p>
                              <p>
                                 <strong>Date:</strong> {patient.date}
                              </p>
                              <p>
                                 <strong>Symptoms:</strong> {patient.symptoms}
                              </p>
                           </div>
                        </div>
                     ))}
                  </div>
               )}
            </div>
         </section>

      </div>
   );
}

export default Record;