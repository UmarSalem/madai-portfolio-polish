import React from 'react';
import '../files-upload/UploadFileStyle.css';

const UploadFile = () => {
  return (
    <div>

      <section>
        <a id='a-tag' href="#">{'< Back'}</a>
        <div className='main-upload-div'>
          <div className='upload-file'>
            <i class="ri-upload-cloud-fill"></i>
            <h1>Browse Files To Upload</h1>
          </div>
          <button id='send-button'>Send</button>
        </div>
      </section>

    </div>
  )
}

export default UploadFile