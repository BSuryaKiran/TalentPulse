import axios from 'axios';

// Base API client configured for Spring Boot Auth & Microservices (or API Gateway)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to automatically attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('tp_auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for unauthorized handling and token cleanup
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear stored authentication info on token expiration / unauthorized status
      localStorage.removeItem('tp_auth_token');
      localStorage.removeItem('tp_user');
    }
    return Promise.reject(error);
  }
);

export default api;
