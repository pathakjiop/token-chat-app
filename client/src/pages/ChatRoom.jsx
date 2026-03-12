import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import useMessages from '../hooks/useMessages';
import { sendMessage, deleteRoom, leaveRoom } from '../services/api';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import TokenDisplay from '../components/TokenDisplay';
import { LogOut, User, Users, Trash2, Info, X, Share2, Shield, Activity } from 'lucide-react';

const ChatRoom = () => {
  const { token } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const username = location.state?.username;
  const roomType = location.state?.roomType || 'group';

  const [showMobileInfo, setShowMobileInfo] = useState(false);
  const { messages, error } = useMessages(token);

  useEffect(() => {
    if (!username || !token) {
      navigate('/');
    }

    const handleBeforeUnload = async (e) => {
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
    if (window.confirm('CRITICAL ACTION: This will expunge ALL matrix data for all participants. Continue?')) {
      try {
        await deleteRoom(token);
      } catch (err) {
        console.error('Failed to delete room:', err);
      } finally {
        navigate('/');
      }
    }
  };

  const handleShare = async () => {
    const shareData = {
        title: 'Noir Chat Matrix',
        text: `Secure dual-link established. Join: ${window.location.origin}/chat/${token}`,
        url: `${window.location.origin}/chat/${token}`
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            navigator.clipboard.writeText(`${window.location.origin}/chat/${token}`);
            alert('Transmission link copied to clipboard.');
        }
    } catch (err) {
        console.error('Share failed:', err);
    }
  };

  if (!username) return null;

  return (
    <div className="h-[100dvh] bg-[#050504] flex flex-col lg:flex-row text-white animate-fade-in font-outfit overflow-hidden relative">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[400px] h-full bg-white/[0.015] blur-[150px] -z-10 hidden lg:block"></div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-transparent">
        {/* Header */}
        <header className="h-[75px] lg:h-[85px] border-b border-white/[0.03] backdrop-blur-3xl bg-black/20 flex items-center justify-between px-5 lg:px-10 z-20">
          <div className="flex items-center gap-4 shrink-0">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/5 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-10 h-10 border border-white/10 rounded-[14px] flex items-center justify-center font-black text-base bg-black/40 transition-all group-hover:border-white/20">
                {username.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-[13px] lg:text-base font-black tracking-tight uppercase truncate max-w-[100px] lg:max-w-none">{username}</h2>
                <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.03] border border-white/5 text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500">
                  <Activity className="w-2.5 h-2.5" />
                  Live Sync
                </div>
              </div>
              <div className="text-[9px] lg:text-[11px] text-zinc-600 font-black uppercase tracking-[0.3em] mt-0.5 flex items-center gap-1.5">
                <span className="w-1 h-1 bg-zinc-500 rounded-full animate-pulse"></span>
                {roomType === 'private' ? 'Encrypted Dual Link' : 'Open Multi-Matrix'}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-4">
            <button
                onClick={() => setShowMobileInfo(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center text-zinc-500 hover:text-white transition-all border border-white/5 rounded-xl bg-white/[0.03]"
            >
                <Info className="w-4 h-4" />
            </button>
            <button
                onClick={handleLeaveRoom}
                className="hidden sm:flex items-center gap-2.5 h-10 px-6 text-[10px] font-black text-zinc-500 hover:text-white transition-all uppercase tracking-[0.3em] border border-white/5 hover:border-white/20 rounded-xl bg-white/[0.03] active:scale-95"
            >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Disconnect</span>
            </button>
            <button
                onClick={handleTerminateSession}
                title="Purge Matrix"
                className="w-10 h-10 flex items-center justify-center text-zinc-800 hover:text-red-500 transition-all border border-white/5 hover:border-red-500/20 rounded-xl bg-white/[0.03] group active:scale-95"
            >
                <Trash2 className="w-4 h-4 group-hover:rotate-6 transition-transform" />
            </button>
          </div>
        </header>

        {/* Global Error Banner */}
        {error && (
          <div className="absolute top-28 lg:top-32 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/20 backdrop-blur-2xl px-8 py-3 rounded-full text-[12px] text-red-400 font-black uppercase tracking-[0.2em] flex items-center gap-3 z-30 shadow-3xl animate-fade-in max-w-[90%]">
            <Shield className="w-4 h-4 shrink-0" />
            {error}
          </div>
        )}

        {/* Message Interface */}
        <main className="flex-1 overflow-y-auto px-6 lg:px-12 py-6 lg:py-10 relative scroll-smooth flex flex-col gap-6 scrollbar-hide">
          <MessageList messages={messages} currentUser={username} />
        </main>
        
        {/* Interaction Bar */}
        <footer className="p-6 lg:p-8 border-t border-white/[0.03] bg-black/10 backdrop-blur-3xl z-20">
          <MessageInput onSendMessage={handleSendMessage} />
        </footer>
      </div>

      {/* MOBILE DRAWER */}
      {showMobileInfo && (
          <div className="lg:hidden fixed inset-0 bg-black/95 backdrop-blur-xl z-50 flex flex-col justify-end animate-fade-in" onClick={() => setShowMobileInfo(false)}>
              <div 
                className="bg-zinc-950 border-t border-white/10 rounded-t-[40px] p-8 lg:p-12 space-y-10 animate-slide-up shadow-[0_-30px_100px_rgba(0,0,0,1)]"
                onClick={e => e.stopPropagation()}
              >
                  <div className="flex justify-between items-center px-1">
                      <h3 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.5em]">Session Data</h3>
                      <button onClick={() => setShowMobileInfo(false)} className="w-10 h-10 flex items-center justify-center bg-white/[0.02] rounded-full text-zinc-500 hover:text-white transition-colors border border-white/5"><X className="w-4 h-4" /></button>
                  </div>
                  
                  <TokenDisplay token={token} />

                  <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={handleShare}
                        className="flex items-center justify-center gap-3 bg-white text-black h-[64px] rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-3xl active:scale-[0.98] transition-all"
                      >
                          <Share2 className="w-4 h-4" />
                          Share
                      </button>
                      <button 
                         onClick={handleLeaveRoom}
                         className="flex items-center justify-center gap-3 bg-white/[0.02] border border-white/10 text-zinc-600 h-[64px] rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] active:scale-[0.98] transition-all hover:text-white hover:bg-white/[0.05]"
                      >
                          <LogOut className="w-4 h-4" />
                          Exit
                      </button>
                  </div>

                  <div className="p-6 rounded-[28px] bg-white/[0.01] border border-white/5 flex items-center gap-5">
                    <div className="w-12 h-12 rounded-[16px] bg-white/5 flex items-center justify-center text-zinc-400">
                        {roomType === 'private' ? <User className="w-5 h-5" /> : <Users className="w-5 h-5" />}
                    </div>
                    <div>
                        <p className="text-[13px] font-black uppercase tracking-[0.2em] text-zinc-200">
                            {roomType === 'private' ? 'Secure Dual Link' : 'Open Multi-Matrix'}
                        </p>
                        <p className="text-[9px] text-zinc-600 uppercase font-black tracking-[0.1em] mt-0.5 space-x-2">
                            <span>Limit: {roomType === 'private' ? '2' : '∞'} entities</span>
                            <span>•</span>
                            <span className="text-zinc-500">Active</span>
                        </p>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/[0.03] text-center">
                    <p className="text-[10px] text-zinc-800 font-black uppercase tracking-[0.5em] opacity-60">
                        Noir.Chat // Protocol 1.1 — Secure
                    </p>
                </div>
              </div>
          </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-[400px] flex-col bg-[#080807] p-10 lg:p-12 space-y-12 border-l border-white/[0.02] backdrop-blur-3xl overflow-y-auto scrollbar-hide">
        <div className="space-y-8">
          <div className="space-y-2.5">
             <h3 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.5em] ml-2">Channel Matrix</h3>
             <TokenDisplay token={token} />
          </div>
          
          <button 
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-4 bg-white/[0.015] hover:bg-white/[0.03] border border-white/5 text-zinc-500 hover:text-white h-[64px] rounded-[24px] font-black uppercase text-[11px] tracking-[0.4em] transition-all group active:scale-[0.98]"
          >
              <Share2 className="w-4 h-4 opacity-30 group-hover:opacity-100 transition-opacity" />
              Transmit Link
          </button>

          <div className="p-6 rounded-[28px] bg-white/[0.01] border border-white/5 flex items-center gap-5 group hover:border-white/10 transition-colors cursor-default">
             <div className="w-12 h-12 rounded-[16px] bg-white/[0.03] flex items-center justify-center text-zinc-600 group-hover:text-zinc-200 transition-colors shadow-inner">
                 {roomType === 'private' ? <User className="w-5 h-5" /> : <Users className="w-5 h-5" />}
             </div>
             <div>
                 <p className="text-[13px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-white transition-colors">
                     {roomType === 'private' ? 'Secure Dual Link' : 'Open Multi-Matrix'}
                 </p>
                 <p className="text-[10px] text-zinc-700 font-black uppercase tracking-widest mt-0.5 opacity-80">
                     {roomType === 'private' ? 'Restricted' : 'Unlimited'}
                 </p>
             </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-end space-y-10">
          <div className="space-y-6">
            <h3 className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.5em] ml-2">Security Protocol</h3>
            <div className="p-8 rounded-[32px] bg-white/[0.01] border border-white/5 space-y-8">
              <div className="flex items-start gap-5">
                <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full mt-2"></div>
                <div className="space-y-1.5">
                  <span className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.2em] block">End-to-End Void</span>
                  <p className="text-[13px] text-zinc-700 font-light leading-relaxed tracking-wider">
                    Messages exist within current buffer. No central database.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full mt-2"></div>
                <div className="space-y-1.5">
                  <span className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.2em] block">Zero persistence</span>
                  <p className="text-[13px] text-zinc-700 font-light leading-relaxed tracking-wider">
                    Terminating the matrix expunges all cryptographic signatures.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-white/[0.03] flex items-center justify-between px-1">
            <p className="text-[10px] text-zinc-800 font-black uppercase tracking-[0.5em] flex items-center gap-2.5">
              <span className="w-1.5 h-1.5 bg-zinc-900 rounded-full"></span>
              P1.1 — Noir.Chat
            </p>
            <div className="flex items-center gap-1.5">
                <div className="w-1 h-1 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.3)]"></div>
                <span className="text-[9px] text-zinc-700 font-black uppercase tracking-widest">Secure</span>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ChatRoom;
