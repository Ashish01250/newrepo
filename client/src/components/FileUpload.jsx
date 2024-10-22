import React, { useState } from 'react';

function FileUpload() {
    const [files, setFiles] = useState([]);
    const [isDragging, setIsDragging] = useState(false);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const styles = {
        container: {
            maxWidth: '600px',
            margin: '20px auto',
            padding: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
        },
        title: {
            fontSize: '24px',
            marginBottom: '20px',
            color: '#333'
        },
        dropZone: {
            border: '2px dashed #ccc',
            borderRadius: '4px',
            padding: '20px',
            textAlign: 'center',
            cursor: 'pointer',
            marginBottom: '20px',
            transition: 'border 0.3s ease',
            backgroundColor: isDragging ? '#e3f2fd' : 'transparent',
            borderColor: isDragging ? '#2196f3' : '#ccc'
        },
        uploadIcon: {
            fontSize: '32px',
            marginBottom: '10px',
            color: '#666'
        },
        browseText: {
            color: '#2196f3',
            cursor: 'pointer',
            margin: '0 5px'
        },
        fileInput: {
            display: 'none'
        },
        fileList: {
            marginTop: '20px'
        },
        fileItem: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '10px',
            backgroundColor: '#f5f5f5',
            borderRadius: '4px',
            marginBottom: '8px'
        },
        fileInfo: {
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
        },
        fileName: {
            fontSize: '14px',
            color: '#333'
        },
        fileSize: {
            fontSize: '12px',
            color: '#666'
        },
        removeButton: {
            background: 'none',
            border: 'none',
            color: '#ff5252',
            cursor: 'pointer',
            fontSize: '18px',
            padding: '4px 8px'
        },
        uploadButton: {
            width: '100%',
            padding: '10px',
            backgroundColor: isUploading ? '#999' : '#2196f3',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: isUploading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            marginTop: '10px'
        },
        helperText: {
            fontSize: '12px',
            color: '#666',
            marginTop: '5px'
        },
        statusMessage: {
            padding: '10px',
            borderRadius: '4px',
            marginTop: '10px',
            textAlign: 'center',
            backgroundColor: uploadStatus === 'success' ? '#e8f5e9' : '#ffebee',
            color: uploadStatus === 'success' ? '#2e7d32' : '#c62828',
            display: uploadStatus ? 'block' : 'none'
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const newFiles = Array.from(e.dataTransfer.files);
        setFiles(prev => [...prev, ...newFiles]);
        setUploadStatus('');
    };

    const handleFileSelect = (e) => {
        const newFiles = Array.from(e.target.files);
        setFiles(prev => [...prev, ...newFiles]);
        setUploadStatus('');
    };

    const removeFile = (indexToRemove) => {
        setFiles(files.filter((_, index) => index !== indexToRemove));
        setUploadStatus('');
    };

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleUpload = async () => {
        if (files.length === 0) return;
        
        setIsUploading(true);
        setUploadStatus('');

        try {
            const formData = new FormData();
            files.forEach((file) => {
                formData.append('files', file); // 'files' should match your server's expected field name
            });

            const response = await fetch('http://localhost:5000/upload', {  // Update with your server URL
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed with status: ${response.status}`);
            }

            const result = await response.json();
            console.log('Upload successful:', result);
            setUploadStatus('success');
            setFiles([]); // Clear files after successful upload
        } catch (error) {
            console.error('Upload error:', error);
            setUploadStatus('error');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Upload Files</h2>
            
            <div
                style={styles.dropZone}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
            >
                <div style={styles.uploadIcon}>⬆️</div>
                <p>
                    Drag and drop your files here, or
                    <label style={styles.browseText}>
                        browse
                        <input
                            type="file"
                            multiple
                            style={styles.fileInput}
                            onChange={handleFileSelect}
                        />
                    </label>
                </p>
                <span style={styles.helperText}>Support for multiple files</span>
            </div>

            {uploadStatus && (
                <div style={styles.statusMessage}>
                    {uploadStatus === 'success' 
                        ? '✅ Files uploaded successfully!' 
                        : '❌ Upload failed. Please try again.'}
                </div>
            )}

            {files.length > 0 && (
                <div style={styles.fileList}>
                    {files.map((file, index) => (
                        <div key={index} style={styles.fileItem}>
                            <div style={styles.fileInfo}>
                                <span>📄</span>
                                <div>
                                    <div style={styles.fileName}>{file.name}</div>
                                    <div style={styles.fileSize}>
                                        {formatFileSize(file.size)}
                                    </div>
                                </div>
                            </div>
                            <button
                                style={styles.removeButton}
                                onClick={() => removeFile(index)}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    
                    <button 
                        style={styles.uploadButton}
                        onClick={handleUpload}
                        disabled={isUploading}
                    >
                        {isUploading 
                            ? 'Uploading...' 
                            : `Upload ${files.length} file${files.length !== 1 ? 's' : ''}`}
                    </button>
                </div>
            )}
        </div>
    );
}

export default FileUpload;