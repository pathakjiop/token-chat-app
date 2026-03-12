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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-1">
          Room Token
        </label>
        <input
          id="token"
          type="text"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="e.g. AB12CD"
          className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block px-4 py-3 uppercase tracking-wider transition-colors"
          required
        />
      </div>
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Choose a display name"
          className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block px-4 py-3 transition-colors"
          required
        />
      </div>
      <button
        type="submit"
        disabled={isLoading || !token.trim() || !username.trim()}
        className="w-full justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3.5 text-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Joining...' : 'Join Room'}
      </button>
    </form>
  );
};

export default JoinRoomForm;
