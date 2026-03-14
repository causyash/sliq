import axios from 'axios';

const socketUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001';
const API = axios.create({
  baseURL: `${socketUrl}/api`,
});

// Add a request interceptor to include JWT token
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  login: (data) => API.post('/auth/login', data),
  signup: (data) => API.post('/auth/signup', data),
  getMe: () => API.get('/auth/me'),
};

export const workspaceAPI = {
  getAll: () => API.get('/workspaces'),
  getById: (id) => API.get(`/workspaces/${id}`),
  create: (data) => API.post('/workspaces', data),
  invite: (id, email) => API.post(`/workspaces/${id}/invite`, { email }),
};

export const projectAPI = {
  getByWorkspace: (workspaceId) => API.get(`/projects/workspace/${workspaceId}`),
  getById: (id) => API.get(`/projects/${id}`),
  create: (data) => API.post('/projects', data),
  update: (id, data) => API.put(`/projects/${id}`, data),
  delete: (id) => API.delete(`/projects/${id}`),
};

export const taskAPI = {
  getByProject: (projectId) => API.get(`/tasks/project/${projectId}`),
  getById: (id) => API.get(`/tasks/${id}`),
  create: (data) => API.post('/tasks', data),
  update: (id, data) => API.put(`/tasks/${id}`, data),
  delete: (id) => API.delete(`/tasks/${id}`),
};

export const commentAPI = {
  getByTask: (taskId) => API.get(`/comments/${taskId}`),
  create: (data) => API.post('/comments', data),
};

export const analyticsAPI = {
  getWorkspace: (id) => API.get(`/analytics/workspace/${id}`),
};

export const notificationAPI = {
  getAll: () => API.get('/notifications'),
  getUnread: () => API.get('/notifications/unread'),
  markRead: (id) => API.put(`/notifications/${id}/read`),
};

export const activityAPI = {
  getByProject: (projectId) => API.get(`/activity/project/${projectId}`),
};

export default API;
