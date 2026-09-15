import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import authService from '../services/authService';

export const AuthProvider = ({ children }) => {
  // Lazy state initialization from localStorage
  // BUT: demo tokens (prefixed 'demo-') are session-only — don't restore on reload
  const [user, setUser] = useState(() => {
    try {
      const token = localStorage.getItem('tp_auth_token');
      // If the stored token is a demo token, clear it — don't restore across page reloads
      if (token && token.startsWith('demo-')) {
        localStorage.removeItem('tp_auth_token');
        localStorage.removeItem('tp_user');
        return null;
      }
      const storedUser = localStorage.getItem('tp_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error('Failed to parse stored auth user:', e);
      return null;
    }
  });

  const [loading, setLoading] = useState(() => {
    const token = localStorage.getItem('tp_auth_token');
    // Only show loading spinner if a real (non-demo) token exists
    return Boolean(token && !token.startsWith('demo-'));
  });

  // Validate stored real token on app startup
  useEffect(() => {
    const token = localStorage.getItem('tp_auth_token');
    if (token && !token.startsWith('demo-')) {
      authService
        .getCurrentUser()
        .then((userData) => {
          const formattedUser = {
            id: userData.userId,
            name: userData.fullName,
            email: userData.email,
            role: userData.role,
          };
          setUser(formattedUser);
          localStorage.setItem('tp_user', JSON.stringify(formattedUser));
        })
        .catch((err) => {
          console.warn('Failed to restore authentication session:', err);
          authService.logout();
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, []);

  const login = async (email, password) => {
    const response = await authService.login({ email, password });

    const authUser = {
      id: response.userId,
      name: response.fullName,
      email: response.email,
      role: response.role,
    };

    localStorage.setItem('tp_auth_token', response.token);
    localStorage.setItem('tp_user', JSON.stringify(authUser));

    setUser(authUser);
    return authUser;
  };

  const register = async (fullName, email, password, role) => {
    const response = await authService.register({
      fullName,
      email,
      password,
      role,
    });

    const authUser = {
      id: response.userId,
      name: response.fullName,
      email: response.email,
      role: response.role,
    };

    if (response.token) {
      localStorage.setItem('tp_auth_token', response.token);
      localStorage.setItem('tp_user', JSON.stringify(authUser));
      setUser(authUser);
    }

    return authUser;
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      if (!prev) return prev;
      const updated = { ...prev, ...updatedFields };
      try {
        localStorage.setItem('tp_user', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to update tp_user in localStorage:', e);
      }
      return updated;
    });
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    loading,
    login,
    register,
    updateUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
