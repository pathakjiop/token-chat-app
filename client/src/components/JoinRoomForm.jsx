import React, { useState } from 'react';
import { ArrowRight, Terminal } from 'lucide-react';

const JoinRoomForm = ({ onJoin, isLoading }) => {
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (token.trim() && username.trim()) {
      onJoin({ token: token.trim().toUpperCase(), username: username.trim() });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-10 animate-fade-in">
      <div className="space-y-8">
        <div className="group space-y-4">
          <label htmlFor="token" className="block text-[12px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">
            Link Sync Code
          </label>
          <div className="relative">
             <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-800">
                <Terminal className="w-4 h-4" />
             </div>
             <input
                id="token"
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="— — — — — —"
                className="premium-input w-full h-[64px] rounded-[24px] pl-14 pr-8 text-xl font-mono uppercase tracking-[0.3em] placeholder:text-zinc-900"
                required
             />
          </div>
        </div>

        <div className="group space-y-4">
          <label htmlFor="username" className="block text-[12px] font-black text-zinc-600 uppercase tracking-[0.3em] ml-1">
            Identity Signature
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ENTER ALIAS..."
            className="premium-input w-full h-[64px] rounded-[24px] px-8 text-white text-lg font-light tracking-widest placeholder:text-zinc-900"
            required
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !token.trim() || !username.trim()}
        className="premium-button w-full h-[64px] rounded-[24px] group flex items-center justify-center gap-3 active:scale-95 shadow-2xl mt-4"
      >
        {isLoading ? (
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce"></div>
            <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-1.5 h-1.5 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
          </div>
        ) : (
          <>
            <span>Establish Link</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </>
        )}
      </button>
    </form>
  );
};

export default JoinRoomForm;

