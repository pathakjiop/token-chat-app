import supabase from '../database/db.js';
import { generateToken } from '../utils/tokenGenerator.js';

// Create a new chat room
export const createRoom = async (req, res) => {
  const { type = 'group' } = req.body;
  try {
    const token = generateToken();
    
    // Create room entry
    const { error: roomError } = await supabase
      .from('rooms')
      .insert([{ token, type }]);

    if (roomError) {
      // If table doesn't exist, we fallback to just token generation for now
      // but ideally the user should create the table.
      console.warn('Rooms table might not exist. Falling back to legacy mode.');
    }

    res.status(201).json({ token, type });
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
    // Check if room exists and get its type
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .select('*')
      .eq('token', token)
      .single();

    if (roomError && roomError.code !== 'PGRST116') {
       // Table might not exist or other error
    }

    if (room) {
      // Check participants if it's a private room
      const { data: participants, error: pError } = await supabase
        .from('participants')
        .select('*')
        .eq('token', token);

      if (room.type === 'private' && participants && participants.length >= 2) {
        // Check if the user is already a participant
        const isAlreadyIn = participants.some(p => p.username === username);
        if (!isAlreadyIn) {
          return res.status(403).json({ error: 'This private chat is full (limit: 2 people).' });
        }
      }

      // Add participant if not already there
      const isAlreadyIn = participants?.some(p => p.username === username);
      if (!isAlreadyIn) {
        await supabase
          .from('participants')
          .insert([{ token, username }]);
        
        // Log integration event
        await supabase
          .from('messages')
          .insert([{ 
            token, 
            username: 'SYSTEM', 
            message: `${username} integrated into the matrix` 
          }]);
      }
    }

    res.status(200).json({ 
      message: 'Joined room successfully',
      roomType: room?.type || 'group'
    });
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
    const { data: newMsg, error } = await supabase
      .from('messages')
      .insert([{ token, username, message }])
      .select()
      .single();

    if (error) throw error;
      
    res.status(201).json(newMsg);
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
    const { data: messages, error } = await supabase
      .from('messages')
      .select('id, token, username, message, time')
      .eq('token', token)
      .order('time', { ascending: true });

    if (error) throw error;

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

// Leave room
export const leaveRoom = async (req, res) => {
    const { token, username } = req.body;
    if (!token || !username) {
        return res.status(400).json({ error: 'Token and username are required' });
    }

    try {
        const { error } = await supabase
            .from('participants')
            .delete()
            .eq('token', token)
            .eq('username', username);

        if (error) throw error;
        
        // Log severance event
        await supabase
          .from('messages')
          .insert([{ 
            token, 
            username: 'SYSTEM', 
            message: `${username} severed the link` 
          }]);

        // Count remaining participants
        const { count, error: countError } = await supabase
            .from('participants')
            .select('*', { count: 'exact', head: true })
            .eq('token', token);
        
        // If no one left, we could optionally delete the room/messages
        // But for now let's keep it simple or follow existing "wipe on exit" if it was intended.

        res.status(200).json({ message: 'Left room successfully' });
    } catch (error) {
        console.error('Error leaving room:', error);
        res.status(500).json({ error: 'Failed to leave room' });
    }
}

// Delete chat room and messages
export const deleteRoom = async (req, res) => {
  const { token } = req.params;
  
  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  try {
    // Delete messages
    await supabase
      .from('messages')
      .delete()
      .eq('token', token);

    // Delete participants
    await supabase
        .from('participants')
        .delete()
        .eq('token', token);

    // Delete room
    await supabase
        .from('rooms')
        .delete()
        .eq('token', token);

    res.status(200).json({ message: 'Room deleted successfully' });
  } catch (error) {
    console.error('Error deleting room:', error);
    res.status(500).json({ error: 'Failed to delete room' });
  }
};

