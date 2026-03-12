import React, { useState } from 'react';

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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="group">
          <label htmlFor="token" className="block text-[12px] font-bold text-zinc-500 mb-2 uppercase tracking-widest ml-1">
            Access Token
          </label>
          <input
            id="token"
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="— — — — — —"
            className="premium-input w-full h-[56px] rounded-2xl px-6 text-lg font-mono uppercase tracking-[0.2em] placeholder:text-zinc-700"
            required
          />
        </div>
        <div className="group">
          <label htmlFor="username" className="block text-[12px] font-bold text-zinc-500 mb-2 uppercase tracking-widest ml-1">
            Identity
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ALIAS"
            className="premium-input w-full h-[56px] rounded-2xl px-6 text-zinc-300 placeholder:text-zinc-700 font-light"
            required
          />
        </div>
      </div>
      <button
        type="submit"
        disabled={isLoading || !token.trim() || !username.trim()}
        className="premium-button w-full h-[56px] rounded-2xl text-[13px] uppercase tracking-[0.2em] font-bold mt-4"
      >
        {isLoading ? 'Decrypting...' : 'Enter the Void'}
      </button>
    </form>
  );
};

export default JoinRoomForm;
