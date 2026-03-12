import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoom, joinRoom } from '../services/api';
import JoinRoomForm from '../components/JoinRoomForm';
import { MessageSquarePlus, LogIn } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('join');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateRoom = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { token } = await createRoom();
      setActiveTab('join');
      alert(`Room created! Your token is: ${token}. Please enter a username to join.`);
    } catch (err) {
      setError('Failed to create room. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async ({ token, username }) => {
    setIsLoading(true);
    setError('');
    try {
      await joinRoom(token, username);
      navigate(`/chat/${token}`, { state: { username } });
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to join room. Check token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="w-full max-w-[420px] premium-glass rounded-[32px] overflow-hidden shadow-2xl">
        <div className="p-10 text-center">
          <div className="w-20 h-20 bg-white rounded-[24px] flex items-center justify-center mx-auto mb-8 shadow-[0_0_40px_rgba(255,255,255,0.1)]">
            <MessageSquarePlus className="w-10 h-10 text-black fill-current" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight mb-3 text-white">NOIR.CHAT</h1>
          <p className="text-zinc-400 text-sm font-light tracking-widest uppercase">Ephemeral & Absolute</p>
        </div>

        <div className="px-10 pb-10">
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
            <div className="text-center py-4">
              <p className="text-zinc-400 mb-10 text-sm leading-relaxed font-light">
                Generate a unique spectral token to initiate a void-encrypted workspace. All traces vanish upon exit.
              </p>
              <button
                onClick={handleCreateRoom}
                disabled={isLoading}
                className="premium-button w-full h-[56px] rounded-2xl flex items-center justify-center space-x-3"
              >
                <div className="w-2 h-2 bg-black rounded-full animate-ping"></div>
                <span>{isLoading ? 'Materializing...' : 'Initialize Session'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <div className="mt-12 text-center opacity-40 hover:opacity-100 transition-opacity duration-700">
        <p className="text-[10px] uppercase tracking-[0.3em] font-medium text-white/60">
          Zero Persistence Architecture &bull; End-to-End Void
        </p>
      </div>
    </div>
  );
};

export default Home;
