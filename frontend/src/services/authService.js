import api from './api';

export const authService = {
  /**
   * Register a new user (JOB_SEEKER or RECRUITER)
   * @param {Object} credentials - { fullName, email, password, role }
   */
  async register(credentials) {
    const response = await api.post('/auth/register', {
      fullName: credentials.fullName,
      email: credentials.email,
      password: credentials.password,
      role: credentials.role,
    });
    return response.data;
  },

  /**
   * Authenticate user credentials and retrieve JWT token
   * @param {Object} credentials - { email, password }
   */
  async login(credentials) {
    const response = await api.post('/auth/login', {
      email: credentials.email,
      password: credentials.password,
    });
    return response.data;
  },

  /**
   * Get currently authenticated user details from backend
   */
  async getCurrentUser() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  /**
   * Clear client authentication session
   */
  logout() {
    localStorage.removeItem('tp_auth_token');
    localStorage.removeItem('tp_user');
  },
};

export default authService;
