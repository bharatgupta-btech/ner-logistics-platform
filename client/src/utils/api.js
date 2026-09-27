import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ner-logistics-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getDistricts = async () => {
  try {
    const res = await api.get('/districts');
    return res.data;
  } catch (err) {
    console.error('Error fetching districts:', err);
    return [];
  }
};

export const getVehicles = async () => {
  try {
    const res = await api.get('/vehicles');
    return res.data;
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    return [];
  }
};

export const getRoutes = async () => {
  try {
    const res = await api.get('/routes');
    return res.data;
  } catch (err) {
    console.error('Error fetching routes:', err);
    return [];
  }
};

export const getAnalytics = async () => {
  try {
    const res = await api.get('/analytics');
    return res.data;
  } catch (err) {
    console.error('Error fetching analytics:', err);
    return {};
  }
};

export const createAlert = async (data) => {
  try {
    const res = await api.post('/alerts', data);
    return res.data;
  } catch (err) {
    console.error('Error creating alert:', err);
    throw err;
  }
};

export const fetchAlerts = async () => {
  try {
    const res = await api.get('/alerts');
    return res.data;
  } catch (err) {
    console.error('Error fetching alerts:', err);
    return [];
  }
};

export default api;
