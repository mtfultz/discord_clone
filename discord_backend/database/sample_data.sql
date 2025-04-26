INSERT INTO users (username,email,password_hash) VALUES
('alice','alice@example.com','hash1'),
('bob','bob@example.com','hash2'),
('charlie','charlie@example.com','hash3');

INSERT INTO servers (name,owner_id) VALUES
('Gaming Club',1);

INSERT INTO server_membership (user_id,server_id) VALUES
(1,1),(2,1),(3,1);

INSERT INTO channels (server_id,name) VALUES
(1,'general'),(1,'off-topic');

INSERT INTO messages (content,author_id,channel_id,parent_message_id) VALUES
('Welcome to Gaming Club!',1,1,NULL),
('Thanks Alice!',2,1,1),
('Let’s play tonight',3,1,NULL);
