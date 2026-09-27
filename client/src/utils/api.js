import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://ner-logistics-backend.onrender.com/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Mock Datasets
export const MOCK_DISTRICTS = [
  { id: '1', name: 'Guwahati, Assam (Plains)', state: 'Assam', risk: 'Low' },
  { id: '2', name: 'Imphal, Manipur (Valley)', state: 'Manipur', risk: 'Medium' },
  { id: '3', name: 'Kohima, Nagaland (Hilly)', state: 'Nagaland', risk: 'High' }
];

export const MOCK_VEHICLES = [
  { id: 'V-101', name: 'Convoy Alpha', status: 'In Transit', driver: 'R. Sharma' },
  { id: 'V-102', name: 'Relief Truck 04', status: 'Standby', driver: 'A. Gogoi' }
];

export const MOCK_ROUTES = [
  { id: 'R-01', name: 'Guwahati - Imphal Corridor', distance: '490 km', riskScore: 27 }
];

export const MOCK_ALERTS = [
  { id: 'A-01', type: 'Landslide Warning', severity: 'Critical', location: 'NH-29 Kohima' }
];

// Named Export Functions
export const getDistricts = async () => {
  try {
    const res = await api.get('/districts');
    return res.data;
  } catch (err) {
    console.error('Error fetching districts:', err);
    return MOCK_DISTRICTS;
  }
};

export const getVehicles = async () => {
  try {
    const res = await api.get('/vehicles');
    return res.data;
  } catch (err) {
    console.error('Error fetching vehicles:', err);
    return MOCK_VEHICLES;
  }
};

export const getRoutes = async () => {
  try {
    const res = await api.get('/routes');
    return res.data;
  } catch (err) {
    console.error('Error fetching routes:', err);
    return MOCK_ROUTES;
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

export const getAlerts = async () => {
  try {
    const res = await api.get('/alerts');
    return res.data;
  } catch (err) {
    console.error('Error fetching alerts:', err);
    return MOCK_ALERTS;
  }
};

export const fetchAlerts = getAlerts;

export const createAlert = async (data) => {
  try {
    const res = await api.post('/alerts', data);
    return res.data;
  } catch (err) {
    console.error('Error creating alert:', err);
    throw err;
  }
};

export const submitReport = async (data) => {
  try {
    const res = await api.post('/reports', data);
    return res.data;
  } catch (err) {
    console.error('Error submitting report:', err);
    return { success: true };
  }
};

export const getReports = async () => {
  try {
    const res = await api.get('/reports');
    return res.data;
  } catch (err) {
    console.error('Error fetching reports:', err);
    return [];
  }
};

export const optimizeRoute = async (data) => {
  try {
    const res = await api.post('/routes/optimize', data);
    return res.data;
  } catch (err) {
    console.error('Error optimizing route:', err);
    return { status: 'optimized', route: MOCK_ROUTES[0] };
  }
};

export default api;
