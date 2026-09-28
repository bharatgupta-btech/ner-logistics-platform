import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ner-logistics-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const MOCK_DISTRICTS = [
  { id: '1', name: 'Guwahati, Assam (Plains)', state: 'Assam', risk: 'Low' },
  { id: '2', name: 'Imphal, Manipur (Valley)', state: 'Manipur', risk: 'Medium' },
  { id: '3', name: 'Kohima, Nagaland (Hilly)', state: 'Nagaland', risk: 'High' },
  { id: '4', name: 'Aizawl, Mizoram', state: 'Mizoram', risk: 'High' }
];

export const MOCK_VEHICLES = [
  { id: 'V-101', name: 'Convoy Alpha', status: 'In Transit', driver: 'R. Sharma', location: 'Guwahati' },
  { id: 'V-102', name: 'Relief Truck 04', status: 'Standby', driver: 'A. Gogoi', location: 'Kohima' },
  { id: 'V-103', name: 'Medical Express', status: 'In Transit', driver: 'K. Singh', location: 'Imphal' }
];

export const MOCK_ROUTES = [
  { id: 'R-01', name: 'Guwahati - Imphal Corridor', distance: '490 km', riskScore: 27 },
  { id: 'R-02', name: 'Silchar - Agartala Bypass', distance: '250 km', riskScore: 14 }
];

export const MOCK_ALERTS = [
  { id: 'A-01', title: 'Landslide Warning', type: 'Landslide', severity: 'Critical', location: 'NH-29 Kohima - Dimapur', status: 'Active', timestamp: '2026-09-28T08:30:00Z' },
  { id: 'A-02', title: 'Flash Flood Alert', type: 'Heavy Weather', severity: 'Warning', location: 'Barak Valley Route', status: 'Active', timestamp: '2026-09-28T09:00:00Z' },
  { id: 'A-03', title: 'Bridge Inspection Closure', type: 'Logistics Delays', severity: 'Info', location: 'Saraighat Bridge', status: 'Active', timestamp: '2026-09-28T07:15:00Z' }
];

export const getDistricts = async () => {
  try {
    const res = await api.get('/districts');
    return (res.data && res.data.length > 0) ? res.data : MOCK_DISTRICTS;
  } catch (err) {
    return MOCK_DISTRICTS;
  }
};

export const getVehicles = async () => {
  try {
    const res = await api.get('/vehicles');
    return (res.data && res.data.length > 0) ? res.data : MOCK_VEHICLES;
  } catch (err) {
    return MOCK_VEHICLES;
  }
};

export const getRoutes = async () => {
  try {
    const res = await api.get('/routes');
    return (res.data && res.data.length > 0) ? res.data : MOCK_ROUTES;
  } catch (err) {
    return MOCK_ROUTES;
  }
};

export const getAnalytics = async () => {
  try {
    const res = await api.get('/analytics');
    return res.data || { totalVehicles: 3, activeAlerts: 3, safeRoutes: 2 };
  } catch (err) {
    return { totalVehicles: 3, activeAlerts: 3, safeRoutes: 2 };
  }
};

export const getAlerts = async () => {
  try {
    const res = await api.get('/alerts');
    return (res.data && res.data.length > 0) ? res.data : MOCK_ALERTS;
  } catch (err) {
    return MOCK_ALERTS;
  }
};

export const fetchAlerts = getAlerts;

export const createAlert = async (data) => {
  try {
    const res = await api.post('/alerts', data);
    return res.data;
  } catch (err) {
    const newAlert = { id: A-\, ...data, timestamp: new Date().toISOString() };
    MOCK_ALERTS.unshift(newAlert);
    return newAlert;
  }
};

export const submitReport = async (data) => {
  try {
    const res = await api.post('/reports', data);
    return res.data;
  } catch (err) {
    return { success: true, data };
  }
};

export const getReports = async () => {
  try {
    const res = await api.get('/reports');
    return res.data || [];
  } catch (err) {
    return [];
  }
};

export const optimizeRoute = async (data) => {
  try {
    const res = await api.post('/routes/optimize', data);
    return res.data;
  } catch (err) {
    return { status: 'optimized', route: MOCK_ROUTES[0] };
  }
};

export default api;
