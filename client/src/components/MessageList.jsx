import React, { useEffect, useRef } from 'react';
import ChatBubble from './ChatBubble';

const MessageList = ({ messages, currentUser }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-8 flex flex-col space-y-6">
      {messages.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 space-y-4 animate-fade-in opacity-50">
          <div className="w-12 h-12 border border-white/5 rounded-2xl flex items-center justify-center bg-white/[0.01]">
            <div className="w-1.5 h-1.5 bg-zinc-700 rounded-full animate-pulse"></div>
          </div>
          <p className="text-[12px] uppercase tracking-[0.4em] font-medium font-mono text-center">
            Awaiting Data Packet...<br/>
            <span className="text-[10px] opacity-40">Zero-Link Established</span>
          </p>
        </div>
      ) : (
        <div className="flex flex-col space-y-6">
          {messages.map((msg, idx) => (
            <ChatBubble
              key={idx}
              message={msg}
              isOwnMessage={msg.username === currentUser}
            />
          ))}
        </div>
      )}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
