import axios from 'axios';
import useAuthStore from '../store/useAuthStore';

// We rely on the proxy in vite.config.js for '/api'
const api = axios.create({
  baseURL: import.meta.env.VITE_BASEURL + '/api',
});

// Request interceptor for adding the bearer token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling 401s (token expiry)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Exclude auth endpoints from forcing a reload so frontend can show UI errors
      if (error.config && !error.config.url.includes('/auth/login') && !error.config.url.includes('/auth/register')) {
        useAuthStore.getState().logout();
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
