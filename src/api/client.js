import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://image-serach-app-backend.vercel.app/api';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const authAPI = {
  getCurrentUser: () => apiClient.get('/auth/user'),
  logout: () => apiClient.post('/auth/logout'),
};

export const searchAPI = {
  getTopSearches: () => apiClient.get('/top-searches'),
  searchImages: (term) => apiClient.post('/search', { term }),
  getHistory: () => apiClient.get('/history'),
};


export default apiClient;