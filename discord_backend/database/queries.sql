/* CRUD QUERIES  */

/* 1. CREATE  – add a new user */
INSERT INTO users (username, email, password_hash)
VALUES ('dave', 'dave@example.com', 'hashedpassword4');


/* 2. Create  – create a new server and auto-add the owner */
/*    (owner_id = 4 is the user that was just inserted) */
WITH new_server AS (
    INSERT INTO servers (name, owner_id)
    VALUES ('Study Group', 4)
    RETURNING server_id
)
INSERT INTO server_membership (user_id, server_id)
SELECT 4, server_id FROM new_server;


/* 3. Read  – list all servers a user belongs to */
SELECT s.server_id, s.name
  FROM servers s
  JOIN server_membership sm ON sm.server_id = s.server_id
 WHERE sm.user_id = 1;                 -- change user_id as needed


/* 4. Read – fetch messages in a channel with author names */
SELECT m.message_id,
       u.username  AS author,
       m.content,
       m.timestamp,
       m.parent_message_id
  FROM messages m
  JOIN users u ON u.user_id = m.author_id
 WHERE m.channel_id = 1
 ORDER BY m.timestamp;


/* 5. Update  – rename a channel */
UPDATE channels
   SET name = 'strategy'
 WHERE channel_id = 2;                 -- put the actual channel_id


/* 6. Delete  – remove all messages older than 30 days */
DELETE FROM messages
 WHERE timestamp < NOW() - INTERVAL '30 days';



/* Advanced Queries   ( 2  total) */

/* 7. Recursive CTE – get an entire reply thread                     */
/*    Pass the root message_id; query returns root + every descendant */
WITH RECURSIVE thread AS (
    SELECT m.*, u.username
      FROM messages m
      JOIN users u ON u.user_id = m.author_id
     WHERE m.message_id = 1            -- root message_id here
  UNION ALL
    SELECT child.*, u2.username
      FROM messages child
      JOIN thread parent ON child.parent_message_id = parent.message_id
      JOIN users  u2     ON u2.user_id = child.author_id
)
SELECT * FROM thread
ORDER BY timestamp;


/* 8. Aggregate – message count per channel (most active first)      */
SELECT c.channel_id,
       c.name          AS channel_name,
       s.name          AS server_name,
       COUNT(m.message_id) AS total_messages
  FROM channels c
  JOIN servers  s ON s.server_id = c.server_id
  LEFT JOIN messages m ON m.channel_id = c.channel_id
GROUP BY c.channel_id, c.name, s.name
ORDER BY total_messages DESC;
