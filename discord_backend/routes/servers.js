// routes/servers.js
const express = require('express');
const router  = express.Router();
const {
  getServersForUser,
  createServer
} = require('../controllers/servers');

// e.g. GET /users/1/servers
router.get('/users/:userId/servers', getServersForUser);

// e.g. POST /servers  { name, owner_id }
router.post('/servers', createServer);

module.exports = router;
