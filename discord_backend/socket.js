const { Server } = require('socket.io');

let io = null;

/**
 * Initialise Socket.IO once, passing the HTTP server.
 * Returns the created io instance.
 */
function init(httpServer) {
  if (io) return io;                 
  io = new Server(httpServer, {
    cors: { origin: '*' }             
  });

  io.on('connection', socket => {
    console.log('⚡ WebSocket connected', socket.id);

    socket.on('channel:join', id => {
      socket.join(`channel_${id}`);
      console.log(`${socket.id} joined channel_${id}`);
    });

    socket.on('channel:leave', id => socket.leave(`channel_${id}`));

    socket.on('disconnect', () =>
      console.log('WS disconnected', socket.id)
    );
  });

  return io;
}

function getIO() {
  if (!io) throw new Error('Socket.io not initialised');
  return io;
}

module.exports = { init, getIO };
