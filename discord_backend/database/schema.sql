-- database/schema.sql
CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password_hash TEXT NOT NULL
);

CREATE TABLE servers (
  server_id SERIAL PRIMARY KEY,
  owner_id  INT REFERENCES users(user_id) ON DELETE CASCADE,
  name      VARCHAR(100) NOT NULL
);

CREATE TABLE channels (
  channel_id SERIAL PRIMARY KEY,
  server_id  INT REFERENCES servers(server_id) ON DELETE CASCADE,
  name       VARCHAR(100) NOT NULL
);

CREATE TABLE server_membership (
  user_id   INT REFERENCES users(user_id) ON DELETE CASCADE,
  server_id INT REFERENCES servers(server_id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, server_id)
);

CREATE TABLE messages (
  message_id SERIAL PRIMARY KEY,
  content    TEXT NOT NULL,
  timestamp  TIMESTAMP DEFAULT NOW(),
  author_id  INT REFERENCES users(user_id) ON DELETE CASCADE,
  channel_id INT REFERENCES channels(channel_id) ON DELETE CASCADE,
  parent_message_id INT REFERENCES messages(message_id) ON DELETE CASCADE
);
