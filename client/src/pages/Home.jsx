import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom, joinRoom } from '../services/api';
import JoinRoomForm from '../components/JoinRoomForm';
import { Shield, Zap, Lock, Users, User, ArrowRight, Sparkles } from 'lucide-react';

const Home = () => {
  const [activeTab, setActiveTab] = useState('create');
  const [roomType, setRoomType] = useState('private');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState('');
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    if (!username.trim()) {
      setError('Identity required to initialize.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const { token } = await createRoom(roomType);
      // Wait for join to complete before navigating
      await joinRoom(token, username.trim());
      navigate(`/chat/${token}`, { state: { username: username.trim(), roomType } });
    } catch (err) {
      setError('Matrix initialization failed. Try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async ({ token, username }) => {
    setIsLoading(true);
    setError(null);
    try {
      const { roomType: joinedRoomType } = await joinRoom(token, username);
      navigate(`/chat/${token}`, { state: { username, roomType: joinedRoomType } });
    } catch (err) {
      setError(err.response?.data?.message || 'Spectral link failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden font-outfit">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/[0.02] blur-[120px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/[0.01] blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-[540px] z-10 space-y-12 animate-fade-in font-outfit">
        {/* Branding Area */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md mb-4">
             <Sparkles className="w-3.5 h-3.5 text-zinc-400" />
             <span className="text-[12px] font-black uppercase tracking-[0.3em] text-zinc-500">Noir.Chat Protocol v1.1</span>
          </div>
          <h1 className="text-5xl lg:text-7xl font-black tracking-tighter text-white leading-[0.9]">
            THE <span className="text-zinc-600">VOID</span><br/>BEYOND.
          </h1>
          <p className="text-[16px] lg:text-[18px] text-zinc-500 font-light max-w-[380px] mx-auto leading-relaxed uppercase tracking-widest">
            Ephemeral connectivity. <br/>Absolute spectral link.
          </p>
        </div>

        {/* Matrix Console */}
        <div className="premium-card rounded-[40px] p-2 lg:p-3 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.7)]">
          <div className="bg-black/40 backdrop-blur-xl rounded-[32px] p-8 lg:p-12 space-y-10">
            {/* Control Panel Tabs */}
            <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/5">
              <button
                onClick={() => setActiveTab('create')}
                className={`flex-1 py-4 rounded-xl text-[12px] font-black uppercase tracking-[0.2em] transition-all
                  ${activeTab === 'create' ? 'bg-white text-black shadow-xl scale-[1.02]' : 'text-zinc-500 hover:text-white'}`}
              >
                Genesis
              </button>
              <button
                onClick={() => setActiveTab('join')}
                className={`flex-1 py-4 rounded-xl text-[12px] font-black uppercase tracking-[0.2em] transition-all
                  ${activeTab === 'join' ? 'bg-white text-black shadow-xl scale-[1.02]' : 'text-zinc-500 hover:text-white'}`}
              >
                Sync
              </button>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 px-6 py-4 rounded-2xl text-[13px] text-red-400 font-bold uppercase tracking-widest flex items-center gap-3 italic">
                <Shield className="w-4 h-4" />
                {error}
              </div>
            )}

            {activeTab === 'create' ? (
              <div className="space-y-10 animate-fade-in">
                {/* Room Configuration */}
                <div className="space-y-6">
                  <label className="block text-[12px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-1">
                    Matrix Configuration
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setRoomType('private')}
                      className={`group relative p-6 rounded-[24px] border transition-all text-left overflow-hidden h-[120px] flex flex-col justify-center
                        ${roomType === 'private' ? 'bg-white/5 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'bg-transparent border-white/5 opacity-40 hover:opacity-100'}`}
                    >
                      <User className={`w-5 h-5 mb-2 ${roomType === 'private' ? 'text-white' : 'text-zinc-600'}`} />
                      <p className="text-[12px] font-black uppercase tracking-widest text-white mb-0.5">Dual Link</p>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tight">Private (2 Entities)</p>
                      {roomType === 'private' && <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>}
                    </button>
                    <button
                      onClick={() => setRoomType('group')}
                      className={`group relative p-6 rounded-[24px] border transition-all text-left overflow-hidden h-[120px] flex flex-col justify-center
                        ${roomType === 'group' ? 'bg-white/5 border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.05)]' : 'bg-transparent border-white/5 opacity-40 hover:opacity-100'}`}
                    >
                      <Users className={`w-5 h-5 mb-2 ${roomType === 'group' ? 'text-white' : 'text-zinc-600'}`} />
                      <p className="text-[12px] font-black uppercase tracking-widest text-white mb-0.5">Multi Matrix</p>
                      <p className="text-[10px] text-zinc-500 uppercase font-bold tracking-tight">Open Room</p>
                      {roomType === 'group' && <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_10px_white]"></div>}
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="block text-[12px] font-black text-zinc-500 uppercase tracking-[0.3em] ml-1">
                    Your Identity
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="ENTER ALIAS..."
                    className="premium-input w-full h-[64px] rounded-[24px] px-8 text-white text-lg font-light tracking-widest placeholder:text-zinc-800"
                  />
                </div>

                <button
                  onClick={handleCreateRoom}
                  disabled={isLoading || !username.trim()}
                  className="premium-button w-full h-[64px] rounded-[24px] group flex items-center justify-center gap-3 active:scale-95 shadow-2xl"
                >
                  {isLoading ? (
                    <Zap className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <span>Initialize Link</span>
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="animate-fade-in">
                <JoinRoomForm onJoin={handleJoinRoom} isLoading={isLoading} />
              </div>
            )}
          </div>
        </div>

        {/* Footnotes */}
        <div className="flex flex-col items-center gap-8 pt-8">
            <div className="flex items-center gap-12">
                <div className="flex flex-col items-center gap-3 group cursor-default">
                    <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5 transition-all group-hover:border-white/20 group-hover:bg-white/[0.05] shadow-lg">
                        <Lock className="w-5 h-5 text-zinc-600 group-hover:text-white" />
                    </div>
                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">End-to-End Void</span>
                </div>
                <div className="flex flex-col items-center gap-3 group cursor-default">
                    <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/[0.03] border border-white/5 transition-all group-hover:border-white/20 group-hover:bg-white/[0.05] shadow-lg">
                        <Zap className="w-5 h-5 text-zinc-600 group-hover:text-white" />
                    </div>
                    <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em]">Zero Trace</span>
                </div>
            </div>
            
            <p className="text-[12px] text-zinc-700 font-medium uppercase tracking-[0.5em] text-center max-w-[300px] leading-loose opacity-60">
               Secure ephemeral workspace designed by <br/> <span className="text-zinc-400">Atmospheric Logic</span>
            </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
