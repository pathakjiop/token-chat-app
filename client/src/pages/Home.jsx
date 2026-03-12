import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom, joinRoom } from '../services/api';
import JoinRoomForm from '../components/JoinRoomForm';
import { MessageSquarePlus, User, Users } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('join');
  const [roomType, setRoomType] = useState('group'); // 'private' or 'group'
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [creatorName, setCreatorName] = useState('');

  const handleCreateRoom = async () => {
    if (!creatorName.trim()) return;
    
    setIsLoading(true);
    setError('');
    try {
      const { token } = await createRoom(roomType);
      // Directly join the room after creation
      await joinRoom(token, creatorName.trim());
      navigate(`/chat/${token}`, { state: { username: creatorName.trim(), roomType } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to materialize session.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async ({ token, username }) => {
    setIsLoading(true);
    setError('');
    try {
      const data = await joinRoom(token, username);
      navigate(`/chat/${token}`, { state: { username, roomType: data.roomType } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to join room. Check token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in bg-black">
      <div className="w-full max-w-[420px] premium-glass rounded-[32px] overflow-hidden shadow-2xl relative">
        {/* Glow effect */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-white/5 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-[80px]"></div>

        <div className="p-10 text-center relative z-10">
          <div className="w-20 h-20 bg-white rounded-[24px] flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
            <MessageSquarePlus className="w-10 h-10 text-black fill-current" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3 text-white font-outfit uppercase">Noir Chat</h1>
          <p className="text-zinc-400 text-[12px] font-black tracking-[0.3em] uppercase">Ephemeral Void Workspace</p>
        </div>

        <div className="px-10 pb-10 relative z-10">
          <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 mb-8">
            <button
              onClick={() => setActiveTab('join')}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-500 ${
                activeTab === 'join' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'
              }`}
            >
              Join
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all duration-500 ${
                activeTab === 'create' ? 'bg-white text-black shadow-lg' : 'text-zinc-500 hover:text-white'
              }`}
            >
              Genesis
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 text-red-400 text-xs rounded-xl border border-red-500/20 animate-fade-in flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse"></div>
              {error}
            </div>
          )}

          {activeTab === 'join' ? (
            <JoinRoomForm onJoin={handleJoinRoom} isLoading={isLoading} />
          ) : (
            <div className="space-y-6">
              <p className="text-zinc-400 text-[12px] leading-relaxed font-light text-center px-2">
                Establish a unique spectral link. All traces vanish upon exit.
              </p>

              <div className="space-y-4">
                <label className="block text-[12px] font-bold text-zinc-500 uppercase tracking-widest ml-1">
                  Matrix Configuration
                </label>
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => setRoomType('private')}
                        className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 ${
                            roomType === 'private' 
                            ? 'bg-white/10 border-white/40 text-white' 
                            : 'bg-black/20 border-white/5 text-zinc-500 hover:border-white/20'
                        }`}
                    >
                        <User className="w-5 h-5" />
                        <span className="text-[12px] font-bold uppercase tracking-widest">Private</span>
                        <span className="text-[10px] opacity-40 uppercase tracking-tighter">Dual Sync Only</span>
                    </button>
                    <button 
                        onClick={() => setRoomType('group')}
                        className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center gap-2 ${
                            roomType === 'group' 
                            ? 'bg-white/10 border-white/40 text-white' 
                            : 'bg-black/20 border-white/5 text-zinc-500 hover:border-white/20'
                        }`}
                    >
                        <Users className="w-5 h-5" />
                        <span className="text-[12px] font-bold uppercase tracking-widest">Group</span>
                        <span className="text-[10px] opacity-40 uppercase tracking-tighter">Infinite Link</span>
                    </button>
                </div>
              </div>
              
              <div className="group">
                <label className="block text-[12px] font-bold text-zinc-500 mb-2 uppercase tracking-widest ml-1">
                  Genesis Alias
                </label>
                <input
                  type="text"
                  value={creatorName}
                  onChange={(e) => setCreatorName(e.target.value)}
                  placeholder="EX: NEURON"
                  className="premium-input w-full h-[56px] rounded-2xl px-6 text-zinc-300 placeholder:text-zinc-700 font-light"
                />
              </div>

              <button
                onClick={handleCreateRoom}
                disabled={isLoading || !creatorName.trim()}
                className="premium-button w-full h-[56px] rounded-2xl flex items-center justify-center space-x-3 text-[13px] uppercase tracking-[0.2em] font-bold"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-1 bg-black rounded-full animate-bounce"></div>
                    <div className="w-1 h-1 bg-black rounded-full animate-bounce [animation-delay:-.3s]"></div>
                    <div className="w-1 h-1 bg-black rounded-full animate-bounce [animation-delay:-.5s]"></div>
                  </div>
                ) : (
                  <>
                    <div className="w-2 h-2 bg-black rounded-full animate-ping"></div>
                    <span>Initialize Session</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-12 text-center opacity-40 hover:opacity-100 transition-opacity duration-700">
        <p className="text-[12px] uppercase tracking-[0.3em] font-medium text-white/60">
          Zero Persistence Architecture &bull; End-to-End Void
        </p>
      </div>
    </div>
  );
};

export default Home;

