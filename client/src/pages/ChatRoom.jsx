import React, { useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import useMessages from '../hooks/useMessages';
import { sendMessage, deleteRoom } from '../services/api';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import TokenDisplay from '../components/TokenDisplay';
import { LogOut, AlertCircle } from 'lucide-react';

const ChatRoom = () => {
  const { token } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username;

  const { messages, error } = useMessages(token);

  useEffect(() => {
    if (!username || !token) {
      navigate('/');
    }

    const handleBeforeUnload = async (e) => {
      e.preventDefault();
      // Attempt to clean up room on close
      // A more robust app might use navigator.sendBeacon
      try {
        await deleteRoom(token);
      } catch (err) {}
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [username, token, navigate]);

  const handleSendMessage = async (text) => {
    try {
      await sendMessage(token, username, text);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleLeaveRoom = async () => {
    if (window.confirm('Are you sure you want to leave? This will delete the chat session for everyone.')) {
      try {
        await deleteRoom(token);
      } catch (err) {
        console.error('Failed to delete room:', err);
      } finally {
        navigate('/');
      }
    }
  };

  if (!username) return null;

  return (
    <div className="h-screen bg-gray-100 flex flex-col md:flex-row max-w-6xl mx-auto md:py-6 md:px-4 shadow-2xl">
      <div className="flex-1 bg-white md:rounded-2xl overflow-hidden flex flex-col border border-gray-200 shadow-sm relative">
        <div className="bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-lg">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="font-semibold text-gray-800">{username}</h2>
              <div className="flex items-center text-xs text-green-500 font-medium">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></div>
                Connected
              </div>
            </div>
          </div>
          <button
            onClick={handleLeaveRoom}
            className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Leave Room</span>
          </button>
        </div>

        {error && (
          <div className="bg-orange-50 p-2 text-center text-orange-600 text-sm flex items-center justify-center space-x-2 border-b border-orange-100">
            <AlertCircle className="w-4 h-4" />
            <span>{error}</span>
          </div>
        )}

        <MessageList messages={messages} currentUser={username} />
        
        <MessageInput onSendMessage={handleSendMessage} />
      </div>

      <div className="md:w-80 md:ml-6 flex flex-col space-y-6 shrink-0 z-10">
        <div className="bg-white md:rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <TokenDisplay token={token} />
          <div className="p-4 bg-gray-50 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Room Info</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Share this token with the other person to let them join. The room and all messages will be automatically destroyed when you leave.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
