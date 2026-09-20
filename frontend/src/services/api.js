import axios from 'axios';

// Central API Gateway Entry Point (Port 8080)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

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

/**
 * Formats API errors into clean, user-friendly messages
 */
export const formatApiError = (error, defaultMessage = 'An unexpected error occurred.') => {
  if (!error) return defaultMessage;

  // Network / Connection Error (e.g. backend or gateway is offline)
  if (!error.response || error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
    return 'Unable to connect to the server. Please ensure the API Gateway and microservices are running.';
  }

  const status = error.response.status;
  const data = error.response.data;

  if (status === 400) {
    if (data?.fieldErrors && typeof data.fieldErrors === 'object') {
      const firstFieldErr = Object.values(data.fieldErrors)[0];
      if (firstFieldErr) return firstFieldErr;
    }
    return data?.message || 'Invalid input data provided. Please check your submission.';
  }

  if (status === 401) {
    return 'Your session has expired. Please sign in again.';
  }

  if (status === 403) {
    return 'You are not authorized to perform this action.';
  }

  if (status === 404) {
    return data?.message || 'The requested resource was not found.';
  }

  if (status === 409) {
    return data?.message || 'This action conflicts with existing data (e.g. duplicate application).';
  }

  if (status === 500) {
    return 'Something went wrong on the server. Please try again later.';
  }

  return data?.message || error.message || defaultMessage;
};

export default api;

