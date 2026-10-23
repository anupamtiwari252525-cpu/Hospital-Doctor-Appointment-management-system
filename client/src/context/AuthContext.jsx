import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('medi_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const res = await authAPI.getMe();
          if (res.success) {
            setUser(res.user);
          }
        } catch (err) {
          console.warn('Session expired or invalid token:', err.message);
          logout();
        }
      }
      setLoading(false);
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const res = await authAPI.login({ email, password });
    if (res.success) {
      localStorage.setItem('medi_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res;
    }
  };

  const register = async (userData) => {
    const res = await authAPI.register(userData);
    if (res.success) {
      localStorage.setItem('medi_token', res.token);
      setToken(res.token);
      setUser(res.user);
      return res;
    }
  };

  const logout = () => {
    localStorage.removeItem('medi_token');
    setToken(null);
    setUser(null);
  };

  // Quick 1-Click Demo Login Helper
  const quickDemoLogin = async (role) => {
    const creds = {
      patient: { email: 'patient@hospital.com', password: 'patient123' },
      doctor: { email: 'doctor@hospital.com', password: 'doctor123' },
      admin: { email: 'admin@hospital.com', password: 'admin123' },
    };

    if (creds[role]) {
      return await login(creds[role].email, creds[role].password);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        quickDemoLogin,
        isAuthenticated: !!user,
        isPatient: user?.role === 'patient',
        isDoctor: user?.role === 'doctor',
        isAdmin: user?.role === 'admin',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
