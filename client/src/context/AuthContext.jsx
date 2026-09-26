import React, { createContext, useState, useEffect, useContext } from 'react';
import * as api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const DEFAULT_OFFICER_PROFILE = {
  name: 'Debashis Sharma',
  role: 'Regional Logistics Commander',
  designation: 'Director of North East Logistics & Disaster Transport',
  email: 'debashis.sharma@ner-logistics.gov.in',
  phone: '+91 94350 88990',
  department: 'Ministry of DoNER / Strategic Transport Command',
  officerId: 'NER-CMD-2026-904',
  jurisdiction: 'All 8 North Eastern States',
  station: 'Guwahati Regional Command Hub',
  clearanceLevel: 'Level 4 — Executive Command',
  theme: 'light',
  telemetryInterval: 5,
  soundAlerts: true,
  smsAlerts: true,
  avatarColor: 'indigo'
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token') || 'ner_auth_token_active');
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('ner_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_OFFICER_PROFILE;
    } catch {
      return DEFAULT_OFFICER_PROFILE;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', 'ner_auth_token_active');
      setToken('ner_auth_token_active');
    }
  }, []);

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const updated = { ...prev, ...updatedFields };
      try {
        localStorage.setItem('ner_user_profile', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save profile to localStorage:', err);
      }
      return updated;
    });
  };

  const login = async (username, password) => {
    try {
      const mockToken = 'mock_jwt_token_' + Date.now();
      localStorage.setItem('token', mockToken);
      setToken(mockToken);
      const updated = {
        ...DEFAULT_OFFICER_PROFILE,
        name: username || 'Debashis Sharma'
      };
      updateUser(updated);
      return true;
    } catch (error) {
      console.error('Login failed', error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated: !!token, 
      login, 
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
