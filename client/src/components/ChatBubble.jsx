import React from 'react';

const ChatBubble = ({ message, isOwnMessage }) => {
  return (
    <div className={`flex w-full ${isOwnMessage ? 'justify-end' : 'justify-start'} animate-fade-in group`}>
      <div 
        className={`max-w-[85%] lg:max-w-[800px] rounded-[35px] px-10 py-7 transition-all duration-700 relative
          ${isOwnMessage 
            ? 'bg-white text-black font-medium shadow-[0_20px_50px_rgba(255,255,255,0.05)] hover:shadow-[0_30px_70px_rgba(255,255,255,0.1)] group-hover:-translate-y-1' 
            : 'premium-card text-zinc-300 border border-white/5 hover:border-white/10 group-hover:-translate-y-1'
          }`}
      >
        {!isOwnMessage && (
          <div className="text-[11px] font-black text-zinc-600 mb-4 uppercase tracking-[0.4em] flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-zinc-800 rounded-full"></span>
            {message.username}
          </div>
        )}
        <div className={`text-[16px] lg:text-[18px] leading-[1.7] break-words tracking-tight
           ${isOwnMessage ? 'font-semibold' : 'font-light'}
        `}>
          {message.message}
        </div>
        <div 
          className={`text-[10px] mt-6 font-black uppercase tracking-[0.3em] border-t pt-4 flex items-center justify-between
            ${isOwnMessage ? 'text-zinc-500 border-black/5' : 'text-zinc-800 border-white/5'}
          `}
        >
          <div className="flex items-center gap-2">
             <span className="opacity-40">UTC</span>
             <span>{new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          {isOwnMessage && (
              <div className="flex gap-1.5">
                  <div className="w-1 h-1 bg-black/20 rounded-full"></div>
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
