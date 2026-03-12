import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import useMessages from '../hooks/useMessages';
import { sendMessage, deleteRoom, leaveRoom } from '../services/api';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import TokenDisplay from '../components/TokenDisplay';
import { LogOut, AlertCircle, User, Users, Trash2 } from 'lucide-react';

const ChatRoom = () => {
  const { token } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username;
  const roomType = location.state?.roomType || 'group';

  const { messages, error } = useMessages(token);

  useEffect(() => {
    if (!username || !token) {
      navigate('/');
    }

    const handleBeforeUnload = async (e) => {
      // In a real app, beforeunload is tricky for async calls.
      // But we'll try to leave the room.
      try {
        await leaveRoom(token, username);
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
    try {
      await leaveRoom(token, username);
    } catch (err) {
      console.error('Failed to leave room:', err);
    } finally {
      navigate('/');
    }
  };

  const handleTerminateSession = async () => {
    if (window.confirm('WARNING: This will permanently expunge ALL messages and terminate the matrix for everyone. Proceed?')) {
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
    <div className="h-screen flex flex-col md:flex-row bg-black text-white animate-fade-in font-outfit">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden border-r border-white/5">
        {/* Header */}
        <header className="h-[80px] premium-glass border-b border-white/5 flex items-center justify-between px-8 z-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 border border-white/20 rounded-[14px] flex items-center justify-center font-bold text-sm bg-white/5">
              {username.charAt(0).toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight uppercase">{username}</h2>
                <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] font-black uppercase tracking-widest text-zinc-400 border border-white/5">
                  {roomType === 'private' ? 'Private' : 'Group'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-zinc-500 font-bold uppercase tracking-widest">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_10px_rgba(255,255,255,0.5)]"></div>
                Active Link
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
                onClick={handleLeaveRoom}
                className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-bold text-zinc-400 hover:text-white transition-all uppercase tracking-widest border border-white/5 hover:border-white/20 rounded-[12px] bg-white/5"
            >
                <LogOut className="w-3.5 h-3.5" />
                Disconnect
            </button>
            <button
                onClick={handleTerminateSession}
                title="Purge Matrix"
                className="p-2.5 text-zinc-600 hover:text-red-500 transition-all border border-white/5 hover:border-red-500/20 rounded-[12px] bg-white/5 group"
            >
                <Trash2 className="w-4 h-4 group-hover:animate-pulse" />
            </button>
          </div>
        </header>

        {/* Error Banner */}
        {error && (
          <div className="absolute top-[90px] left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/20 backdrop-blur-md px-6 py-2 rounded-full text-[13px] text-red-400 font-bold uppercase tracking-widest flex items-center gap-3 z-30">
            <AlertCircle className="w-3 h-3" />
            <span>Connection Desync: {error}</span>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-8 relative">
          <MessageList messages={messages} currentUser={username} />
        </div>
        
        {/* Input */}
        <footer className="p-6 premium-glass border-t border-white/5 z-20">
          <MessageInput onSendMessage={handleSendMessage} />
        </footer>
      </div>

      {/* Sidebar - Desktop Only */}
      <aside className="hidden lg:flex w-[380px] flex-col bg-zinc-950 p-10 space-y-12">
        <div className="space-y-6">
          <h3 className="text-[12px] font-black text-zinc-600 uppercase tracking-[0.4em]">Channel Matrix</h3>
          <TokenDisplay token={token} />
          <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
             {roomType === 'private' ? (
                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                     <User className="w-5 h-5" />
                 </div>
             ) : (
                 <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white">
                     <Users className="w-5 h-5" />
                 </div>
             )}
             <div>
                 <p className="text-[12px] font-bold uppercase tracking-widest text-white">
                     {roomType === 'private' ? 'Secure Dual Link' : 'Open Multi-Matrix'}
                 </p>
                 <p className="text-[10px] text-zinc-500 uppercase tracking-tighter">
                     {roomType === 'private' ? 'Limited to 2 entities' : 'No participant ceiling'}
                 </p>
             </div>
          </div>
        </div>

        <div className="space-y-8">
          <div>
            <h3 className="text-[12px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4">Protocol</h3>
            <div className="p-6 rounded-[24px] bg-white/[0.02] border border-white/5 space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-1 h-1 bg-white rounded-full mt-2"></div>
                <p className="text-[13px] text-zinc-400 font-light leading-relaxed">
                  End-to-End Void: Messages exist only in the current buffer.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-1 h-1 bg-white rounded-full mt-2"></div>
                <p className="text-[13px] text-zinc-400 font-light leading-relaxed">
                  Ephemeral Identity: Your alias exists only for this duration.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5">
            <p className="text-[12px] text-zinc-600 font-bold uppercase tracking-widest flex items-center gap-2">
              <div className="w-1 h-1 bg-zinc-700 rounded-full"></div>
              Noir.Chat v1.1.0 — Evolution
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ChatRoom;

