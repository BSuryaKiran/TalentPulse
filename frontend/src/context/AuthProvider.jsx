import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import authService from '../services/authService';

export const AuthProvider = ({ children }) => {
  // Lazy state initialization from localStorage
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('tp_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error('Failed to parse stored auth user:', e);
      return null;
    }
  });

  const [loading, setLoading] = useState(() => {
    return Boolean(localStorage.getItem('tp_auth_token'));
  });

  // Validate stored token on app startup if present
  useEffect(() => {
    const token = localStorage.getItem('tp_auth_token');
    if (token) {
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
  }, []); // Run once on startup

  // Real login handler calling Auth Service API
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

  // Real register handler calling Auth Service API
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

  // Real logout handler
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
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
