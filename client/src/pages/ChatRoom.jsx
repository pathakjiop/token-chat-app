import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import useMessages from '../hooks/useMessages';
import { sendMessage, deleteRoom, leaveRoom } from '../services/api';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import TokenDisplay from '../components/TokenDisplay';
import { LogOut, AlertCircle, User, Users, Trash2, Info, X, Share2, Shield } from 'lucide-react';

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

  const handleShare = async () => {
    const shareData = {
        title: 'Noir Chat',
        text: `Join my ${roomType} chat matrix on Noir Chat! Link: ${window.location.origin}`,
        url: window.location.origin
    };

    try {
        if (navigator.share) {
            await navigator.share(shareData);
        } else {
            navigator.clipboard.writeText(`Token: ${token}\nURL: ${window.location.origin}`);
            alert('Link & Token copied to clipboard');
        }
    } catch (err) {
        console.error('Share failed:', err);
    }
  };

  if (!username) return null;

  return (
    <div className="h-[100dvh] flex flex-col lg:flex-row bg-black text-white animate-fade-in font-outfit overflow-hidden">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative overflow-hidden lg:border-r lg:border-white/5">
        {/* Header */}
        <header className="h-[70px] lg:h-[90px] premium-glass border-b border-white/5 flex items-center justify-between px-4 lg:px-10 z-20">
          <div className="flex items-center gap-4 lg:gap-6 shrink-0">
            <div className="relative group">
               <div className="absolute inset-0 bg-white/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative w-10 h-10 lg:w-12 lg:h-12 border border-white/10 rounded-[16px] flex items-center justify-center font-black text-sm lg:text-base bg-white/5 transition-all group-hover:border-white/30">
                {username.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 lg:gap-3">
                <h2 className="text-xs lg:text-base font-black tracking-tight uppercase truncate max-w-[100px] lg:max-w-none">{username}</h2>
                <span className="hidden xs:inline-block px-2.5 py-0.5 rounded-full bg-white/10 text-[8px] lg:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 border border-white/5">
                  {roomType === 'private' ? 'Dual Link' : 'Multi Matrix'}
                </span>
              </div>
              <div className="flex items-center gap-1.5 lg:gap-2 text-[10px] lg:text-[12px] text-zinc-600 font-black uppercase tracking-[0.3em] mt-0.5">
                <div className="w-1.5 h-1.5 bg-zinc-300 rounded-full animate-pulse shadow-[0_0_12px_rgba(255,255,255,0.8)]"></div>
                Spectral Link
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-4">
            <button
                onClick={() => setShowMobileInfo(true)}
                className="lg:hidden p-2.5 text-zinc-500 hover:text-white transition-all border border-white/5 rounded-xl bg-white/5"
            >
                <Info className="w-5 h-5" />
            </button>
            <button
                onClick={handleLeaveRoom}
                className="hidden sm:flex items-center gap-2.5 px-6 py-3 text-[12px] font-black text-zinc-500 hover:text-white transition-all uppercase tracking-[0.2em] border border-white/5 hover:border-white/20 rounded-xl bg-white/5"
            >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Exit Matrix</span>
            </button>
            <button
                onClick={handleTerminateSession}
                title="Purge Matrix"
                className="p-2.5 lg:p-3 text-zinc-700 hover:text-red-500 transition-all border border-white/5 hover:border-red-500/20 rounded-xl bg-white/5 group"
            >
                <Trash2 className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </header>

        {/* Error Banner */}
        {error && (
          <div className="absolute top-[85px] lg:top-[100px] left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/20 backdrop-blur-md px-6 py-2.5 rounded-full text-[12px] lg:text-[13px] text-red-400 font-black uppercase tracking-widest flex items-center gap-3 z-30 w-max max-w-[90%] shadow-2xl">
            <Shield className="w-4 h-4 shrink-0" />
            <span className="truncate">{error}</span>
          </div>
        )}

        {/* Messages */}
        <main className="flex-1 overflow-y-auto px-4 lg:px-12 py-8 lg:py-12 relative scroll-smooth">
          <MessageList messages={messages} currentUser={username} />
        </main>
        
        {/* Input */}
        <footer className="p-4 lg:p-8 premium-glass border-t border-white/5 z-20">
          <MessageInput onSendMessage={handleSendMessage} />
        </footer>
      </div>

      {/* Info Sidebar (Desktop) / Drawer (Mobile) */}
      
      {/* Mobile Drawer Overlay */}
      {showMobileInfo && (
          <div className="lg:hidden fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col justify-end animate-fade-in" onClick={() => setShowMobileInfo(false)}>
              <div 
                className="bg-zinc-950 border-t border-white/10 rounded-t-[40px] p-10 lg:p-12 space-y-10 animate-slide-up shadow-[0_-20px_100px_rgba(0,0,0,1)]"
                onClick={e => e.stopPropagation()}
              >
                  <div className="flex justify-between items-center">
                      <h3 className="text-[12px] font-black text-zinc-600 uppercase tracking-[0.4em]">Matrix Terminal</h3>
                      <button onClick={() => setShowMobileInfo(false)} className="p-3 bg-white/5 rounded-full text-zinc-500 hover:text-white transition-colors"><X className="w-5 h-5" /></button>
                  </div>
                  
                  <TokenDisplay token={token} />

                  <div className="grid grid-cols-2 gap-5">
                      <button 
                        onClick={handleShare}
                        className="flex items-center justify-center gap-3 bg-white text-black h-[64px] rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] shadow-xl active:scale-95 transition-all"
                      >
                          <Share2 className="w-5 h-5" />
                          Share
                      </button>
                      <button 
                         onClick={handleLeaveRoom}
                         className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 text-zinc-400 h-[64px] rounded-2xl font-black uppercase text-[12px] tracking-[0.2em] active:scale-95 transition-all"
                      >
                          <LogOut className="w-5 h-5" />
                          Exit
                      </button>
                  </div>

                  <div className="p-6 rounded-[28px] bg-white/[0.02] border border-white/5 flex items-center gap-5">
                    {roomType === 'private' ? (
                        <div className="w-12 h-12 rounded-[18px] bg-white/10 flex items-center justify-center text-white">
                            <User className="w-6 h-6" />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-[18px] bg-white/10 flex items-center justify-center text-white">
                            <Users className="w-6 h-6" />
                        </div>
                    )}
                    <div>
                        <p className="text-[14px] font-black uppercase tracking-widest text-white">
                            {roomType === 'private' ? 'Secure Dual Link' : 'Open Multi-Matrix'}
                        </p>
                        <p className="text-[11px] text-zinc-500 uppercase font-bold tracking-tight mt-0.5 opacity-60">
                            {roomType === 'private' ? 'Restricted to 2 unique entities' : 'No participant ceiling detected'}
                        </p>
                    </div>
                </div>

                <div className="pt-8 border-t border-white/5 text-center">
                    <p className="text-[11px] text-zinc-700 font-bold uppercase tracking-[0.5em] opacity-40">
                        Noir.Chat v1.1.0 — Absolute Privacy
                    </p>
                </div>
              </div>
          </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[420px] flex-col bg-zinc-950 p-12 space-y-12 shadow-[inset_1px_0_0_rgba(255,255,255,0.05)]">
        <div className="space-y-8">
          <h3 className="text-[13px] font-black text-zinc-700 uppercase tracking-[0.5em]">Channel Matrix</h3>
          <TokenDisplay token={token} />
          
          <button 
            onClick={handleShare}
            className="w-full flex items-center justify-center gap-4 bg-white/[0.03] hover:bg-white/[0.06] border border-white/10 text-white h-[64px] rounded-2xl font-black uppercase text-[12px] tracking-[0.3em] transition-all group"
          >
              <Share2 className="w-5 h-5 opacity-40 group-hover:opacity-100 transition-opacity" />
              Transmit Link
          </button>

          <div className="p-6 rounded-[28px] bg-white/[0.02] border border-white/5 flex items-center gap-5">
             {roomType === 'private' ? (
                 <div className="w-12 h-12 rounded-[18px] bg-white/10 flex items-center justify-center text-white shadow-inner">
                     <User className="w-6 h-6" />
                 </div>
             ) : (
                 <div className="w-12 h-12 rounded-[18px] bg-white/10 flex items-center justify-center text-white shadow-inner">
                     <Users className="w-6 h-6" />
                 </div>
             )}
             <div>
                 <p className="text-[14px] font-black uppercase tracking-widest text-white">
                     {roomType === 'private' ? 'Secure Dual Link' : 'Open Multi-Matrix'}
                 </p>
                 <p className="text-[11px] text-zinc-500 uppercase font-bold tracking-tight mt-0.5 opacity-60">
                     {roomType === 'private' ? 'Restricted to 2 entities' : 'Unlimited connectivity'}
                 </p>
             </div>
          </div>
        </div>

        <div className="space-y-10 flex-1 flex flex-col justify-end pb-4">
          <div>
            <h3 className="text-[12px] font-black text-zinc-700 uppercase tracking-[0.5em] mb-6">Security Protocol</h3>
            <div className="p-8 rounded-[32px] bg-white/[0.015] border border-white/5 space-y-6">
              <div className="flex items-start gap-5">
                <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full mt-2.5"></div>
                <p className="text-[14px] text-zinc-500 font-light leading-relaxed tracking-wide">
                  <span className="text-zinc-300 font-bold uppercase text-[11px] block mb-1">End-to-End Void</span>
                  Messages exist only within the current temporal buffer.
                </p>
              </div>
              <div className="flex items-start gap-5">
                <div className="w-1.5 h-1.5 bg-zinc-600 rounded-full mt-2.5"></div>
                <p className="text-[14px] text-zinc-500 font-light leading-relaxed tracking-wide">
                  <span className="text-zinc-300 font-bold uppercase text-[11px] block mb-1">Zero persistence</span>
                  Your identity and link will leave no trace once purged.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-10 border-t border-white/5 flex items-center justify-between">
            <p className="text-[11px] text-zinc-700 font-black uppercase tracking-[0.4em] flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-zinc-800 rounded-full"></div>
              Noir.Chat v1.1.0
            </p>
            <div className="w-2 h-2 rounded-full bg-green-500/20 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-green-500"></div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ChatRoom;

