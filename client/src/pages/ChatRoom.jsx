import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import useMessages from '../hooks/useMessages';
import { sendMessage, deleteRoom, leaveRoom, joinRoom } from '../services/api';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import TokenDisplay from '../components/TokenDisplay';
import { LogOut, User, Users, Trash2, Info, X, Share2, Shield, Activity, Sparkles, Lock, Zap, ArrowRight } from 'lucide-react';

const ChatRoom = () => {
  const { token } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Use state to persist info across refreshes if we can (though ephemeral, we need it to render)
  const [username, setUsername] = useState(location.state?.username || '');
  const [roomType, setRoomType] = useState(location.state?.roomType || 'group');
  const [showMobileInfo, setShowMobileInfo] = useState(false);
  const [tempUsername, setTempUsername] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);

  const { messages, error } = useMessages(token);

  useEffect(() => {
    if (username && token) {
      const handleBeforeUnload = async () => {
        try {
          await leaveRoom(token, username);
        } catch (err) {}
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
      };
    }
  }, [username, token]);

  const handleSyncIdentity = async (e) => {
    e.preventDefault();
    if (!tempUsername.trim()) return;

    setIsSyncing(true);
    setSyncError(null);
    try {
      const { roomType: joinedRoomType } = await joinRoom(token, tempUsername.trim());
      setUsername(tempUsername.trim());
      setRoomType(joinedRoomType);
    } catch (err) {
      setSyncError(err.response?.data?.error || 'Transmission failed. Check coordinates.');
    } finally {
      setIsSyncing(false);
    }
  };

  const handleSendMessage = async (text) => {
    try {
      await sendMessage(token, username, text);
    } catch (err) {
      console.error('Failed to send message:', err);
    }
  };

  const handleLeaveRoom = async () => {
    try {
      if (username) await leaveRoom(token, username);
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
        text: `Secure link established. Join: ${window.location.origin}/chat/${token}`,
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

  // If identity is missing, show a high-end sync screen instead of null/blank
  if (!username) {
    return (
      <div className="min-h-[100dvh] bg-[#050504] flex items-center justify-center p-6 font-outfit relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/[0.01] blur-[140px] rounded-full animate-pulse"></div>
        
        <div className="w-full max-w-[440px] z-10 animate-fade-in">
           <div className="premium-card rounded-[45px] p-1 shadow-[0_40px_100px_rgba(0,0,0,1)]">
              <div className="bg-black/60 backdrop-blur-3xl rounded-[40px] p-10 lg:p-14 space-y-10 border border-white/5">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-white/[0.03] border border-white/10 rounded-[28px] flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Sparkles className="w-10 h-10 text-white opacity-20 animate-pulse" />
                  </div>
                  <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">Access Denied</h1>
                  <p className="text-zinc-600 text-[12px] uppercase tracking-[0.3em] font-medium px-4">Identify yourself to join the active matrix</p>
                </div>

                <form onSubmit={handleSyncIdentity} className="space-y-8">
                  <div className="space-y-4">
                    <label className="block text-[10px] font-black text-zinc-700 uppercase tracking-[0.5em] ml-2">Digital Signature</label>
                    <input
                      type="text"
                      value={tempUsername}
                      onChange={(e) => setTempUsername(e.target.value)}
                      placeholder="ENTER ALIAS..."
                      className="premium-input w-full h-[64px] rounded-[24px] px-8 text-white text-base font-light tracking-[0.2em] placeholder:text-zinc-900 bg-white/[0.02] border-white/5 focus:border-white/20 transition-all text-center"
                      autoFocus
                    />
                  </div>

                  {syncError && (
                    <p className="text-red-500/80 text-[10px] uppercase tracking-widest font-black text-center animate-shake italic">
                      {syncError}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSyncing || !tempUsername.trim()}
                    className="premium-button w-full h-[64px] rounded-[24px] group flex items-center justify-center gap-4 disabled:opacity-20 active:scale-[0.97]"
                  >
                    {isSyncing ? <Zap className="w-5 h-5 animate-spin" /> : (
                      <>
                        <span className="text-[12px] font-black uppercase tracking-[0.2em]">Resync Identity</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => navigate('/')}
                    className="w-full text-center text-zinc-800 hover:text-zinc-500 text-[10px] uppercase tracking-[0.4em] font-black transition-colors pt-4"
                  >
                    Terminate Attempt
                  </button>
                </form>
              </div>
           </div>
        </div>
      </div>
    );
  }

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
              <div className="relative w-10 h-10 border border-white/10 rounded-[14px] flex items-center justify-center font-black text-base bg-black/40 transition-all group-hover:border-white/20 shadow-inner overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent"></div>
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
                <span className="w-1 h-1 bg-zinc-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(255,255,255,0.2)]"></span>
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
                className="hidden sm:flex items-center gap-2.5 h-10 px-6 text-[10px] font-black text-zinc-500 hover:text-white transition-all uppercase tracking-[0.3em] border border-white/5 hover:border-white/20 rounded-xl bg-white/[0.03] active:scale-95 shadow-inner"
            >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Disconnect</span>
            </button>
            <button
                onClick={handleTerminateSession}
                title="Purge Matrix"
                className="w-10 h-10 flex items-center justify-center text-zinc-800 hover:text-red-500 transition-all border border-white/5 hover:border-red-500/20 rounded-xl bg-white/[0.03] group active:scale-95"
            >
                <Trash2 className="w-4 h-4 group-hover:rotate-6 transition-transform hover:drop-shadow-[0_0_8px_rgba(239,68,68,0.4)]" />
            </button>
          </div>
        </header>

        {/* Global Error Banner */}
        {error && (
          <div className="absolute top-28 lg:top-32 left-1/2 -translate-x-1/2 bg-red-500/10 border border-red-500/20 backdrop-blur-2xl px-8 py-3 rounded-full text-[11px] text-red-400 font-black uppercase tracking-[0.2em] flex items-center gap-3 z-30 shadow-3xl animate-fade-in max-w-[90%]">
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
          <div className="lg:hidden fixed inset-0 bg-black/95 backdrop-blur-3xl z-50 flex flex-col justify-end animate-fade-in" onClick={() => setShowMobileInfo(false)}>
              <div 
                className="bg-zinc-950 border-t border-white/10 rounded-t-[45px] p-8 space-y-10 animate-slide-up shadow-[0_-40px_100px_rgba(0,0,0,1)]"
                onClick={e => e.stopPropagation()}
              >
                  <div className="flex justify-between items-center px-2">
                      <h3 className="text-[10px] font-black text-zinc-700 uppercase tracking-[0.6em]">Session Core</h3>
                      <button onClick={() => setShowMobileInfo(false)} className="w-10 h-10 flex items-center justify-center bg-white/[0.03] rounded-full text-zinc-500 hover:text-white transition-colors border border-white/5 shadow-inner"><X className="w-4 h-4" /></button>
                  </div>
                  
                  <TokenDisplay token={token} />

                  <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={handleShare}
                        className="flex items-center justify-center gap-3 bg-white text-black h-[64px] rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] shadow-[0_20px_40px_rgba(255,255,255,0.1)] active:scale-[0.98] transition-all"
                      >
                          <Share2 className="w-4 h-4" />
                          Share
                      </button>
                      <button 
                         onClick={handleLeaveRoom}
                         className="flex items-center justify-center gap-3 bg-white/[0.03] border border-white/5 text-zinc-600 h-[64px] rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] active:scale-[0.98] transition-all shadow-inner"
                      >
                          <LogOut className="w-4 h-4" />
                          Exit
                      </button>
                  </div>

                  <div className="p-7 rounded-[32px] bg-white/[0.015] border border-white/5 flex items-center gap-6 shadow-inner">
                    <div className="w-14 h-14 rounded-[20px] bg-black/40 border border-white/5 flex items-center justify-center text-zinc-500 shadow-inner relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent"></div>
                        {roomType === 'private' ? <User className="w-6 h-6 z-10" /> : <Users className="w-6 h-6 z-10" />}
                    </div>
                    <div>
                        <p className="text-[14px] font-black uppercase tracking-[0.2em] text-zinc-200">
                            {roomType === 'private' ? 'Dual Link' : 'Multi Matrix'}
                        </p>
                        <p className="text-[9px] text-zinc-600 uppercase font-black tracking-widest mt-1 italic">
                           Ephemeral Auth Protocol 1.1
                        </p>
                    </div>
                </div>

                <div className="pt-6 border-t border-white/5 text-center">
                    <p className="text-[10px] text-zinc-800 font-black uppercase tracking-[0.5em] opacity-40">
                        Noir.Chat // Sector-7 Secure
                    </p>
                </div>
              </div>
          </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-[380px] flex-col bg-[#070707] p-10 lg:p-12 space-y-12 border-l border-white/[0.03] backdrop-blur-3xl overflow-y-auto scrollbar-hide relative z-20">
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-white/[0.04] to-transparent"></div>
        
        <div className="space-y-10">
          <div className="space-y-4">
             <div className="flex items-center justify-between px-2">
                <h3 className="text-[10px] font-black text-zinc-800 uppercase tracking-[0.6em]">Matrix Address</h3>
                <div className="flex gap-1.5">
                    <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full"></div>
                    <div className="w-1.5 h-1.5 bg-zinc-900 rounded-full animate-pulse shadow-[0_0_8px_white]"></div>
                </div>
             </div>
             <TokenDisplay token={token} />
          </div>

          <div className="p-[0.5px] bg-gradient-to-r from-transparent via-white/[0.05] to-transparent"></div>

          <div className="relative group cursor-default">
             <div className="absolute inset-0 bg-white/[0.01] rounded-[30px] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <div className="relative p-7 rounded-[30px] bg-white/[0.025] border border-white/5 flex items-center gap-6 group hover:border-white/10 transition-all duration-700 shadow-2xl overflow-hidden hover:shadow-[0_0_50px_rgba(255,255,255,0.02)]">
                <div className="absolute inset-0 bg-gradient-to-br from-white/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="w-14 h-14 rounded-[22px] bg-black/60 border border-white/5 flex items-center justify-center text-zinc-700 group-hover:text-white transition-all shadow-inner relative z-10">
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-10"></div>
                    {roomType === 'private' ? <User className="w-6 h-6" /> : <Users className="w-6 h-6" />}
                </div>
                <div className="relative z-10">
                    <p className="text-[15px] font-black uppercase tracking-[0.2em] text-zinc-400 group-hover:text-white transition-all transform group-hover:translate-x-0.5">
                        {roomType === 'private' ? 'Dual Link' : 'Multi Matrix'}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest bg-white/[0.03] px-2 py-0.5 rounded-md border border-white/5">PROTOCOL 1.1</span>
                        <span className="w-1 h-1 bg-white/10 rounded-full"></span>
                        <span className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">{roomType === 'private' ? 'SYNCED' : 'OPEN'}</span>
                    </div>
                </div>
             </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-end space-y-10">
          <div className="space-y-8">
            <div className="flex items-center gap-5 px-2">
               <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-zinc-900"></div>
               <h3 className="text-[10px] font-black text-zinc-900 uppercase tracking-[0.6em] whitespace-nowrap">Core HUD</h3>
               <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-zinc-900"></div>
            </div>
            
            <div className="space-y-4">
               {[
                 { label: 'E2E VOID', desc: 'Ephemeral temporal buffer.', icon: Lock },
                 { label: 'ZERO TRACE', desc: 'Automated session expunging.', icon: Zap }
               ].map((item, idx) => (
                 <div key={idx} className="flex items-start gap-6 p-6 rounded-[30px] bg-white/[0.01] border border-white/5 hover:bg-white/[0.02] transition-all group hover:border-white/10 shadow-inner">
                    <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-zinc-800 mt-0.5 group-hover:text-zinc-600 group-hover:border-white/10 transition-all shadow-inner">
                        <item.icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-1 pt-0.5">
                        <span className="text-zinc-500 font-black uppercase text-[10px] tracking-[0.4em] block transition-colors group-hover:text-zinc-300">{item.label}</span>
                        <p className="text-[13px] text-zinc-700 font-light tracking-wide group-hover:text-zinc-500 transition-colors">{item.desc}</p>
                    </div>
                 </div>
               ))}
            </div>
          </div>

          <div className="p-8 rounded-[40px] bg-gradient-to-br from-white/[0.02] to-transparent border border-white/[0.03] space-y-5 shadow-inner relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <Shield className="w-20 h-20 text-white" />
             </div>
             <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                   <div className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)] animate-pulse"></div>
                   <span className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Matrix Live</span>
                </div>
                <span className="text-[9px] font-mono text-zinc-800 tracking-tighter">SRV-7 // NOIR-AUTH</span>
             </div>
             <p className="text-[11px] text-zinc-600 font-medium leading-relaxed italic opacity-80 relative z-10">
                Encrypted spectral handshake verified. Session is ephemeral and non-persistent.
             </p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default ChatRoom;
