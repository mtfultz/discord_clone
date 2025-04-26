const express = require('express');
const cors    = require('cors');
require('dotenv').config();
const serverRoutes = require('./routes/servers');
const pool = require('./db/db');   // keeps connection alive

const app = express();
app.use(cors());
app.use(express.json());

app.use('/', serverRoutes);        //  <–  add this line

app.get('/', (_, res) => res.send('Discord backend running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`API listening on http://localhost:${PORT}`)
);
