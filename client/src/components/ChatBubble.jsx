import React from 'react';

const ChatBubble = ({ message, isOwnMessage }) => {
  return (
    <div className={`flex w-full ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-fade-in group`}>
      <div 
        className={`max-w-[85%] lg:max-w-[70%] rounded-[28px] px-8 py-5 transition-all duration-500 relative
          ${isOwnMessage 
            ? 'bg-white text-black font-medium shadow-[0_10px_30px_rgba(255,255,255,0.05)] hover:shadow-[0_15px_40px_rgba(255,255,255,0.1)] group-hover:-translate-y-0.5' 
            : 'premium-card text-zinc-300 border border-white/5 hover:border-white/10 group-hover:-translate-y-0.5'
          }`}
      >
        {!isOwnMessage && (
          <div className="text-[11px] font-black text-zinc-600 mb-3 uppercase tracking-[0.3em]">
            {message.username}
          </div>
        )}
        <div className={`text-[15px] lg:text-[16px] leading-[1.6] break-words tracking-tight
           ${isOwnMessage ? 'font-medium' : 'font-light'}
        `}>
          {message.message}
        </div>
        <div 
          className={`text-[10px] mt-4 font-black uppercase tracking-[0.2em] border-t pt-3 flex items-center justify-between
            ${isOwnMessage ? 'text-zinc-500 border-black/5' : 'text-zinc-700 border-white/5'}
          `}
        >
          <span>{new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          {isOwnMessage && (
              <div className="flex gap-1">
                  <div className="w-1 h-1 bg-black/20 rounded-full"></div>
                  <div className="w-1 h-1 bg-black/20 rounded-full"></div>
              </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;

