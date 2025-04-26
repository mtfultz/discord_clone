// routes/channels.js
const express = require('express');
const router  = express.Router();
const {
  getChannelsForServer,
  createChannel
} = require('../controllers/channels');

// e.g. GET  /servers/1/channels
router.get('/servers/:serverId/channels',  getChannelsForServer);

// e.g. POST /servers/1/channels   { "name": "strategy" }
router.post('/servers/:serverId/channels', createChannel);

module.exports = router;
