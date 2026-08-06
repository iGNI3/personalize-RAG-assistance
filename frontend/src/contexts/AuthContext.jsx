import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api/client';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const userData = await api.getMe();
        setUser(userData);
      } catch (err) {
        console.error("Auth check failed", err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [token]);

  const login = async (username, password) => {
    const data = await api.login(username, password);
    localStorage.setItem('access_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  };

  const register = async ({ username, email, fullName, password, role = 'analyst' }) => {
    const data = await api.register({ username, email, full_name: fullName, password, role });
    localStorage.setItem('access_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  };

  const loginWithGoogle = async ({ email, fullName, googleToken = null }) => {
    const data = await api.googleLogin({ email, full_name: fullName, google_token: googleToken });
    localStorage.setItem('access_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  };

  const loginAsGuest = async () => {
    const data = await api.guestLogin();
    localStorage.setItem('access_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
  };

  const isGuest = !!user && (user.is_guest || user.role === 'guest');

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user && !!token,
      isGuest,
      loading,
      login,
      register,
      loginWithGoogle,
      loginAsGuest,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
