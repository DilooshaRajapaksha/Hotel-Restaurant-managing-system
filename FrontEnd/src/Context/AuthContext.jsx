import React, { createContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    const customerToken = localStorage.getItem('customerToken');
    const savedUser = localStorage.getItem('user');

    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      setUser(parsedUser);

      const currentPath = location.pathname;

      if (adminToken && parsedUser.role?.toUpperCase() === 'ADMIN') {
        if (!currentPath.startsWith('/admin')) {
          navigate('/admin', { replace: true });
        }
      } else if (customerToken && parsedUser.role?.toUpperCase() === 'CUSTOMER') {
        if (currentPath.includes('login') || currentPath.includes('signin')) {
          navigate('/', { replace: true });
        }
      }
    }
  }, [navigate, location.pathname]);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const updateUser = (updates) => {
    setUser((prev) => {
      const next = { ...prev, ...updates };
      localStorage.setItem('user', JSON.stringify(next));
      return next;
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adminToken');
    localStorage.removeItem('customerToken');
    localStorage.removeItem('user');
    navigate('/signin');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};











