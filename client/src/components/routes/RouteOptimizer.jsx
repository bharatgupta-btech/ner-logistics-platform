import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { 
  Navigation, 
  MapPin, 
  ShieldAlert, 
  Sparkles, 
  Clock, 
  Route as RouteIcon, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight,
  Layers,
  Zap
} from 'lucide-react';

import { getDistricts, optimizeRoute } from '../../utils/api';
import RouteComparison from './RouteComparison';
import LoadingSpinner from '../common/LoadingSpinner';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet default marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom origin and destination marker icons
const createCustomIcon = (colorLabel) => {
  const color = colorLabel === 'green' ? '#10B981' : colorLabel === 'red' ? '#EF4444' : '#6366F1';
  return L.divIcon({
    className: 'custom-map-pin',
    html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.3);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

// Component to dynamically fit map bounds when route changes
const MapBoundsFitter = ({ bounds }) => {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.length > 0) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
};

const RouteOptimizer = () => {
  const [districts, setDistricts] = useState([]);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  
  // Constraints
  const [avoidLandslide, setAvoidLandslide] = useState(false);
  const [preferHighway, setPreferHighway] = useState(true);
  const [emergencyMode, setEmergencyMode] = useState(false);

  // States
  const [loading, setLoading] = useState(false);
  const [routes, setRoutes] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [error, setError] = useState('');

  // Fetch district list on mount
  useEffect(() => {
    const fetchDistrictList = async () => {
      try {
        const response = await getDistricts();
        if (response.data?.success) {
          const list = response.data.data;
          setDistricts(list);
          if (list.length > 1) {
            // Set defaults (Guwahati to Imphal)
            const guwahati = list.find(d => d.name.toLowerCase() === 'guwahati') || list[0];
            const imphal = list.find(d => d.name.toLowerCase() === 'imphal') || list[1];
            setOrigin(guwahati.id);
            setDestination(imphal.id);
          }
        }
      } catch (err) {
        console.error('Failed to fetch districts:', err);
      }
    };
    fetchDistrictList();
  }, []);

  // Handle Find Optimal Route click
  const handleOptimize = async (e) => {
    if (e) e.preventDefault();

    if (!origin || !destination) {
      setError('Please select both Origin and Destination districts.');
      return;
    }

    if (origin === destination) {
      setError('Origin and Destination districts cannot be the same.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await optimizeRoute({
        from_district: origin,
        to_district: destination,
        constraints: {
          avoid_landslide_prone: avoidLandslide,
          prefer_highway: preferHighway,
          emergency_mode: emergencyMode
        }
      });

      if (response.data?.success && response.data.data?.length > 0) {
        const resultRoutes = response.data.data;
        setRoutes(resultRoutes);
        setSelectedRoute(resultRoutes[0]);
      } else {
        setError('No valid routes found between the selected locations.');
      }
    } catch (err) {
      console.error('Route optimization error:', err);
      setError(err.response?.data?.error || 'Failed to calculate optimal route. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const activePolylineCoords = selectedRoute?.coordinates || [];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-indigo-600" />
            AI Route Optimizer & Decision Support
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Real-time GIS pathfinding engine with landslide, flood risk & weather degradation parameters for NER corridors.
          </p>
        </div>
        
        <button
          onClick={() => {
            setEmergencyMode(!emergencyMode);
            if (!emergencyMode) setAvoidLandslide(true);
          }}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm ${
            emergencyMode 
              ? 'bg-rose-600 text-white ring-2 ring-rose-500/40 animate-pulse' 
              : 'bg-white border border-rose-200 text-rose-600 hover:bg-rose-50'
          }`}
        >
          <Zap className="w-4 h-4" />
          {emergencyMode ? 'Emergency Mode Active' : 'Toggle SOS Emergency Mode'}
        </button>
      </div>

      {/* Control Panel Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <form onSubmit={handleOptimize} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Origin District */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-600" />
                Origin District (Start Point)
              </label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              >
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}, {d.state} ({d.terrain_type})
                  </option>
                ))}
              </select>
            </div>

            {/* Destination District */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-600" />
                Destination District (End Point)
              </label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all outline-none"
              >
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}, {d.state} ({d.terrain_type})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* AI Constraints & Preferences */}
          <div className="pt-2 border-t border-slate-100">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-3">
              AI Optimization Parameters
            </span>
            <div className="flex flex-wrap gap-4 text-xs font-medium">
              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-lg border border-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={avoidLandslide}
                  onChange={(e) => setAvoidLandslide(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                Avoid Landslide Prone Terrains
              </label>

              <label className="flex items-center gap-2 cursor-pointer bg-slate-50 hover:bg-slate-100 px-3.5 py-2 rounded-lg border border-slate-200 transition-colors">
                <input
                  type="checkbox"
                  checked={preferHighway}
                  onChange={(e) => setPreferHighway(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <RouteIcon className="w-4 h-4 text-indigo-500" />
                Prefer National Highways (NH Corridors)
              </label>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-3.5 px-6 rounded-xl transition-all shadow-md hover:shadow-indigo-500/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <LoadingSpinner />
                <span>Computing Optimal AI Routes...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Find Optimal Route</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Results View */}
      {routes && routes.length > 0 && (
        <div className="space-y-6">
          {/* Side-by-Side Alternate Route Cards */}
          <RouteComparison
            routes={routes}
            selectedRoute={selectedRoute}
            onSelectRoute={(route) => setSelectedRoute(route)}
          />

          {/* Selected Route Map & Waypoints Detailed Breakdown */}
          {selectedRoute && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* GIS Map Visualization */}
              <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">
                <div className="flex items-center justify-between px-2">
                  <h4 className="font-bold text-slate-800 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-indigo-600" />
                    GIS Route Alignment — {selectedRoute.name}
                  </h4>
                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
                    {selectedRoute.total_distance} km • {selectedRoute.formatted_eta}
                  </span>
                </div>

                <div className="h-[420px] rounded-xl overflow-hidden border border-slate-200 relative z-0">
                  <MapContainer
                    center={activePolylineCoords[0] || [26.2, 92.9]}
                    zoom={7}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {/* Polyline path */}
                    {activePolylineCoords.length > 1 && (
                      <Polyline
                        positions={activePolylineCoords}
                        color={selectedRoute.color === 'emerald' ? '#10B981' : selectedRoute.color === 'amber' ? '#F59E0B' : '#4F46E5'}
                        weight={5}
                        opacity={0.8}
                        dashArray={selectedRoute.blocked_count > 0 ? '10, 10' : null}
                      />
                    )}

                    {/* Fit map bounds dynamically */}
                    <MapBoundsFitter bounds={activePolylineCoords} />

                    {/* Waypoint Markers */}
                    {selectedRoute.waypoints?.map((wp, idx) => {
                      const isFirst = idx === 0;
                      const isLast = idx === selectedRoute.waypoints.length - 1;
                      const iconColor = isFirst ? 'green' : isLast ? 'red' : 'blue';

                      return (
                        <Marker key={wp.id || idx} position={[wp.lat, wp.lng]} icon={createCustomIcon(iconColor)}>
                          <Popup>
                            <div className="p-1 max-w-xs">
                              <span className="text-[10px] uppercase font-bold text-indigo-600 block">
                                {isFirst ? 'Start Point' : isLast ? 'Destination' : `Waypoint #${idx}`}
                              </span>
                              <strong className="text-sm text-slate-800 block">{wp.name}, {wp.state}</strong>
                              <span className="text-xs text-slate-500 block mt-1">Terrain: {wp.terrain} ({wp.elevation}m alt)</span>
                            </div>
                          </Popup>
                          <Tooltip permanent={isFirst || isLast} direction="top">
                            <span className="text-xs font-bold">{wp.name}</span>
                          </Tooltip>
                        </Marker>
                      );
                    })}
                  </MapContainer>
                </div>
              </div>

              {/* Waypoints & Segment Details List */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-4">
                <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                  Turn-by-Turn Waypoints
                </h4>

                <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                  {selectedRoute.waypoints?.map((wp, idx) => (
                    <div key={wp.id || idx} className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        idx === 0 ? 'bg-emerald-100 text-emerald-700' : idx === selectedRoute.waypoints.length - 1 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {idx + 1}
                      </div>

                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800 text-sm">{wp.name}</span>
                          <span className="text-[11px] text-slate-400">{wp.state}</span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">
                          {wp.terrain} terrain • Altitude: {wp.elevation}m
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-100 text-xs space-y-2">
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Path Segments:</span>
                    <span className="font-bold text-slate-800">{selectedRoute.segments?.length || 0} Road Corridors</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600">
                    <span>Overall Security Index:</span>
                    <span className="font-bold text-emerald-600">
                      {100 - selectedRoute.risk_score}% Safe
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RouteOptimizer;
