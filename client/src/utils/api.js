import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const login = (credentials) => api.post('/auth/login', credentials);
export const getDistricts = () => api.get('/districts');
export const getVehicles = (params) => api.get('/vehicles', { params });
export const getVehicle = (id) => api.get(`/vehicles/${id}`);
export const getAlerts = (params) => api.get('/alerts', { params });
export const getAnalytics = () => api.get('/analytics');
export const getWeather = () => api.get('/weather');
export const optimizeRoute = (data) => api.post('/routes/optimize', data);
export const submitReport = (data) => api.post('/reports', data);
export const getReports = (params) => api.get('/reports', { params });
export const createAlert = (data) => api.post('/alerts', data);

export default api;
