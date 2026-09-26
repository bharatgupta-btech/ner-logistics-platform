import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import StatsCards from './StatsCards';
import ConnectivityChart from './ConnectivityChart';
import AlertsFeed from './AlertsFeed';
import { 
  RefreshCw, 
  MapPin, 
  Maximize2, 
  Truck, 
  AlertTriangle, 
  Activity,
  Route,
  BarChart3,
  FileText,
  Navigation,
  Radio,
  Cloud,
  Thermometer,
  Wind,
  ShieldAlert,
  ArrowRight,
  ChevronRight
} from 'lucide-react';
import { useSocket } from '../../hooks/useSocket';
import { NER_CENTER } from '../../utils/constants';
import { getVehicles, getAlerts, getAnalytics } from '../../utils/api';
import 'leaflet/dist/leaflet.css';

const HUB_MARKERS = [
  { name: 'Guwahati Hub', state: 'Assam', lat: 26.1445, lng: 91.7362, status: 'Normal', color: '#10B981', vehicles: 48 },
  { name: 'Shillong Hub', state: 'Meghalaya', lat: 25.5788, lng: 91.8933, status: 'Rain Caution', color: '#F59E0B', vehicles: 22 },
  { name: 'Dimapur Hub', state: 'Nagaland', lat: 25.9060, lng: 93.7275, status: 'Normal', color: '#10B981', vehicles: 16 },
  { name: 'Aizawl Hub', state: 'Mizoram', lat: 23.7367, lng: 92.7146, status: 'Landslide Alert', color: '#EF4444', vehicles: 9 },
  { name: 'Imphal Hub', state: 'Manipur', lat: 24.8170, lng: 93.9368, status: 'Normal', color: '#10B981', vehicles: 12 },
  { name: 'Gangtok Hub', state: 'Sikkim', lat: 27.3389, lng: 88.6065, status: 'Fog Warning', color: '#F59E0B', vehicles: 18 },
  { name: 'Agartala Hub', state: 'Tripura', lat: 23.8315, lng: 91.2868, status: 'Normal', color: '#10B981', vehicles: 20 },
  { name: 'Itanagar Hub', state: 'Arunachal', lat: 27.0844, lng: 93.6053, status: 'Normal', color: '#10B981', vehicles: 14 },
];

const createHubIcon = (color) => L.divIcon({
  className: 'hub-pin',
  html: `<div style="background-color:${color};width:14px;height:14px;border-radius:50%;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.35);"></div>`,
  iconSize: [18, 18],
  iconAnchor: [9, 9]
});

const WEATHER_DATA = [
  { state: 'Assam', temp: 28, humidity: 84, wind: 12, rain: '18mm', risk: 'Moderate', color: 'amber' },
  { state: 'Meghalaya', temp: 22, humidity: 96, wind: 8, rain: '120mm', risk: 'Critical', color: 'red' },
  { state: 'Manipur', temp: 24, humidity: 78, wind: 6, rain: '8mm', risk: 'Low', color: 'emerald' },
  { state: 'Mizoram', temp: 23, humidity: 88, wind: 15, rain: '42mm', risk: 'High', color: 'orange' },
  { state: 'Nagaland', temp: 20, humidity: 82, wind: 10, rain: '22mm', risk: 'Moderate', color: 'amber' },
  { state: 'Arunachal', temp: 16, humidity: 76, wind: 18, rain: '35mm', risk: 'High', color: 'orange' },
  { state: 'Tripura', temp: 29, humidity: 80, wind: 9, rain: '12mm', risk: 'Low', color: 'emerald' },
  { state: 'Sikkim', temp: 14, humidity: 72, wind: 22, rain: '28mm', risk: 'Moderate', color: 'amber' },
];

const RISK_COLOR = {
  'Critical': 'bg-red-100 text-red-700 border-red-200',
  'High': 'bg-orange-100 text-orange-700 border-orange-200',
  'Moderate': 'bg-amber-100 text-amber-700 border-amber-200',
  'Low': 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const QUICK_ACTIONS = [
  { label: 'Track Fleet', subtitle: 'Live GPS Telematics', icon: Truck, path: '/vehicles', color: 'indigo', bg: 'from-indigo-600 to-indigo-700' },
  { label: 'Plan Route', subtitle: 'AI Pathfinding Engine', icon: Navigation, path: '/routes', color: 'violet', bg: 'from-violet-600 to-purple-700' },
  { label: 'View Alerts', subtitle: 'Emergency Feed', icon: AlertTriangle, path: '/alerts', color: 'red', bg: 'from-rose-600 to-red-700' },
  { label: 'Field Report', subtitle: 'Officer Incident Form', icon: FileText, path: '/reports', color: 'amber', bg: 'from-amber-500 to-orange-600' },
  { label: 'GIS Map', subtitle: 'Live Accessibility Map', icon: MapPin, path: '/map', color: 'teal', bg: 'from-teal-600 to-emerald-700' },
  { label: 'Analytics', subtitle: 'Supply Chain Intel', icon: BarChart3, path: '/analytics', color: 'cyan', bg: 'from-cyan-600 to-blue-700' },
];

const Dashboard = () => {
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [vehicleCount, setVehicleCount] = useState(124);
  const [selectedHub, setSelectedHub] = useState(null);
  const navigate = useNavigate();
  const { data: latestAlert } = useSocket('new_alert');

  const refreshData = () => {
    setLoading(true);
    setTimeout(() => {
      setLastUpdated(new Date());
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    getVehicles()
      .then(res => {
        if (res.data?.data?.length) setVehicleCount(res.data.data.length);
      })
      .catch(() => {});
  }, []);

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 min-h-full">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Command & Operations Center</h2>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time 8-State NER Logistics, Fleet GPS & Disaster Intelligence Platform
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
            <Radio size={14} className="animate-pulse text-emerald-600" />
            <span>All Systems Online • Live Sync</span>
          </div>
          <span className="text-xs font-medium text-slate-400">
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>
          <button 
            onClick={refreshData}
            className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors shadow-xs cursor-pointer"
            title="Refresh All Feeds"
          >
            <RefreshCw size={17} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── Row 1: Stat Cards ── */}
      <StatsCards />

      {/* ── Row 2: Quick Action Panel ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {QUICK_ACTIONS.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.path}
              onClick={() => navigate(action.path)}
              className={`bg-gradient-to-br ${action.bg} text-white rounded-2xl p-4 flex flex-col items-start gap-2 shadow-sm hover:shadow-md transform hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group text-left`}
            >
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center border border-white/25 group-hover:scale-110 transition-transform">
                <Icon size={18} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-black text-white leading-tight">{action.label}</p>
                <p className="text-[11px] text-white/70 font-medium">{action.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Row 3: Connectivity Chart + Alerts Feed ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ConnectivityChart />
        </div>
        <div className="lg:col-span-1 h-[32rem]">
          <AlertsFeed />
        </div>
      </div>

      {/* ── Row 4: GIS Map + Weather Intelligence ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Mini GIS Map — spans 3 columns */}
        <div className="lg:col-span-3 bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-slate-900 text-sm">NER Regional Hub & Convoy Status</h3>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full">{vehicleCount} Active</span>
            </div>
            <button
              onClick={() => navigate('/map')}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
            >
              <span>Full GIS</span>
              <Maximize2 size={13} />
            </button>
          </div>

          <div className="h-64 rounded-xl overflow-hidden border border-slate-200 relative z-0">
            <MapContainer center={NER_CENTER} zoom={6} className="h-full w-full" zoomControl={false}>
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <ZoomControl position="bottomright" />
              {HUB_MARKERS.map((hub) => (
                <Marker 
                  key={hub.name} 
                  position={[hub.lat, hub.lng]} 
                  icon={createHubIcon(hub.color)}
                  eventHandlers={{
                    click: () => setSelectedHub(hub)
                  }}
                >
                  <Popup>
                    <div className="p-1 text-xs space-y-1">
                      <p className="font-black text-slate-900">{hub.name}</p>
                      <p className="text-slate-500">{hub.state}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: hub.color }}></span>
                        <span className="font-semibold">{hub.status}</span>
                      </div>
                      <p className="text-slate-600">Fleet: <strong>{hub.vehicles} vehicles</strong></p>
                      <button
                        onClick={() => navigate('/routes')}
                        className="text-indigo-600 font-bold text-[10px] mt-1 underline cursor-pointer"
                      >
                        Optimize Route →
                      </button>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>

          {/* Hub Legend */}
          <div className="flex items-center gap-4 text-xs flex-wrap pt-1">
            {[
              { label: 'Normal Flow', color: '#10B981' },
              { label: 'Weather Caution', color: '#F59E0B' },
              { label: 'Incident / Alert', color: '#EF4444' },
            ].map(leg => (
              <span key={leg.label} className="flex items-center gap-1.5 text-slate-500 font-medium">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: leg.color }}></span>
                {leg.label}
              </span>
            ))}
            <button
              onClick={() => navigate('/vehicles')}
              className="ml-auto text-indigo-600 hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              Track All Vehicles <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Weather Risk Intelligence — spans 2 columns */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-500" />
              <h3 className="font-bold text-slate-900 text-sm">Live Weather & Road Risk</h3>
            </div>
            <button
              onClick={() => navigate('/analytics')}
              className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1 cursor-pointer"
            >
              AI Forecast <ArrowRight size={13} />
            </button>
          </div>

          <div className="space-y-2 overflow-y-auto max-h-72 pr-0.5">
            {WEATHER_DATA.map((w) => (
              <div 
                key={w.state}
                className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:border-slate-200 transition-colors cursor-pointer group"
                onClick={() => navigate('/analytics')}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                    <Thermometer size={14} className="text-blue-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{w.state}</p>
                    <p className="text-[11px] text-slate-500">
                      {w.temp}°C • {w.humidity}% RH • 💧{w.rain}
                    </p>
                  </div>
                </div>
                <span className={`text-[10px] font-black px-2 py-0.5 rounded-lg border ${RISK_COLOR[w.risk]}`}>
                  {w.risk}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/analytics')}
            className="w-full py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 border border-indigo-200 rounded-xl transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <ShieldAlert size={14} />
            View 72h AI Disaster Prediction →
          </button>
        </div>

      </div>

    </div>
  );
};

export default Dashboard;
