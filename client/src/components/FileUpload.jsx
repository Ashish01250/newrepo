import React, { useState } from "react";
import axios from "axios";

const FileUpload = () => {
  const [singleFile, setSingleFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleSingleFileChange = (e) => {
    const file = e.target.files[0];
    setSingleFile(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  // Upload single file
  const uploadSingleFile = async (e) => {
    e.preventDefault();
    if (!singleFile) return alert("Please select a file to upload.");

    const formData = new FormData();
    formData.append("file", singleFile);

    try {
      const res = await axios.post("http://localhost:3000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(res.data);
      alert("File uploaded successfully");
    } catch (err) {
      console.error(err);
      alert("File upload failed");
    }
  };

  return (
    <div className="container mx-auto p-4 border-solid border-2 my-28 flex flex-col items-center justify-center">
      {/* Single File Upload */}
      <h1 className="text-2xl font-bold mb-4">Upload a Single File</h1>
      <form onSubmit={uploadSingleFile} className="mb-6">
        <input
          type="file"
          accept="image/*"
          onChange={handleSingleFileChange}
          className="border border-gray-300 p-2 mb-2"
        />
        {imagePreview && (
          <div className="mb-4">
            <h2 className="text-lg font-semibold">Image Preview:</h2>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-64 h-64 object-contain mt-2"
            />
          </div>
        )}
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Upload Single File
        </button>
      </form>
    </div>
  );
};

export default FileUpload;
