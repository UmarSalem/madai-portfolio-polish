import React, { useEffect, useState, useRef } from 'react';
import './AIDoctorStyle.css';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTE } from '../routes/ReactLinks';
import { LuLogIn } from "react-icons/lu";
import { MdLogout } from "react-icons/md";
import Navbar from '../components/layout/Navbar';
import { Config } from '../constant';
import axios from 'axios';

const AIDoctor = () => {
   const [patientId, setPatientId] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [entries, setEntries] = useState([]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

useEffect(() => {
  const storedUser = JSON.parse(localStorage.getItem(Config.userApiTokenName));
  const userId = storedUser?.id;

  if (!userId) {
    alert('User not found in local storage.');
    return;
  }

  const fetchMedicalHistory = async () => {
    try {
      const response = await axios.get(`${Config.serverUrl}/medical_report?userId=${userId}`);
      setEntries(response.data);
    } catch (error) {
      console.error('Failed to fetch medical history:', error);
      alert('Unable to fetch medical history.');
    }
  };

  fetchMedicalHistory();
}, []);
 const handleAdd = async () => {
    if ( !title || !description || !file) {
      alert('Please fill in all fields.');
      return;
    }
 const storedUser = JSON.parse(localStorage.getItem(Config.userApiTokenName));
  const userId = storedUser?.id;

  if (!userId) {
    alert('User not found in local storage.');
    return;
  }
    // Convert file to base64 for storage in db.json
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const base64File = reader.result;

      try {
        const response = await axios.post( `${Config.serverUrl}/medical_report`, {
       
          userId,
          title,
          description,
          fileName: file.name,
          fileData: base64File,
          createdAt: new Date().toISOString()
        });

        alert('Medical Report uploaded successfully.');
        setEntries([...entries, response.data]);
        // Reset form
        setPatientId('');
        setTitle('');
        setDescription('');
        setFile(null);
      } catch (error) {
        console.error(error);
        alert('Upload failed.');
      }
    };
    reader.onerror = (error) => {
      console.error('Error converting file:', error);
      alert('File conversion failed.');
    };
  };

  const handleDelete = async (id) => {
  const confirmDelete = window.confirm('Are you sure you want to delete this entry?');
  if (!confirmDelete) return;

  try {
    await axios.delete(`${Config.serverUrl}/medical_report/${id}`);
    setEntries(entries.filter((entry) => entry.id !== id));
    alert('Entry deleted successfully.');
  } catch (error) {
    console.error('Failed to delete entry:', error);
    alert('Failed to delete entry.');
  }
};


  return (
    <section>
      <Navbar />
      <div className='form-container'>
  {/* <h1>Only For Admin</h1> */}
  <h1> Upload Medical Report</h1>

  <div className="form-and-table-wrapper">
    {/* Form Section */}
    <div className='former-group'>
      

        <label style={{ fontWeight: 'bold' }}>Title:</label>
      <div className="form-group">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          placeholder="Enter Title"
        />
      </div>

        <label style={{ fontWeight: 'bold' }}>Description:</label>
      <div className="form-group">
        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          type="text"
          placeholder="Enter Description"
        />
      </div>

        <label style={{ fontWeight: 'bold' }}>Upload File (PDF):</label>
      <div className="form-group">
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
        />
      </div>

      <button onClick={handleAdd} id='add-button'>
        Submit
      </button>
    </div>

    {/* Table Section */}
    <div className="table-section">
      {entries.length === 0 ? (
        <p>No records yet.</p>
      ) : (
        <table className="doctor-table">
          <thead>
            <tr>
            
              <th>Id</th>
              <th>Title</th>
              <th>Description</th>
              <th>createdAt</th>
              <th>File</th>
               <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((entry, index) => (
              <tr key={index}>
               
                <td>{entry.id}</td>
                <td>{entry.title}</td>
                <td>{entry.description}</td>
                <td>{entry.createdAt}</td>
                <td>
                  <a
                    href={entry.fileData}
                    download={entry.fileName}
                    className="download-btn"
                  >
                    Download File
                  </a>
                </td>
                  <td>
        <button onClick={() => handleDelete(entry.id)} className="delete-btn">
          Delete
        </button>
      </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
</div>

    </section>
  );
}

export default AIDoctor;