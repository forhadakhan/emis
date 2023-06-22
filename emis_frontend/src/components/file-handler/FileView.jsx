import React, { useEffect, useState } from 'react';
import axios from 'axios';
import API_BASE_URL from '../../config';


const FileView = ({file_url}) => {
  const [fileUrl, setFileUrl] = useState(file_url);

  useEffect(() => {
    // Fetch file URL from the backend
    const fetchFileUrl = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/file/url`);
        setFileUrl(response.data.fileUrl);
      } catch (error) {
        console.error('Error fetching file URL:', error);
        // Handle the error
      }
    };

    fetchFileUrl();
  }, []);

  return (
    <div>
      {fileUrl ? (
        <div>
          <h2>File View</h2>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            View File
          </a>
        </div>
      ) : (
        <p>Loading file...</p>
      )}
    </div>
  );
};

export default FileView;
