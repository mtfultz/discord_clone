// routes/messages.js
const express = require('express');
const router  = express.Router();
const {
  getMessagesForChannel,
  createMessage,
  getThread
} = require('../controllers/messages');

// list / create messages
router.get('/channels/:channelId/messages',  getMessagesForChannel);
router.post('/channels/:channelId/messages', createMessage);

// recursive thread
router.get('/messages/:messageId/thread',    getThread);

module.exports = router;
