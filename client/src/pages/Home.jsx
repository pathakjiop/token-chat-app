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
      // Auto join creator as 'Host' or prompt them for a name?
      // Prompting for a name is better. Let's switch to join tab and set the token.
      setActiveTab('join');
      // Pass the generated token to the input by using a ref or state
      // Actually simpler: just give them the token and let them choose a username.
      alert(`Room created! Your token is: ${token}. Please enter a username to join.`);
      // We could use an event or state to fill the token field, but for simplicity:
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
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-blue-600 p-8 text-center text-white">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
            <MessageSquarePlus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Temp Chat</h1>
          <p className="text-blue-100 text-sm font-medium">Secure, temporary, history-free</p>
        </div>

        <div className="p-6">
          <div className="flex space-x-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('join')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'join' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Join Room
            </button>
            <button
              onClick={() => setActiveTab('create')}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'create' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Create Room
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {error}
            </div>
          )}

          {activeTab === 'join' ? (
            <JoinRoomForm onJoin={handleJoinRoom} isLoading={isLoading} />
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-6 leading-relaxed">
                Generate a secure, random token to start a new private chat session. Hand this token to your peer.
              </p>
              <button
                onClick={handleCreateRoom}
                disabled={isLoading}
                className="w-full justify-center text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3.5 text-center transition-colors disabled:opacity-50 flex items-center space-x-2"
              >
                <span>{isLoading ? 'Creating...' : 'Generate New Room'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      <p className="mt-8 text-center text-gray-400 text-sm">
        Rooms and messages are deleted when the session ends.
      </p>
    </div>
  );
};

export default Home;
