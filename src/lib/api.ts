import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://faunagram-api-express.vercel.app/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Add auth token to requests if available
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't redirect on login/signup 401 errors - let the component handle them
    const isAuthEndpoint = error.config?.url?.includes('/login') || error.config?.url?.includes('/users');
    
    if (error.response?.status === 401 && !isAuthEndpoint) {
      // Only redirect if it's not an auth endpoint and user has a token
      const token = localStorage.getItem('token');
      if (token) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

