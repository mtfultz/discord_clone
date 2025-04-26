// controllers/messages.js
const pool = require('../db/db');

/* 1 ― list messages in a channel */
const getMessagesForChannel = async (req, res) => {
  try {
    const { channelId } = req.params;
    const result = await pool.query(
      `SELECT m.message_id,
              m.content,
              m.timestamp,
              m.author_id,
              u.username,
              m.parent_message_id
         FROM messages m
         JOIN users u ON u.user_id = m.author_id
        WHERE m.channel_id = $1
        ORDER BY m.timestamp`,
      [channelId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('MSG GET error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* 2 ― create a (top-level or reply) message */
const createMessage = async (req, res) => {
  try {
    const { channelId }   = req.params;
    const { content, author_id, parent_message_id } = req.body;

    const result = await pool.query(
      `INSERT INTO messages (content, author_id, channel_id, parent_message_id)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [content, author_id, channelId, parent_message_id || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('MSG POST error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* 3 ― recursive thread fetch */
const getThread = async (req, res) => {
  try {
    const { messageId } = req.params;

    const result = await pool.query(
      `WITH RECURSIVE thread AS (
           SELECT m.*,
                  u.username
             FROM messages m
             JOIN users u ON u.user_id = m.author_id
            WHERE m.message_id = $1         -- anchor (root)
          UNION ALL
           SELECT child.*, u2.username
             FROM messages child
             JOIN thread parent ON child.parent_message_id = parent.message_id
             JOIN users u2 ON u2.user_id = child.author_id
        )
        SELECT * FROM thread
        ORDER BY timestamp;`,
      [messageId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('THREAD error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getMessagesForChannel, createMessage, getThread };
