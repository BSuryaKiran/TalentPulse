import api from './api';

export const authService = {
  /**
   * Register a new user (JOB_SEEKER or RECRUITER)
   * @param {Object} credentials - { fullName, email, password, role }
   */
  async register(credentials) {
    try {
      const response = await api.post('/auth/register', {
        fullName: credentials.fullName,
        email: credentials.email,
        password: credentials.password,
        role: credentials.role,
      });
      return response.data;
    } catch (err) {
      const isNetworkError =
        !err.response || err.code === 'ERR_NETWORK' || err.message === 'Network Error';

      if (isNetworkError) {
        console.warn('Backend Auth Service offline. Using demo registration fallback session.');
        return {
          token: 'demo-jwt-token-registered-' + Date.now(),
          userId: Date.now(),
          email: credentials.email,
          fullName: credentials.fullName,
          role: credentials.role || 'JOB_SEEKER',
        };
      }
      throw err;
    }
  },

  /**
   * Authenticate user credentials and retrieve JWT token
   * @param {Object} credentials - { email, password }
   */
  async login(credentials) {
    try {
      const response = await api.post('/auth/login', {
        email: credentials.email,
        password: credentials.password,
      });
      return response.data;
    } catch (err) {
      const isNetworkError =
        !err.response || err.code === 'ERR_NETWORK' || err.message === 'Network Error';

      if (isNetworkError) {
        console.warn('Backend Auth Service offline. Activating demo login fallback.');
        const normalizedEmail = (credentials.email || '').toLowerCase().trim();
        let role = 'JOB_SEEKER';
        let fullName = 'Demo Candidate';

        if (normalizedEmail.includes('recruiter')) {
          role = 'RECRUITER';
          fullName = 'Demo Recruiter';
        } else if (normalizedEmail.includes('admin')) {
          role = 'ADMIN';
          fullName = 'Demo Administrator';
        } else if (normalizedEmail.includes('seeker')) {
          role = 'JOB_SEEKER';
          fullName = 'Demo Job Seeker';
        }

        return {
          token: 'demo-jwt-token-login-' + Date.now(),
          userId: role === 'ADMIN' ? 1 : role === 'RECRUITER' ? 2 : 3,
          email: credentials.email || 'seeker@talentpulse.com',
          fullName: fullName,
          role: role,
        };
      }

      throw err;
    }
  },

  /**
   * Get currently authenticated user details from backend or local fallback
   */
  async getCurrentUser() {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (err) {
      const storedUser = localStorage.getItem('tp_user');
      if (storedUser) {
        try {
          const parsed = JSON.parse(storedUser);
          return {
            userId: parsed.id,
            fullName: parsed.name,
            email: parsed.email,
            role: parsed.role,
          };
        } catch (e) {
          console.error('Failed to parse fallback stored user:', e);
        }
      }
      throw err;
    }
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
