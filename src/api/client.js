import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://image-serach-app-backend.vercel.app/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important: This is required for cookies to be sent cross-origin
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add a request interceptor to include credentials with every request
apiClient.interceptors.request.use(
  (config) => {
    // You can add auth headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle session expiration or unauthorized access
    if (error.response && error.response.status === 401) {
      // Redirect to login or handle unauthorized access
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API endpoints
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