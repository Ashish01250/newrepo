const express = require('express')
const multer = require('multer');
const path = require('path');
const cors = require('cors');

const app = express()
const port = 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})