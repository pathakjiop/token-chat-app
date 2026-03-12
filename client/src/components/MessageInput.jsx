import React, { useState } from 'react';
import { Send } from 'lucide-react';

const MessageInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  return (
    <div className="bg-white border-t border-gray-100 p-4">
      <form onSubmit={handleSubmit} className="flex items-center max-w-4xl mx-auto relative group">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-full block focus:ring-2 focus:ring-blue-500 focus:border-blue-500 py-3.5 pl-6 pr-14 transition-all"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
