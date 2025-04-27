/* ---------- index.js (backend entry) ---------- */
require('dotenv').config();             // load .env first
console.log('DB vars:', process.env.DB_USER, process.env.DB_DATABASE);

const express  = require('express');
const cors     = require('cors');
const http     = require('http');
const { Server } = require('socket.io');

/* REST route modules */
const serverRoutes  = require('./routes/servers');
const channelRoutes = require('./routes/channels');
const messageRoutes = require('./routes/messages'); // <-- now points to routes/

/* Express setup */
const app = express();
app.use(cors());
app.use(express.json());

/* Mount REST routers */
app.use('/', serverRoutes);
app.use('/', channelRoutes);
app.use('/', messageRoutes);

/* Simple health check */
app.get('/', (_, res) => res.send('Discord backend running!'));

/* ---------- Socket.IO wiring ---------- */
const httpServer = http.createServer(app);

const io = new Server(httpServer, {
  cors: { origin: '*' }                 // dev: allow any origin
});

io.on('connection', socket => {
  console.log('⚡ WS connected', socket.id);

  socket.on('channel:join', channelId => {
    socket.join(`channel_${channelId}`);
    console.log(`${socket.id} joined channel_${channelId}`);
  });

  socket.on('channel:leave', channelId => {
    socket.leave(`channel_${channelId}`);
  });

  socket.on('disconnect', () => {
    console.log('WS disconnected', socket.id);
  });
});

/* Export the io instance so controllers can emit */
module.exports = io;

/* Start HTTP + WS server */
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () =>
  console.log(`API + WebSocket listening on http://localhost:${PORT}`)
);

/* Optional global error logger */
process.on('unhandledRejection', err => console.error(err));
/* ---------- end index.js ---------- */
