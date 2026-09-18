import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('skillforge_token') || localStorage.getItem('edupulse_token'));
  const [isLoading, setIsLoading] = useState(true);
  const { addToast } = useToast();

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await api.getMe();
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          logout();
        }
      } catch (error) {
        console.error('Failed to authenticate token:', error);
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await api.login({ email, password });
      if (response.success) {
        localStorage.setItem('skillforge_token', response.token);
        setToken(response.token);
        setUser(response.user);
        addToast(`Welcome back, ${response.user.name}!`, 'success');
        return response;
      }
    } catch (error) {
      addToast(error.message || 'Login failed', 'error');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.register(userData);
      if (response.success) {
        localStorage.setItem('skillforge_token', response.token);
        setToken(response.token);
        setUser(response.user);
        addToast(`Welcome to SkillForge, ${response.user.name}!`, 'success');
        return response;
      }
    } catch (error) {
      addToast(error.message || 'Registration failed', 'error');
      throw error;
    }
  };

  const demoLogin = async (role = 'student') => {
    const credentials = {
      student: { email: 'student@skillforge.com', password: 'password123' },
      instructor: { email: 'instructor@skillforge.com', password: 'password123' },
      admin: { email: 'admin@skillforge.com', password: 'password123' },
    };

    const target = credentials[role] || credentials.student;
    return await login(target.email, target.password);
  };

  const logout = () => {
    localStorage.removeItem('skillforge_token');
    localStorage.removeItem('edupulse_token');
    setToken(null);
    setUser(null);
    addToast('You have been logged out.', 'info');
  };

  const updateUserProfile = async (profileData) => {
    try {
      const response = await api.updateProfile(profileData);
      if (response.success) {
        setUser(response.user);
        addToast('Profile updated successfully!', 'success');
        return response.user;
      }
    } catch (error) {
      addToast(error.message || 'Failed to update profile', 'error');
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        demoLogin,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
