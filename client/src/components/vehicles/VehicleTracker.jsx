import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Truck, 
  Search, 
  Filter, 
  MapPin, 
  Activity, 
  Layers, 
  Radio, 
  RefreshCw,
  Crosshair
} from 'lucide-react';
import { getVehicles } from '../../utils/api';
import { useSocket } from '../../context/SocketContext';
import VehicleList from './VehicleList';
import VehicleDetail from './VehicleDetail';
import LoadingSpinner from '../common/LoadingSpinner';
import 'leaflet/dist/leaflet.css';

// Custom vehicle marker icons
const createVehicleIcon = (type, status) => {
  const color = status === 'delayed' ? '#F59E0B' : type === 'medical' ? '#EF4444' : type === 'food' ? '#10B981' : '#4F46E5';
  const emoji = type === 'medical' ? '🏥' : type === 'food' ? '🍚' : type === 'construction' ? '🏗️' : '🌾';

  return L.divIcon({
    className: 'live-vehicle-marker',
    html: `<div style="background: white; border: 2.5px solid ${color}; border-radius: 50%; width: 28px; height: 28px; display: flex; align-items: center; justify-content: center; font-size: 13px; box-shadow: 0 2px 6px rgba(0,0,0,0.3);">${emoji}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14]
  });
};

// Map recenter controller
const RecenterMap = ({ center }) => {
  const map = useMap();
  useEffect(() => {
    if (center && center[0] && center[1]) {
      map.flyTo(center, 9, { duration: 1.2 });
    }
  }, [center, map]);
  return null;
};

const VehicleTracker = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const socket = useSocket();

  const fetchVehicleList = async () => {
    try {
      setLoading(true);
      const res = await getVehicles();
      if (res.data?.success) {
        const list = res.data.data || [];
        setVehicles(list);
        if (list.length > 0 && !selectedVehicle) {
          setSelectedVehicle(list[0]);
        }
      }
    } catch (err) {
      console.error('Failed to load fleet vehicles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicleList();
  }, []);

  // Real-time Socket.IO moving vehicle stream
  useEffect(() => {
    if (!socket) return;

    const handleVehicleUpdate = (updatedV) => {
      setVehicles((prev) =>
        prev.map((v) =>
          v.id === updatedV.id
            ? {
                ...v,
                current_lat: updatedV.current_lat,
                current_lng: updatedV.current_lng,
                status: updatedV.status || v.status
              }
            : v
        )
      );

      // Update selected vehicle in real-time if active
      setSelectedVehicle((prev) => {
        if (prev?.id === updatedV.id) {
          return {
            ...prev,
            current_lat: updatedV.current_lat,
            current_lng: updatedV.current_lng,
            status: updatedV.status || prev.status
          };
        }
        return prev;
      });
    };

    socket.on('vehicle:update', handleVehicleUpdate);

    return () => {
      socket.off('vehicle:update', handleVehicleUpdate);
    };
  }, [socket]);

  // Filters
  const filteredVehicles = vehicles.filter((v) => {
    if (typeFilter !== 'all' && v.type !== typeFilter) return false;
    if (statusFilter !== 'all' && v.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        v.vehicle_number?.toLowerCase().includes(q) ||
        v.cargo_description?.toLowerCase().includes(q) ||
        v.driver_name?.toLowerCase().includes(q) ||
        v.origin?.toLowerCase().includes(q) ||
        v.destination?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const mapCenter = selectedVehicle?.current_lat && selectedVehicle?.current_lng
    ? [selectedVehicle.current_lat, selectedVehicle.current_lng]
    : [26.2, 92.9];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Truck className="w-6 h-6 text-indigo-600" />
            Live Fleet GPS Tracking & Telematics Control
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Real-time GPS tracking for essential supply convoys (Medical, Food, Construction & Agriculture) across NER.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            {vehicles.filter(v => v.status === 'in_transit').length} In Transit
          </span>
          <button
            onClick={fetchVehicleList}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl text-slate-700 transition-colors shadow-xs"
            title="Refresh Fleet"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Split Layout: Fleet List on Left, Map & Telematics on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Fleet List & Filters */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[650px] overflow-hidden">
          <div className="p-4 border-b border-slate-100 space-y-3 bg-slate-50/50">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search vehicle number or driver..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-2 text-xs font-medium outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Filter Chips */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px] font-bold">
              {['all', 'medical', 'food', 'construction', 'agriculture'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type)}
                  className={`px-2.5 py-1 rounded-lg uppercase tracking-wider transition-colors shrink-0 ${
                    typeFilter === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Vehicle List Scrollable */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <LoadingSpinner />
                <p className="text-xs font-semibold text-slate-500 mt-2">Loading fleet vehicles...</p>
              </div>
            ) : (
              <VehicleList
                vehicles={filteredVehicles}
                selectedVehicle={selectedVehicle}
                onSelectVehicle={(v) => setSelectedVehicle(v)}
              />
            )}
          </div>
        </div>

        {/* Right Column: GIS Telematics Map + Vehicle Detail Card */}
        <div className="lg:col-span-8 space-y-6">
          {/* Live GIS Map */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Live Telematics Map View ({filteredVehicles.length} Tracked)
              </h3>
              {selectedVehicle && (
                <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                  Tracking: {selectedVehicle.vehicle_number}
                </span>
              )}
            </div>

            <div className="h-[360px] rounded-xl overflow-hidden border border-slate-200 relative z-0">
              <MapContainer center={mapCenter} zoom={7} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                <RecenterMap center={selectedVehicle?.current_lat ? [selectedVehicle.current_lat, selectedVehicle.current_lng] : null} />

                {filteredVehicles.map((v) => {
                  const isSelected = selectedVehicle?.id === v.id;
                  const lat = v.current_lat || 26.2;
                  const lng = v.current_lng || 92.9;

                  return (
                    <Marker
                      key={v.id}
                      position={[lat, lng]}
                      icon={createVehicleIcon(v.type, v.status)}
                      eventHandlers={{
                        click: () => setSelectedVehicle(v)
                      }}
                    >
                      <Popup>
                        <div className="p-1 max-w-xs text-xs">
                          <strong className="font-bold text-slate-900 block text-sm">{v.vehicle_number}</strong>
                          <span className="text-slate-500 block mt-0.5">Type: <strong className="capitalize text-slate-700">{v.type}</strong></span>
                          <span className="text-slate-500 block">Driver: <strong className="text-slate-700">{v.driver_name}</strong></span>
                          <span className="text-slate-500 block mt-1">{v.origin} ➔ {v.destination}</span>
                        </div>
                      </Popup>
                      <Tooltip permanent={isSelected} direction="top">
                        <span className="text-xs font-bold">{v.vehicle_number}</span>
                      </Tooltip>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </div>

          {/* Selected Vehicle Telematics Details Card */}
          <VehicleDetail vehicle={selectedVehicle} />
        </div>
      </div>
    </div>
  );
};

export default VehicleTracker;
