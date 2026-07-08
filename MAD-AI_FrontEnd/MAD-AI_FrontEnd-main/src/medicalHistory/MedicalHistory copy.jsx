import React, { useState } from 'react';
import './MedicalHistoryStyle.css';
import Navbar from '../components/layout/Navbar';

function MedicalHistory () {
 const [id, setId ] = useState('');
 const [title, setTitle] = useState('');
 const [description , setDescription] = useState('');
 const [file, setFile] = useState('');
 const [entries, setEntries] = useState([]);
 const [nextId, setNextId] = useState(1);

 const mockData = [
  {
   "id": 1,
   "name": "Hjertelage Christian Lange",
   "address": "Store Kongensgade 36, 4. th, 1264 København, Denmark",
   "latitude": 55.68267,
   "longitude": 12.586405,
   "placeId": "ChID52Mh1F7UkVRq9b9yHMkgx6c",
   "phoneNumber": "33 15 14 19",
   "website": "http://www.hjerteklinikkemamallegade.dk/",
   "rating": 4.7
  },
  {
   "id": 2,
   "name": "Cardiolab Speciallageklinik",
   "address": "Thuring? 24, 2000 Frederiksberg, Denmark",
   "latitude": 55.6829054,
   "longitude": 12.5268884,
   "placeId": "ChID51T0KG5UkVvR2q6dyUdh-c",
   "phoneNumber": "33 13 63 82",
   "website": "http://www.cardiolab.dk/",
   "rating": 5
  }
 ];

 const handleAdd = () => {
  if (id.trim() && title.trim() && description.trim()&& file.trim()) {
   const newEntry = {
    id: nextId,
    name: id,
    location: description,
    specialty: `Specialty ${nextId}`,
    title: title,
    description: description,
    file: file,
    rating: (Math.random() * 5).toFixed(1), 
    phone: `555-${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}` 
   };

   setEntries([...entries, newEntry]);
   setTitle('');
   setDescription('');
   setFile('');
   setNextId(nextId + 1);
  }
 };

 return (
  <section>
    <Navbar/>
    <div className='form-container'>
      <h1>Medical History</h1>
      <div className='former-group'>
    <div className="form-group">
     <div>
      <label>Patient Id:</label>
     </div>
     <div>
      <input
       value={id}
       onChange={(e) => setId(e.target.value)}
       type="text"
       name="id"
       placeholder="Patient Id"
      />
     </div>
    </div>

    <div className="form-group">
     <div>
      <label>Title:</label>
     </div>
     <div>
      <input
       value={title}
       onChange={(e) => setTitle(e.target.value)}
       type="text"
       name="id"
       placeholder="Title"
      />
     </div>
    </div>

    <div className="form-group">
     <div>
      <label>Description:</label>
     </div>
     <div>
      <input
       value={description}
       onChange={(e) => setDescription(e.target.value)}
       type="text"
       name="id"
       placeholder="Description"
      />
     </div>
    </div>

    <div className="form-group">
     <div>
      <label>File:</label>
     </div>
     <div>
      <input
       value={file}
       onChange={(e) => setFile(e.target.value)}
       type="text"
       name="id"
       placeholder="File"
      />
     </div>
    </div>

    <button
     onClick={handleAdd}
     id='add-button'
    >
     Add
    </button>
   </div>

   <div>
    {entries.length === 0 ? (
     <p>No entries yet. Add some using the form above.</p>
    ) : (
     <div style={{ display: 'grid', gap: '15px', display: 'grid', gap: '10px', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
      {entries.map((entry) => (
       <div style={{ display: 'flex', flexDirection: 'column', background: 'white', padding: '15px', borderRadius: '10px',}} key={entry.id}
       >
        <p><strong>Name:</strong> {entry.name}</p>
        <p><strong>Patient ID:</strong> {entry.id}</p>
        <p><strong>Location:</strong> {entry.location}</p>
        <p><strong>Specialty:</strong> {entry.specialty}</p>
        <p><strong>Rating:</strong> {entry.rating} ⭐</p>
        <p><strong>Phone:</strong> {entry.phone}</p>
        <p><strong>File:</strong> {entry.file}</p>
       </div>
      ))}
     </div>
    )}
   </div>
   </div>
  </section>
 );
}

export default MedicalHistory;