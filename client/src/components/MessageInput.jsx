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
    <div className="max-w-5xl mx-auto">
      <form onSubmit={handleSubmit} className="relative flex items-center gap-4">
        <div className="relative flex-1 group">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Transmit message..."
            className="premium-input w-full h-[60px] rounded-[18px] pl-8 pr-16 text-[14px] font-light tracking-wide placeholder:text-zinc-700"
          />
          <div className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent transition-opacity opacity-0 group-focus-within:opacity-100"></div>
        </div>
        <button
          type="submit"
          disabled={!message.trim()}
          className="h-[60px] w-[60px] flex items-center justify-center bg-white text-black rounded-[18px] hover:bg-zinc-200 active:scale-95 transition-all disabled:opacity-20 disabled:grayscale"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
