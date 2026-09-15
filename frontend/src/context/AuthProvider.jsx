import { useState } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  // Lazy state initialization from localStorage to avoid set-state-in-effect
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem('tp_user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (e) {
      console.error('Failed to parse stored auth user:', e);
      return null;
    }
  });

  const [loading] = useState(false);

  // Mock login handler for Phase 1 UI prototyping
  const login = async (email, password, role = 'JOB_SEEKER') => {
    const mockUser = {
      id: 'usr_' + Date.now(),
      email: email.toLowerCase().trim(),
      name: email.split('@')[0].replace('.', ' '),
      role: role.toUpperCase(), // 'JOB_SEEKER', 'RECRUITER', or 'ADMIN'
    };

    setUser(mockUser);
    localStorage.setItem('tp_user', JSON.stringify(mockUser));
    return mockUser;
  };

  // Mock register handler
  const register = async (name, email, role) => {
    const mockUser = {
      id: 'usr_' + Date.now(),
      email: email.toLowerCase().trim(),
      name: name.trim(),
      role: role.toUpperCase(), // 'JOB_SEEKER' or 'RECRUITER'
    };

    setUser(mockUser);
    localStorage.setItem('tp_user', JSON.stringify(mockUser));
    return mockUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tp_user');
    localStorage.removeItem('tp_auth_token');
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

