import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const createRoom = async (type = 'group') => {
  const response = await apiClient.post('/create-room', { type });
  return response.data;
};

export const joinRoom = async (token, username) => {
  const response = await apiClient.post('/join-room', { token, username });
  return response.data;
};

export const sendMessage = async (token, username, message) => {
  const response = await apiClient.post('/send-message', { token, username, message });
  return response.data;
};

export const getMessages = async (token) => {
  const response = await apiClient.get(`/messages/${token}`);
  return response.data;
};

export const leaveRoom = async (token, username) => {
  const response = await apiClient.post('/leave-room', { token, username });
  return response.data;
};

export const deleteRoom = async (token) => {
  const response = await apiClient.delete(`/room/${token}`);
  return response.data;
};

