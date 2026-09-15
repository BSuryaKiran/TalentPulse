import axios from 'axios';

// Base API client configured for future Spring Boot backend microservices
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to attach JWT token when available
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

// Response interceptor for generic error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Future handler for unauthorized state / token expiration
      localStorage.removeItem('tp_auth_token');
      localStorage.removeItem('tp_user');
    }
    return Promise.reject(error);
  }
);

export default api;

