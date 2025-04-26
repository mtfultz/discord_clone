// controllers/servers.js
const pool = require('../db/db');

/**
 * GET /users/:userId/servers
 * Return all servers a user belongs to.
 */
const getServersForUser = async (req, res) => {
  console.time('serversQuery');
  const result = await pool.query(
    `SELECT s.server_id, s.name
       FROM servers s
       JOIN server_membership sm ON sm.server_id = s.server_id
      WHERE sm.user_id = $1`,
    [req.params.userId]
  );
  console.timeEnd('serversQuery');
  res.json(result.rows);
};

/**
 * POST /servers
 * Body: { "name": "...", "owner_id": <int> }
 * Creates a server and automatically adds the owner to membership.
 */
const createServer = async (req, res) => {
  try {
    const { name, owner_id } = req.body;

    const newServer = await pool.query(
      `INSERT INTO servers (name, owner_id)
       VALUES ($1, $2)
       RETURNING *`,
      [name, owner_id]
    );

    await pool.query(
      `INSERT INTO server_membership (user_id, server_id)
       VALUES ($1, $2)
       ON CONFLICT DO NOTHING`,
      [owner_id, newServer.rows[0].server_id]
    );

    res.status(201).json(newServer.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { getServersForUser, createServer };
