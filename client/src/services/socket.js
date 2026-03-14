import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001');

export const joinWorkspace = (workspaceId) => {
  socket.emit('join_workspace', workspaceId);
};

export const joinProject = (projectId) => {
  socket.emit('join_project', projectId);
};

export const joinUser = (userId) => {
  socket.emit('join_user', userId);
};

export default socket;
