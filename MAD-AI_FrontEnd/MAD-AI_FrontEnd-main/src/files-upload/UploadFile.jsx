import { Link } from 'react-router';
import React from 'react';
import '../files-upload/UploadFileStyle.css';

const UploadFile = () => {
  return (
    <div>

      <section>
        <Link id='a-tag' to="/">{'< Back'}</Link>
        <div className='main-upload-div'>
          <div className='upload-file'>
            <i className="ri-upload-cloud-fill"></i>
            <h1>Browse Files To Upload</h1>
          </div>
          <button id='send-button'>Send</button>
        </div>
      </section>

    </div>
  )
}

export default UploadFile
