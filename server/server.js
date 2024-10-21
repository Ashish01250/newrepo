const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();

// Enable CORS
app.use(cors({
  origin: 'http://localhost:3001'  // React frontend URL
}));

const fs = require('fs');

// Automatically create the uploads folder if it doesn't exist
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
  console.log('Uploads folder created');
} else {
  console.log('Uploads folder already exists');
}

// Set up storage for multer
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Ensure this folder exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname); // Give the file a unique name
  }
});

const upload = multer({ storage: storage });

// Single file upload route
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ success: false, message: 'No file uploaded' });
  }
  res.send({ success: true, message: 'File uploaded successfully', file: req.file });
});

// Multiple files upload route
app.post('/uploads', upload.array('files', 10), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send({ success: false, message: 'No files uploaded' });
  }
  res.send({ success: true, message: 'Files uploaded successfully', files: req.files });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
