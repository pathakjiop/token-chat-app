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
    <div className="min-h-screen bg-[#050504] flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-hidden font-outfit">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white/[0.02] blur-[140px] rounded-full animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/[0.01] blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Main Grid Layout */}
      <div className="w-full max-w-[1400px] z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center animate-fade-in">
        
        {/* LEFT COLUMN: Branding */}
        <div className="lg:col-span-3 space-y-8 lg:text-left text-center">
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/[0.03] border border-white/5 backdrop-blur-md mb-2">
                <Sparkles className="w-3.5 h-3.5 text-zinc-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-500">Noir.Chat Protocol v1.1</span>
            </div>
            <div className="space-y-2">
                <h1 className="text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[0.85]">
                    THE <br/> <span className="text-zinc-700">VOID</span> <br/> BEYOND.
                </h1>
            </div>
            <div className="space-y-4 pt-4">
                <p className="text-[14px] text-zinc-500 font-light uppercase tracking-[0.3em] leading-relaxed">
                    Ephemeral connectivity. <br/>
                    <span className="text-zinc-300">Absolute spectral link.</span>
                </p>
                <div className="w-12 h-[1px] bg-zinc-800 mx-auto lg:mx-0"></div>
            </div>
        </div>

        {/* MIDDLE COLUMN: Matrix Console (Form) */}
        <div className="lg:col-span-6 flex justify-center order-first lg:order-none">
            <div className="w-full max-w-[540px] premium-card rounded-[45px] p-2 lg:p-3 shadow-[0_40px_100px_-20px_rgba(0,0,0,1)]">
                <div className="bg-black/40 backdrop-blur-3xl rounded-[38px] p-8 lg:p-14 space-y-12">
                    {/* Console Tabs */}
                    <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/5">
                        <button
                            onClick={() => setActiveTab('create')}
                            className={`flex-1 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.25em] transition-all
                            ${activeTab === 'create' ? 'bg-white text-black shadow-2xl scale-[1.02]' : 'text-zinc-600 hover:text-white'}`}
                        >
                            Genesis
                        </button>
                        <button
                            onClick={() => setActiveTab('join')}
                            className={`flex-1 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.25em] transition-all
                            ${activeTab === 'join' ? 'bg-white text-black shadow-2xl scale-[1.02]' : 'text-zinc-600 hover:text-white'}`}
                        >
                            Sync
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-500/5 border border-red-500/20 px-6 py-4 rounded-2xl text-[12px] text-red-400 font-bold uppercase tracking-widest flex items-center gap-3 animate-fade-in italic">
                            <Shield className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    {activeTab === 'create' ? (
                        <div className="space-y-10">
                            {/* Room Configuration */}
                            <div className="space-y-6">
                                <label className="block text-[11px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-2">
                                    Matrix Configuration
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setRoomType('private')}
                                        className={`group relative p-6 rounded-[28px] border transition-all text-left overflow-hidden h-[130px] flex flex-col justify-center
                                            ${roomType === 'private' ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5 opacity-30 hover:opacity-100 hover:bg-white/[0.02]'}`}
                                    >
                                        <User className={`w-5 h-5 mb-3 ${roomType === 'private' ? 'text-white' : 'text-zinc-600'}`} />
                                        <p className="text-[12px] font-black uppercase tracking-widest text-white mb-0.5">Dual Link</p>
                                        <p className="text-[10px] text-zinc-600 uppercase font-black tracking-tight">Restricted</p>
                                        {roomType === 'private' && <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_15px_white]"></div>}
                                    </button>
                                    <button
                                        onClick={() => setRoomType('group')}
                                        className={`group relative p-6 rounded-[28px] border transition-all text-left overflow-hidden h-[130px] flex flex-col justify-center
                                            ${roomType === 'group' ? 'bg-white/5 border-white/20' : 'bg-transparent border-white/5 opacity-30 hover:opacity-100 hover:bg-white/[0.02]'}`}
                                    >
                                        <Users className={`w-5 h-5 mb-3 ${roomType === 'group' ? 'text-white' : 'text-zinc-600'}`} />
                                        <p className="text-[12px] font-black uppercase tracking-widest text-white mb-0.5">Multi Matrix</p>
                                        <p className="text-[10px] text-zinc-600 uppercase font-black tracking-tight">Unrestricted</p>
                                        {roomType === 'group' && <div className="absolute top-4 right-4 w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_15px_white]"></div>}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <label className="block text-[11px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-2">
                                    Your Identity
                                </label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        placeholder="ENTER ALIAS..."
                                        className="premium-input w-full h-[70px] rounded-[28px] px-10 text-white text-lg font-light tracking-[0.2em] placeholder:text-zinc-800 bg-white/[0.02] border-white/5 focus:border-white/20 transition-all"
                                    />
                                    <div className="absolute left-0 bottom-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
                                </div>
                            </div>

                            <button
                                onClick={handleCreateRoom}
                                disabled={isLoading || !username.trim()}
                                className="premium-button w-full h-[70px] rounded-[28px] group flex items-center justify-center gap-4 active:scale-[0.97] shadow-3xl disabled:grayscale"
                            >
                                {isLoading ? (
                                    <Zap className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>
                                        <span className="text-[13px]">Initialize Link</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
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
        </div>

        {/* RIGHT COLUMN: Protocols */}
        <div className="lg:col-span-3 space-y-12 lg:text-right text-center flex flex-col items-center lg:items-end">
            <div className="space-y-10">
                <div className="flex flex-col items-center lg:items-end gap-3 group cursor-default">
                    <div className="w-14 h-14 flex items-center justify-center rounded-[22px] bg-white/[0.03] border border-white/5 transition-all group-hover:border-white/30 group-hover:bg-white/[0.08] shadow-2xl">
                        <Lock className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                    <div className="space-y-1">
                        <span className="block text-[11px] text-zinc-300 font-black uppercase tracking-[0.4em]">End-to-End Void</span>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">No central storage</p>
                    </div>
                </div>

                <div className="flex flex-col items-center lg:items-end gap-3 group cursor-default">
                    <div className="w-14 h-14 flex items-center justify-center rounded-[22px] bg-white/[0.03] border border-white/5 transition-all group-hover:border-white/30 group-hover:bg-white/[0.08] shadow-2xl">
                        <Zap className="w-6 h-6 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                    <div className="space-y-1">
                        <span className="block text-[11px] text-zinc-300 font-black uppercase tracking-[0.4em]">Zero Trace</span>
                        <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tight">Session purging</p>
                    </div>
                </div>
            </div>
            
            <div className="pt-8 lg:pt-16 border-t border-white/5 w-48 text-center lg:text-right">
                <p className="text-[11px] text-zinc-700 font-black uppercase tracking-[0.5em] leading-loose">
                   SECURE EPHEMERAL <br/> 
                   <span className="text-zinc-800">WORKSPACE SYSTEM</span>
                </p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
