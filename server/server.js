// Import required modules
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

// Initialize the app
const app = express();

app.use(cors({
    origin: 'http://localhost:3001'  // Allow requests from your React app
  }));
// Define a storage strategy using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Define the upload folder
    cb(null, './uploads');
  },
  filename: (req, file, cb) => {
    // Create a unique file name
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Create the multer upload middleware with storage settings
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
  fileFilter: (req, file, cb) => {
    // Accept only certain file types (e.g., images)
    const fileTypes = /jpeg|jpg|png|gif/;
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);

    if (extname && mimeType) {
      return cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  }
});

// Serve the uploads folder statically
app.use('/uploads', express.static('uploads'));

// Route to upload a single file
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded');
  }
  res.send({
    message: 'File uploaded successfully',
    file: req.file
  });
});

// Route to upload multiple files (e.g., 3 files)
app.post('/uploads', upload.array('files', 3), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded');
  }
  res.send({
    message: 'Files uploaded successfully',
    files: req.files
  });
});

// Error handling middleware for multer
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // A Multer error occurred when uploading.
    res.status(500).send({ error: err.message });
  } else if (err) {
    // An unknown error occurred when uploading.
    res.status(500).send({ error: err.message });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
