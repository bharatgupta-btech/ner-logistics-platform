import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  ShieldAlert, 
  AlertTriangle, 
  CloudRain, 
  Truck, 
  Search, 
  PlusCircle, 
  Radio, 
  CheckCircle2, 
  RefreshCw,
  Flame,
  Filter
} from 'lucide-react';
import { getAlerts } from '../../utils/api';
import api from '../../utils/api';
import { useSocket } from '../../context/SocketContext';
import AlertCard from './AlertCard';
import LoadingSpinner from '../common/LoadingSpinner';

const AlertCenter = () => {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // all, critical, landslide, weather, delay
  const [showBroadcastModal, setShowBroadcastModal] = useState(false);
  const [broadcastData, setBroadcastData] = useState({
    title: '',
    message: '',
    type: 'landslide',
    severity: 'critical',
    district_id: 'ASSAM_GUWAHATI'
  });
  const [broadcastLoading, setBroadcastLoading] = useState(false);

  const socket = useSocket();

  const fetchAlertList = async () => {
    try {
      setLoading(true);
      const response = await getAlerts({ limit: 100 });
      if (response.data?.success) {
        setAlerts(response.data.data || []);
      }
    } catch (err) {
      console.error('Failed to fetch alerts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlertList();
  }, []);

  // Real-time WebSocket listener
  useEffect(() => {
    if (!socket) return;

    const handleNewAlert = (newAlert) => {
      setAlerts((prev) => [newAlert, ...prev]);
    };

    const handleUpdatedAlert = (updatedAlert) => {
      setAlerts((prev) =>
        prev.map((a) => (a.id === updatedAlert.id ? { ...a, ...updatedAlert } : a))
      );
    };

    socket.on('alert:new', handleNewAlert);
    socket.on('alert:updated', handleUpdatedAlert);

    return () => {
      socket.off('alert:new', handleNewAlert);
      socket.off('alert:updated', handleUpdatedAlert);
    };
  }, [socket]);

  // Acknowledge alert
  const handleAcknowledge = async (alertId) => {
    try {
      await api.put(`/alerts/${alertId}/acknowledge`);
      setAlerts((prev) =>
        prev.map((a) => (a.id === alertId ? { ...a, is_acknowledged: 1 } : a))
      );
      if (socket) {
        socket.emit('alert:acknowledge', alertId);
      }
    } catch (err) {
      console.error('Failed to acknowledge alert:', err);
    }
  };

  // Broadcast new alert
  const handleBroadcastSubmit = async (e) => {
    e.preventDefault();
    if (!broadcastData.title || !broadcastData.message) return;

    try {
      setBroadcastLoading(true);
      const response = await api.post('/alerts', {
        ...broadcastData,
        lat: 26.2,
        lng: 92.9
      });
      if (response.data?.success) {
        setAlerts((prev) => [response.data.data, ...prev]);
        setShowBroadcastModal(false);
        setBroadcastData({
          title: '',
          message: '',
          type: 'landslide',
          severity: 'critical',
          district_id: 'ASSAM_GUWAHATI'
        });
      }
    } catch (err) {
      console.error('Failed to broadcast alert:', err);
    } finally {
      setBroadcastLoading(false);
    }
  };

  // Filter & Search computation
  const filteredAlerts = alerts.filter((alert) => {
    // Type/severity tab filter
    if (filterType === 'critical' && alert.severity !== 'critical' && alert.severity !== 'emergency') return false;
    if (filterType === 'landslide' && alert.type !== 'landslide') return false;
    if (filterType === 'weather' && alert.type !== 'weather' && alert.type !== 'flood') return false;
    if (filterType === 'delay' && alert.type !== 'delay' && alert.type !== 'bridge_damage') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        alert.title?.toLowerCase().includes(q) ||
        alert.message?.toLowerCase().includes(q) ||
        alert.district_id?.toLowerCase().includes(q) ||
        alert.severity?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalCount = alerts.length;
  const criticalCount = alerts.filter(a => a.severity === 'critical' || a.severity === 'emergency').length;
  const activeCount = alerts.filter(a => !a.is_acknowledged).length;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Radio className="w-6 h-6 text-red-600 animate-pulse" />
            Alerts & Disaster Early Warning Center
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Automated disruption alerts, weather warnings, and transport corridor emergencies across North Eastern Region.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchAlertList}
            className="p-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl transition-colors shadow-xs"
            title="Refresh alerts"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowBroadcastModal(true)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs transition-colors shadow-sm"
          >
            <PlusCircle className="w-4 h-4" />
            Broadcast Emergency Alert
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Total Active Alerts</span>
            <div className="text-2xl font-extrabold text-slate-900 mt-1">{totalCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
            <Bell className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-red-200 rounded-2xl p-5 shadow-xs flex items-center justify-between bg-red-50/20">
          <div>
            <span className="text-xs uppercase font-bold text-red-500 tracking-wider">Critical / Emergency</span>
            <div className="text-2xl font-extrabold text-red-600 mt-1">{criticalCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-red-100 text-red-600">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">Unacknowledged</span>
            <div className="text-2xl font-extrabold text-amber-600 mt-1">{activeCount}</div>
          </div>
          <div className="p-3 rounded-xl bg-amber-50 text-amber-600">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Controls & Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
          {[
            { id: 'all', label: 'All Alerts', icon: Bell },
            { id: 'critical', label: 'Critical / SOS', icon: Flame },
            { id: 'landslide', label: 'Landslides', icon: AlertTriangle },
            { id: 'weather', label: 'Heavy Weather', icon: CloudRain },
            { id: 'delay', label: 'Logistics Delays', icon: Truck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = filterType === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search alerts by title or region..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none"
          />
        </div>
      </div>

      {/* Alerts Feed List */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
          <LoadingSpinner />
          <p className="text-sm font-semibold text-slate-600 mt-3">Fetching real-time regional alerts...</p>
        </div>
      ) : filteredAlerts.length > 0 ? (
        <div className="space-y-3">
          {filteredAlerts.map((alert) => (
            <AlertCard
              key={alert.id}
              alert={alert}
              onAcknowledge={handleAcknowledge}
            />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-slate-800 text-base">No active alerts matching filter</h3>
          <p className="text-slate-500 text-xs max-w-sm mx-auto">
            All corridors are operating within safe parameters or search query produced no results.
          </p>
        </div>
      )}

      {/* Broadcast Emergency Modal */}
      {showBroadcastModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-red-600" />
                Broadcast Regional Incident Alert
              </h3>
              <button
                onClick={() => setShowBroadcastModal(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBroadcastSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Alert Headline / Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Major Landslide on NH-29 near Kohima"
                  value={broadcastData.title}
                  onChange={(e) => setBroadcastData({ ...broadcastData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Incident Type</label>
                  <select
                    value={broadcastData.type}
                    onChange={(e) => setBroadcastData({ ...broadcastData, type: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="landslide">Landslide / Rockfall</option>
                    <option value="weather">Cloudburst / Flash Flood</option>
                    <option value="bridge_damage">Bridge Failure / Structural</option>
                    <option value="delay">Convoy Delay / Gridlock</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Severity Level</label>
                  <select
                    value={broadcastData.severity}
                    onChange={(e) => setBroadcastData({ ...broadcastData, severity: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs outline-none focus:ring-2 focus:ring-indigo-500 font-bold"
                  >
                    <option value="emergency">EMERGENCY (Red SOS)</option>
                    <option value="critical">CRITICAL (Major Hazard)</option>
                    <option value="warning">WARNING (Caution)</option>
                    <option value="info">INFO (Notice)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Detailed Situation Description</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide details about road blockage, affected vehicles, and emergency response actions..."
                  value={broadcastData.message}
                  onChange={(e) => setBroadcastData({ ...broadcastData, message: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowBroadcastModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={broadcastLoading}
                  className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold transition-colors shadow-sm disabled:opacity-50"
                >
                  {broadcastLoading ? 'Broadcasting...' : 'Broadcast to Regional Network'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlertCenter;
