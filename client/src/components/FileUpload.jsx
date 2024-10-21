import React, { useState } from 'react';
import axios from 'axios';

const FileUpload = () => {
    const [singleFile, setSingleFile] = useState(null);
    const [multipleFiles, setMultipleFiles] = useState([]);
  
    // Handle single file change
    const handleSingleFileChange = (e) => {
      setSingleFile(e.target.files[0]);
    };
  
    // Handle multiple files change
    const handleMultipleFilesChange = (e) => {
      setMultipleFiles(e.target.files);
    };
  
    // Upload single file
    const uploadSingleFile = async (e) => {
      e.preventDefault();
      if (!singleFile) return alert("Please select a file to upload.");
  
      const formData = new FormData();
      formData.append('file', singleFile);
  
      try {
        const res = await axios.post('http://localhost:3000/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log(res.data);
        alert('File uploaded successfully');
      } catch (err) {
        console.error(err);
        alert('File upload failed');
      }
    };
  
    // Upload multiple files
    const uploadMultipleFiles = async (e) => {
      e.preventDefault();
      if (multipleFiles.length === 0) return alert("Please select files to upload.");
  
      const formData = new FormData();
      for (let i = 0; i < multipleFiles.length; i++) {
        formData.append('files', multipleFiles[i]);
      }
  
      try {
        const res = await axios.post('http://localhost:3000/uploads', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        console.log(res.data);
        alert('Files uploaded successfully');
      } catch (err) {
        console.error(err);
        alert('Files upload failed');
      }
    };
  
    return (
      <div className="container mx-auto p-4">
        {/* Single File Upload */}
        <h1 className="text-2xl font-bold mb-4">Upload a Single File</h1>
        <form onSubmit={uploadSingleFile} className="mb-6">
          <input
            type="file"
            onChange={handleSingleFileChange}
            className="border border-gray-300 p-2 mb-2"
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">Upload Single File</button>
        </form>
  
        {/* Multiple Files Upload */}
        <h1 className="text-2xl font-bold mb-4">Upload Multiple Files</h1>
        <form onSubmit={uploadMultipleFiles}>
          <input
            type="file"
            onChange={handleMultipleFilesChange}
            multiple
            className="border border-gray-300 p-2 mb-2"
          />
          <button type="submit" className="bg-green-500 text-white p-2 rounded">Upload Multiple Files</button>
        </form>
      </div>
    );
}

export default FileUpload
