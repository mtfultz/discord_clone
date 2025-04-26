// index.js  (entry point)
require('dotenv').config();        // load env first
console.log('DB vars:', process.env.DB_USER,
                           process.env.DB_DATABASE,
                           process.env.DB_PASSWORD ? '(pw set)' : '(no pw)');

const messageRoutes = require('./routes/messages');
const channelRoutes = require('./routes/channels');
const serverRoutes = require('./routes/servers');
const express = require('express');
const cors    = require('cors');
const pool    = require('./db/db'); // keeps pool alive

console.log('Loaded index.js from', __dirname);

const app = express();

app.use(cors());
app.use(express.json());
app.use('/', messageRoutes); 
app.use('/', channelRoutes);
app.use('/', serverRoutes);         // mount the routes

app.get('/', (_, res) => res.send('Discord backend running!'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`API listening on http://localhost:${PORT}`)
);

// optional: simple global error logging
process.on('unhandledRejection', err => console.error(err));
