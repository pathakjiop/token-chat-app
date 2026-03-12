import React from 'react';

const ChatBubble = ({ message, isOwnMessage }) => {
  return (
    <div className={`flex w-full ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-fade-in`}>
      <div 
        className={`max-w-[80%] rounded-2xl px-6 py-4 transition-all duration-300
          ${isOwnMessage 
            ? 'bg-white text-black font-medium selection:bg-black selection:text-white' 
            : 'bg-zinc-950 text-zinc-300 border border-white/5 selection:bg-white selection:text-black'
          }`}
      >
        {!isOwnMessage && (
          <div className="text-[12px] font-black text-zinc-500 mb-2 uppercase tracking-[0.2em]">
            {message.username}
          </div>
        )}
        <div className="text-[15px] leading-relaxed break-words font-light tracking-wide">
          {message.message}
        </div>
        <div 
          className={`text-[11px] mt-3 font-mono border-t pt-2
            ${isOwnMessage ? 'text-zinc-400 border-black/5' : 'text-zinc-700 border-white/5 text-right'}
          `}
        >
          {new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
