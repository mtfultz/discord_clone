/* ---------- index.js (backend entry) ---------- */
require('dotenv').config();
console.log('DB vars:', process.env.DB_USER, process.env.DB_DATABASE);

const express  = require('express');
const cors     = require('cors');
const http     = require('http');
const socket   = require('./socket');        // ← NEW

/* REST routers */
const serverRoutes  = require('./routes/servers');
const channelRoutes = require('./routes/channels');
const messageRoutes = require('./routes/messages');

const app = express();
app.use(cors());
app.use(express.json());

/* REST endpoints */
app.use('/', serverRoutes);
app.use('/', channelRoutes);
app.use('/', messageRoutes);

app.get('/', (_, res) => res.send('Discord backend running!'));

/* Create HTTP server & attach Socket.IO */
const httpServer = http.createServer(app);
socket.init(httpServer);                     // ← initialise once here

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () =>
  console.log(`API + WebSocket listening on http://localhost:${PORT}`)
);

process.on('unhandledRejection', err => console.error(err));
/* -------------- end index.js -------------- */
