import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// User APIs
export const userAPI = {
  getAllUsers: () => apiClient.get('/users'),
  getUserById: (id) => apiClient.get(`/users/${id}`),
  createUser: (userData) => apiClient.post('/users', userData),
  updateUser: (id, userData) => apiClient.put(`/users/${id}`, userData),
  deleteUser: (id) => apiClient.delete(`/users/${id}`),
  getUserStats: () => apiClient.get('/users/stats'),
  seedDemoData: () => apiClient.post('/users/seed-demo'),
};

// Documentation APIs
export const documentationAPI = {
  getAllDocumentation: () => apiClient.get('/documentation'),
  getDocumentationByType: (type) => apiClient.get(`/documentation/${type}`),
  seedDocumentation: () => apiClient.post('/documentation/seed'),
};

export default apiClient;
