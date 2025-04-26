const express = require('express');
const cors = require('cors');
const pool = require('./db/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // allows parsing JSON bodies

// Test route
app.get('/', (req, res) => {
  res.send('Discord backend running!');
});

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});