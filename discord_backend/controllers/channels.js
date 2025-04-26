// controllers/channels.js
const pool = require('../db/db');

/* GET /servers/:serverId/channels */
const getChannelsForServer = async (req, res) => {
  try {
    const { serverId } = req.params;
    const result = await pool.query(
      `SELECT channel_id, name
         FROM channels
        WHERE server_id = $1
        ORDER BY channel_id`,
      [serverId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Channel GET error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

/* POST /servers/:serverId/channels  { name } */
const createChannel = async (req, res) => {
  try {
    const { serverId } = req.params;
    const { name } = req.body;
    const result = await pool.query(
      `INSERT INTO channels (server_id, name)
       VALUES ($1, $2)
       RETURNING *`,
      [serverId, name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Channel POST error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getChannelsForServer, createChannel };
