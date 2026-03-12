import React, { useState } from 'react';
import { Send, Sparkles, Zap } from 'lucide-react';

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
    <div className="max-w-[1000px] mx-auto w-full">
      <form onSubmit={handleSubmit} className="relative flex items-center gap-6">
        <div className="relative flex-1 group">
          <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Transmit data packet through the void..."
            className="premium-input w-full h-[64px] rounded-[24px] pl-10 pr-16 text-[14px] lg:text-[16px] font-light tracking-[0.05em] placeholder:text-zinc-700 border-white/10 focus:border-white/30 focus:bg-white/[0.04] transition-all bg-white/[0.025] backdrop-blur-3xl shadow-[inset_0_1px_1px_rgba(255,255,255,0.02)]"
          />
          <div className="absolute right-6 top-1/2 -translate-y-1/2 flex items-center gap-3">
             {message.length > 0 ? (
                 <Sparkles className="w-4 h-4 text-white/60 animate-pulse" />
             ) : (
                 <Zap className="w-4 h-4 text-zinc-800" />
             )}
          </div>
        </div>
        <button
          type="submit"
          disabled={!message.trim()}
          className="h-[64px] w-[64px] flex items-center justify-center bg-white text-black rounded-[24px] hover:bg-[#ffffff] active:scale-90 transition-all disabled:opacity-5 disabled:grayscale shadow-[0_20px_40px_rgba(255,255,255,0.1)] group overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          <Send className="w-5 h-5 relative z-10 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
