import React from 'react';

const ChatBubble = ({ message, isOwnMessage }) => {
  return (
    <div className={`flex w-full mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      <div 
        className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm
          ${isOwnMessage 
            ? 'bg-blue-600 text-white rounded-br-none' 
            : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
          }`}
      >
        {!isOwnMessage && (
          <div className="text-xs font-semibold text-gray-500 mb-1">
            {message.username}
          </div>
        )}
        <div className="text-[15px] leading-relaxed break-words">
          {message.message}
        </div>
        <div 
          className={`text-[10px] mt-1.5 text-right
            ${isOwnMessage ? 'text-blue-200' : 'text-gray-400'}
          `}
        >
          {new Date(message.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    </div>
  );
};

export default ChatBubble;
