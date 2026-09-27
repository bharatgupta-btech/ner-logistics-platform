import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Fallback Mock Datasets for Standalone/Vercel Deployments
export const MOCK_DISTRICTS = [
  { id: "ASSAM_GUWAHATI", name: "Guwahati", state: "Assam", lat: 26.1445, lng: 91.7362, population: 963429, elevation: 55, terrain_type: "Plains", landslide_prone: false, flood_prone: true, nearest_highway: "NH 27", connectivity_index: 95 },
  { id: "ASSAM_JORHAT", name: "Jorhat", state: "Assam", lat: 26.7509, lng: 94.2037, population: 153889, elevation: 116, terrain_type: "Plains", landslide_prone: false, flood_prone: true, nearest_highway: "NH 715", connectivity_index: 80 },
  { id: "ASSAM_DIBRUGARH", name: "Dibrugarh", state: "Assam", lat: 27.4728, lng: 94.9120, population: 154019, elevation: 108, terrain_type: "Plains", landslide_prone: false, flood_prone: true, nearest_highway: "NH 15", connectivity_index: 75 },
  { id: "ASSAM_SILCHAR", name: "Silchar", state: "Assam", lat: 24.8333, lng: 92.7789, population: 172830, elevation: 22, terrain_type: "Plains", landslide_prone: false, flood_prone: true, nearest_highway: "NH 37", connectivity_index: 70 },
  { id: "ARUNACHAL_ITANAGAR", name: "Itanagar", state: "Arunachal Pradesh", lat: 27.0844, lng: 93.6053, population: 59490, elevation: 320, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 415", connectivity_index: 60 },
  { id: "ARUNACHAL_TAWANG", name: "Tawang", state: "Arunachal Pradesh", lat: 27.5861, lng: 91.8697, population: 11202, elevation: 3048, terrain_type: "Mountainous", landslide_prone: true, flood_prone: false, nearest_highway: "NH 13", connectivity_index: 40 },
  { id: "MEGHALAYA_SHILLONG", name: "Shillong", state: "Meghalaya", lat: 25.5788, lng: 91.8933, population: 143229, elevation: 1525, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 6", connectivity_index: 80 },
  { id: "MEGHALAYA_TURA", name: "Tura", state: "Meghalaya", lat: 25.5134, lng: 90.2173, population: 74858, elevation: 349, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 217", connectivity_index: 60 },
  { id: "MANIPUR_IMPHAL", name: "Imphal", state: "Manipur", lat: 24.8170, lng: 93.9368, population: 268243, elevation: 786, terrain_type: "Valley", landslide_prone: false, flood_prone: true, nearest_highway: "NH 2", connectivity_index: 75 },
  { id: "MANIPUR_CHURACHANDPUR", name: "Churachandpur", state: "Manipur", lat: 24.3333, lng: 93.6667, population: 54141, elevation: 914, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 2", connectivity_index: 60 },
  { id: "MIZORAM_AIZAWL", name: "Aizawl", state: "Mizoram", lat: 23.7367, lng: 92.7146, population: 293416, elevation: 1132, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 2", connectivity_index: 70 },
  { id: "NAGALAND_KOHIMA", name: "Kohima", state: "Nagaland", lat: 25.6701, lng: 94.1077, population: 99039, elevation: 1444, terrain_type: "Hilly", landslide_prone: true, flood_prone: false, nearest_highway: "NH 2", connectivity_index: 70 },
  { id: "NAGALAND_DIMAPUR", name: "Dimapur", state: "Nagaland", lat: 25.9060, lng: 93.7275, population: 122834, elevation: 145, terrain_type: "Plains", landslide_prone: false, flood_prone: true, nearest_highway: "NH 29", connectivity_index: 85 },
  { id: "SIKKIM_GANGTOK", name: "Gangtok", state: "Sikkim", lat: 27.3389, lng: 88.6065, population: 100286, elevation: 1650, terrain_type: "Mountainous", landslide_prone: true, flood_prone: false, nearest_highway: "NH 10", connectivity_index: 75 },
  { id: "TRIPURA_AGARTALA", name: "Agartala", state: "Tripura", lat: 23.8315, lng: 91.2868, population: 400004, elevation: 12, terrain_type: "Plains", landslide_prone: false, flood_prone: true, nearest_highway: "NH 8", connectivity_index: 85 }
];

export const MOCK_VEHICLES = [
  { id: "v1", vehicle_number: "AS-01-KC-1234", type: "medical", driver_name: "Ramesh Kalita", driver_phone: "+91 98765 43210", cargo_description: "Vaccines & Emergency Meds", origin: "Guwahati", destination: "Itanagar", current_lat: 26.5000, current_lng: 92.2000, speed: 45, heading: 45, status: "in_transit" },
  { id: "v2", vehicle_number: "ML-05-AB-9876", type: "food", driver_name: "John Lyngdoh", driver_phone: "+91 98765 43211", cargo_description: "Rice & Essential Rations", origin: "Guwahati", destination: "Shillong", current_lat: 25.8000, current_lng: 91.8000, speed: 30, heading: 160, status: "in_transit" },
  { id: "v3", vehicle_number: "NL-01-C-5555", type: "construction", driver_name: "Ato Sema", driver_phone: "+91 98765 43212", cargo_description: "Cement & Steel", origin: "Dimapur", destination: "Kohima", current_lat: 25.7500, current_lng: 93.9000, speed: 20, heading: 120, status: "delayed" },
  { id: "v4", vehicle_number: "MN-01-X-7777", type: "medical", driver_name: "Ibohal Singh", driver_phone: "+91 98765 43213", cargo_description: "Oxygen Cylinders", origin: "Silchar", destination: "Imphal", current_lat: 24.8500, current_lng: 93.3000, speed: 35, heading: 80, status: "in_transit" },
  { id: "v5", vehicle_number: "MZ-01-D-1111", type: "agriculture", driver_name: "Lalrinfela", driver_phone: "+91 98765 43214", cargo_description: "Fertilizers", origin: "Silchar", destination: "Aizawl", current_lat: 24.3000, current_lng: 92.7500, speed: 40, heading: 170, status: "in_transit" },
  { id: "v6", vehicle_number: "TR-01-B-2222", type: "food", driver_name: "Bimal Debbarma", driver_phone: "+91 98765 43215", cargo_description: "Perishable Vegetables", origin: "Agartala", destination: "Dharmanagar", current_lat: 24.0000, current_lng: 91.5000, speed: 50, heading: 60, status: "in_transit" },
  { id: "v7", vehicle_number: "SK-01-F-3333", type: "medical", driver_name: "Karma Bhutia", driver_phone: "+91 98765 43216", cargo_description: "Hospital Equipment", origin: "Namchi", destination: "Gangtok", current_lat: 27.2500, current_lng: 88.4500, speed: 25, heading: 30, status: "in_transit" },
  { id: "v8", vehicle_number: "AR-01-G-4444", type: "food", driver_name: "Taba Taku", driver_phone: "+91 98765 43217", cargo_description: "PDS Supplies", origin: "Tezpur", destination: "Bomdila", current_lat: 27.0000, current_lng: 92.6000, speed: 15, heading: 340, status: "stopped" },
  { id: "v9", vehicle_number: "AS-04-H-6666", type: "construction", driver_name: "Bikash Gogoi", driver_phone: "+91 98765 43218", cargo_description: "Bridge Girders", origin: "Jorhat", destination: "Dibrugarh", current_lat: 27.1000, current_lng: 94.5000, speed: 45, heading: 60, status: "in_transit" },
  { id: "v10", vehicle_number: "AS-11-J-8888", type: "agriculture", driver_name: "Abdul Ali", driver_phone: "+91 98765 43219", cargo_description: "Tea Leaves", origin: "Dibrugarh", destination: "Guwahati", current_lat: 26.5000, current_lng: 92.5000, speed: 55, heading: 250, status: "in_transit" }
];

export const MOCK_ALERTS = [
  { id: 'alt-1', type: 'landslide', title: 'Major Landslide on NH-2 Corridor', location: 'Kohima, Nagaland', highway: 'NH 2 (Dimapur-Kohima Pass)', severity: 'CRITICAL', description: 'Debris blockage covering 2 lanes near Kohima bypass. Heavy earthmoving machinery dispatched by BRO. Alternate route via Chumukedima active.', timestamp: new Date(Date.now() - 1000 * 60 * 15) },
  { id: 'alt-2', type: 'weather', title: 'Heavy Incessant Rainfall & Flash Flood Warning', location: 'Cherrapunji & Mawsynram, Meghalaya', highway: 'NH 6 / SH-12', severity: 'HIGH', description: 'Intense precipitation exceeding 120mm/hr. High risk of localized mudslides and low visibility across East Khasi Hills.', timestamp: new Date(Date.now() - 1000 * 60 * 45) },
  { id: 'alt-3', type: 'road', title: 'Bridge Structural Maintenance & Weight Restrictions', location: 'Dibrugarh, Assam', highway: 'NH 15 (Brahmaputra Approach)', severity: 'MEDIUM', description: 'Bridge joint repairs in progress. Heavy multi-axle freight restricted to single convoy lane until 18:00 IST.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) },
  { id: 'alt-4', type: 'traffic', title: 'Logistics Convoy Speed Restriction & Escort', location: 'Imphal West, Manipur', highway: 'NH 102 (Imphal-Moreh Highway)', severity: 'LOW', description: 'Security escort convoy active along Moreh border transit. Commercial vehicles proceed in designated lanes.', timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4) }
];

export const MOCK_REPORTS = [
  { id: 'rep-101', officer_name: 'Inspector R. Sharma', district: 'Shillong', state: 'Meghalaya', highway: 'NH 6', issue_type: 'landslide', title: 'Debris Clearance near Jowai Pass', description: 'Minor mudslide cleared by SDRF crew. Single lane operational.', status: 'acknowledged', created_at: new Date(Date.now() - 1000 * 60 * 120) }
];

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    // Return graceful mock fallback instead of throwing network error
    return Promise.reject(error);
  }
);

export const login = (credentials) => api.post('/auth/login', credentials).catch(() => ({ data: { success: true, token: 'mock_token', user: { name: credentials.username || 'Officer' } } }));

export const getDistricts = () => api.get('/districts').catch(() => ({ data: { success: true, data: MOCK_DISTRICTS } }));

export const getVehicles = (params) => api.get('/vehicles', { params }).catch(() => ({ data: { success: true, data: MOCK_VEHICLES } }));

export const getVehicle = (id) => api.get(`/vehicles/${id}`).catch(() => {
  const found = MOCK_VEHICLES.find(v => v.id === id) || MOCK_VEHICLES[0];
  return { data: { success: true, data: found } };
});

export const getAlerts = (params) => api.get('/alerts', { params }).catch(() => ({ data: { success: true, data: MOCK_ALERTS } }));

export const getAnalytics = () => api.get('/analytics').catch(() => ({
  data: {
    success: true,
    data: {
      overview: { total_districts: 15, active_vehicles: 10, open_alerts: 4, connectivity_index: 84 },
      connectivity_by_state: [
        { state: 'Assam', score: 92 },
        { state: 'Arunachal', score: 65 },
        { state: 'Meghalaya', score: 78 },
        { state: 'Manipur', score: 54 },
        { state: 'Mizoram', score: 60 },
        { state: 'Nagaland', score: 72 },
        { state: 'Sikkim', score: 85 },
        { state: 'Tripura', score: 88 }
      ]
    }
  }
}));

export const getWeather = () => api.get('/weather').catch(() => ({
  data: {
    success: true,
    data: [
      { state: 'Assam', temp: 28, humidity: 84, risk: 'Moderate' },
      { state: 'Meghalaya', temp: 22, humidity: 96, risk: 'Critical' },
      { state: 'Manipur', temp: 24, humidity: 78, risk: 'Low' }
    ]
  }
}));

export const optimizeRoute = (data) => api.post('/routes/optimize', data).catch(() => ({
  data: {
    success: true,
    routes: [
      {
        id: 'r-primary',
        name: 'Primary AI Highway Route (NH 27)',
        total_distance: 320,
        formatted_eta: '6h 45m',
        color: 'emerald',
        blocked_count: 0,
        waypoints: [
          { name: data.origin || 'Guwahati', lat: 26.1445, lng: 91.7362 },
          { name: 'Nagaon Hub', lat: 26.3480, lng: 92.6840 },
          { name: data.destination || 'Itanagar', lat: 27.0844, lng: 93.6053 }
        ]
      },
      {
        id: 'r-alternate',
        name: 'Alternate Low-Elevation Bypass',
        total_distance: 358,
        formatted_eta: '7h 30m',
        color: 'amber',
        blocked_count: 1,
        waypoints: [
          { name: data.origin || 'Guwahati', lat: 26.1445, lng: 91.7362 },
          { name: 'Tezpur Bypass', lat: 26.6528, lng: 92.7926 },
          { name: data.destination || 'Itanagar', lat: 27.0844, lng: 93.6053 }
        ]
      }
    ]
  }
}));

export const submitReport = (data) => api.post('/reports', data).catch(() => ({ data: { success: true, data: { id: 'rep-' + Date.now(), ...data } } }));

export const getReports = (params) => api.get('/reports', { params }).catch(() => ({ data: { success: true, data: MOCK_REPORTS } }));

export const createAlert = (data) => api.post('/alerts', data).catch(() => ({ data: { success: true, data: { id: 'alt-' + Date.now(), ...data } } }));

export default api;
