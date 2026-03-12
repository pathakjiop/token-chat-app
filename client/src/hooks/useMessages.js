import { useState, useEffect } from 'react';
import { getMessages } from '../services/api';

const useMessages = (token) => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token) return;

    const fetchMessages = async () => {
      try {
        const data = await getMessages(token);
        setMessages(data);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
        setError('Connection lost. Reconnecting...');
      }
    };

    // Initial fetch
    fetchMessages();

    // Polling every 3 seconds
    const interval = setInterval(fetchMessages, 3000);

    return () => clearInterval(interval);
  }, [token]);

  return { messages, error };
};

export default useMessages;
