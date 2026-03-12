-- Messages table for storing chat history
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  token VARCHAR(10) NOT NULL,
  username VARCHAR(50) NOT NULL,
  message TEXT NOT NULL,
  time TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Rooms table to track type (private vs group)
CREATE TABLE IF NOT EXISTS rooms (
  token VARCHAR(10) PRIMARY KEY,
  type VARCHAR(20) DEFAULT 'group', -- 'private' or 'group'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Participants table to track active users and enforce limits
CREATE TABLE IF NOT EXISTS participants (
  id SERIAL PRIMARY KEY,
  token VARCHAR(10) REFERENCES rooms(token) ON DELETE CASCADE,
  username VARCHAR(50) NOT NULL,
  joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(token, username)
);

