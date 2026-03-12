import pool from '../database/db.js';
import { generateToken } from '../utils/tokenGenerator.js';

// Create a new chat room
export const createRoom = async (req, res) => {
  try {
    const token = generateToken();
    res.status(201).json({ token });
  } catch (error) {
    console.error('Error creating room:', error);
    res.status(500).json({ error: 'Failed to create room' });
  }
};

// Join a chat room
export const joinRoom = async (req, res) => {
  const { token, username } = req.body;
  if (!token || !username) {
    return res.status(400).json({ error: 'Token and username are required' });
  }
  
  try {
    // Check if any messages exist for this token, if not it might be a new room or empty room. 
    // We just accept the join since tokens are loosely validated.
    // In a more strict setup, we'd have a 'rooms' table. But architecture says tokens just group messages.
    res.status(200).json({ message: 'Joined room successfully' });
  } catch (error) {
    console.error('Error joining room:', error);
    res.status(500).json({ error: 'Failed to join room' });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  const { token, username, message } = req.body;
  
  if (!token || !username || !message) {
    return res.status(400).json({ error: 'Token, username, and message are required' });
  }

  try {
    const newMsg = await pool.query(
      'INSERT INTO messages (token, username, message) VALUES ($1, $2, $3) RETURNING *',
      [token, username, message]
    );
    res.status(201).json(newMsg.rows[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

// Fetch messages
export const getMessages = async (req, res) => {
  const { token } = req.params;
  
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    const messages = await pool.query(
      'SELECT id, token, username, message, time FROM messages WHERE token = $1 ORDER BY time ASC',
      [token]
    );
    res.status(200).json(messages.rows);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Delete chat room and messages
export const deleteRoom = async (req, res) => {
  const { token } = req.params;
  
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    await pool.query('DELETE FROM messages WHERE token = $1', [token]);
    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
};
