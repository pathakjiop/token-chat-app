import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

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
    <div className="max-w-6xl mx-auto">
      <form onSubmit={handleSubmit} className="relative flex items-center gap-5">
        <div className="relative flex-1 group">
          <div className="absolute inset-0 bg-white/5 blur-2xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Transmit data packet..."
            className="premium-input w-full h-[68px] rounded-[24px] pl-10 pr-16 text-[16px] font-light tracking-wide placeholder:text-zinc-800 border-white/5 focus:border-white/20 transition-all bg-white/[0.02]"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
             {message.length > 0 && (
                 <Sparkles className="w-4 h-4 text-zinc-700 animate-pulse" />
             )}
          </div>
        </div>
        <button
          type="submit"
          disabled={!message.trim()}
          className="h-[68px] w-[68px] flex items-center justify-center bg-white text-black rounded-[24px] hover:bg-[#ffffff] active:scale-90 transition-all disabled:opacity-10 disabled:grayscale shadow-[0_10px_30px_rgba(255,255,255,0.1)] group"
        >
          <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;

