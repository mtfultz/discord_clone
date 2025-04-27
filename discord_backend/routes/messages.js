/* ---------- routes/messages.js ---------- */
const express = require('express');
const router  = express.Router();

const {
  getMessagesForChannel,
  createMessage,
  getThread
} = require('../controllers/messages');

console.log({
  getMessagesForChannel,
  createMessage,
  getThread
});
/* ----------------------------------------
   GET  /channels/:channelId/messages
   - list all messages in the given channel
----------------------------------------- */
router.get('/channels/:channelId/messages', getMessagesForChannel);

/* ----------------------------------------
   POST /channels/:channelId/messages
   - create a new message (top-level or reply)
   body JSON: { content, author_id, parent_message_id? }
----------------------------------------- */
router.post('/channels/:channelId/messages', createMessage);

/* ----------------------------------------
   GET /messages/:messageId/thread
   - fetch root + all replies using recursive CTE
----------------------------------------- */
router.get('/messages/:messageId/thread', getThread);

module.exports = router;
/* -------- end routes/messages.js -------- */
