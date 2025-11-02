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

// Request interceptor to include credentials with every request
apiClient.interceptors.request.use(
  (config) => {
    // Add any custom headers here if needed
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors globally
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      // If this is a failed auth check, redirect to login
      if (originalRequest.url.includes('/auth/user')) {
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
      
      // For other 401 errors, try to refresh the token or redirect to login
      try {
        // Try to refresh the session
        await axios.get(`${API_URL}/auth/refresh`, { withCredentials: true });
        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, redirect to login
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      }
    }
    
    // For other errors, just reject
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  getCurrentUser: () => apiClient.get('/auth/user'),
  loginWithGoogle: () => window.location.href = `${API_URL}/auth/google`,
  loginWithGithub: () => window.location.href = `${API_URL}/auth/github`,
  logout: () => apiClient.post('/auth/logout'),
};

export const searchAPI = {
  getTopSearches: () => apiClient.get('/top-searches'),
  searchImages: (term) => apiClient.post('/search', { term }),
  getHistory: () => apiClient.get('/history'),
};

export default apiClient;