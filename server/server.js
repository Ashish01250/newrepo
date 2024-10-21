const express = require("express");
const multer = require("multer");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
  })
);

const fs = require("fs");

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
  console.log("Uploads folder created");
} else {
  console.log("Uploads folder already exists");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .send({ success: false, message: "No file uploaded" });
  }
  res.send({
    success: true,
    message: "File uploaded successfully",
    file: req.file,
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
