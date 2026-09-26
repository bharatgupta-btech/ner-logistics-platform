import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Building2, 
  MapPin, 
  Award, 
  CheckCircle2, 
  X, 
  Save, 
  Sliders, 
  Bell, 
  Lock, 
  Radio, 
  Key,
  BadgeAlert,
  Zap,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const UserProfileModal = ({ isOpen, onClose }) => {
  const { user, updateUser, logout } = useAuth();
  
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'credentials' | 'preferences'
  const [formData, setFormData] = useState({
    name: user?.name || 'Debashis Sharma',
    email: user?.email || 'debashis.sharma@ner-logistics.gov.in',
    phone: user?.phone || '+91 94350 88990',
    designation: user?.designation || 'Director of North East Logistics & Disaster Transport',
    department: user?.department || 'Ministry of DoNER / Strategic Transport Command',
    station: user?.station || 'Guwahati Regional Command Hub',
    officerId: user?.officerId || 'NER-CMD-2026-904',
    clearanceLevel: user?.clearanceLevel || 'Level 4 — Executive Command',
    telemetryInterval: user?.telemetryInterval || 5,
    soundAlerts: user?.soundAlerts ?? true,
    smsAlerts: user?.smsAlerts ?? true,
    theme: user?.theme || 'light'
  });

  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        designation: user.designation || '',
        department: user.department || '',
        station: user.station || '',
        officerId: user.officerId || 'NER-CMD-2026-904',
        clearanceLevel: user.clearanceLevel || 'Level 4 — Executive Command',
        telemetryInterval: user.telemetryInterval || 5,
        soundAlerts: user.soundAlerts ?? true,
        smsAlerts: user.smsAlerts ?? true,
        theme: user.theme || 'light'
      });
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    updateUser(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2500);
  };

  const handleRolePreset = (roleTitle, desig) => {
    const updated = {
      ...formData,
      role: roleTitle,
      designation: desig
    };
    setFormData(updated);
    updateUser(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-3xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto transform transition-all">
        
        {/* Header Hero Section */}
        <div className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-slate-900 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute right-5 top-5 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-indigo-500 border-2 border-white/40 flex items-center justify-center text-white font-black text-2xl shadow-lg shrink-0">
              {formData.name?.charAt(0) || 'O'}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1">
                <h2 className="text-xl font-black">{formData.name}</h2>
                <span className="bg-indigo-500/40 text-indigo-100 text-xs font-bold px-2.5 py-0.5 rounded-full border border-indigo-300/30">
                  {formData.officerId}
                </span>
                <span className="bg-emerald-500/30 text-emerald-200 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Shield size={12} /> Verified Officer
                </span>
              </div>
              <p className="text-indigo-200 text-xs sm:text-sm font-medium">{formData.designation}</p>
              <p className="text-indigo-300/80 text-xs mt-0.5">{formData.station} • {formData.department}</p>
            </div>
          </div>

          {/* Quick Tabs */}
          <div className="flex items-center gap-2 mt-6 border-t border-indigo-600/50 pt-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'profile'
                  ? 'bg-white text-indigo-900 shadow-sm'
                  : 'text-indigo-200 hover:bg-white/10'
              }`}
            >
              <User size={14} />
              <span>Officer Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('credentials')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'credentials'
                  ? 'bg-white text-indigo-900 shadow-sm'
                  : 'text-indigo-200 hover:bg-white/10'
              }`}
            >
              <Lock size={14} />
              <span>Security & Roles</span>
            </button>

            <button
              onClick={() => setActiveTab('preferences')}
              className={`px-4 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === 'preferences'
                  ? 'bg-white text-indigo-900 shadow-sm'
                  : 'text-indigo-200 hover:bg-white/10'
              }`}
            >
              <Sliders size={14} />
              <span>Telemetry & Alerts</span>
            </button>
          </div>
        </div>

        {/* Success Alert Banner */}
        {savedSuccess && (
          <div className="bg-emerald-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-bold animate-slideDown">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} />
              <span>Officer Profile & Command Settings updated successfully!</span>
            </div>
            <span>Auto-synced</span>
          </div>
        )}

        {/* Tab Content Body */}
        <div className="p-6 flex-1 overflow-y-auto min-h-0">
          {activeTab === 'profile' && (
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Official Mobile / Direct Line</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Command Hub / Station</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input
                      type="text"
                      value={formData.station}
                      onChange={(e) => setFormData({ ...formData, station: e.target.value })}
                      className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Official Designation & Title</label>
                <input
                  type="text"
                  value={formData.designation}
                  onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Ministry / Department</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-semibold text-slate-800 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-indigo-500/20"
                >
                  <Save size={14} />
                  <span>Save Profile Changes</span>
                </button>
              </div>
            </form>
          )}

          {activeTab === 'credentials' && (
            <div className="space-y-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="text-xs font-black uppercase tracking-wider text-slate-500">Security Credentials & Clearance</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Officer ID Token</span>
                    <span className="font-mono font-bold text-slate-800">{formData.officerId}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Clearance Level</span>
                    <span className="font-bold text-indigo-700">{formData.clearanceLevel}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Digital Encryption</span>
                    <span className="font-bold text-emerald-600">AES-256 Active</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Broadcast Rights</span>
                    <span className="font-bold text-slate-800">Full 8-State Scope</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700">Quick Switch Role Profile:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleRolePreset('Regional Logistics Commander', 'Director of North East Logistics & Disaster Transport')}
                    className="p-3 bg-indigo-50/70 border border-indigo-200 rounded-xl text-left hover:bg-indigo-100/70 transition-colors"
                  >
                    <span className="font-bold text-xs text-indigo-900 block">Command Director</span>
                    <span className="text-[10px] text-indigo-600">Full Operations Oversight</span>
                  </button>

                  <button
                    onClick={() => handleRolePreset('Field Response Officer', 'Senior Highway Incident Inspector (Assam/Meghalaya)')}
                    className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-left hover:bg-amber-100/70 transition-colors"
                  >
                    <span className="font-bold text-xs text-amber-900 block">Field Officer</span>
                    <span className="text-[10px] text-amber-600">Incident & Road Surveys</span>
                  </button>

                  <button
                    onClick={() => handleRolePreset('Fleet Dispatch Controller', 'Central Telematics & Vehicle Dispatch Manager')}
                    className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-left hover:bg-emerald-100/70 transition-colors"
                  >
                    <span className="font-bold text-xs text-emerald-900 block">Dispatch Controller</span>
                    <span className="text-[10px] text-emerald-600">Vehicle & Telematics Focus</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="space-y-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
                <h4 className="font-bold text-slate-800">Telemetry & Real-Time Monitoring</h4>
                
                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-800">GPS Telemetry Poll Rate</p>
                    <p className="text-slate-500 text-[11px]">Interval for live vehicle position stream</p>
                  </div>
                  <select
                    value={formData.telemetryInterval}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setFormData({ ...formData, telemetryInterval: val });
                      updateUser({ telemetryInterval: val });
                    }}
                    className="bg-white border border-slate-300 rounded-lg px-2.5 py-1 text-xs font-semibold text-slate-700"
                  >
                    <option value={3}>3 Seconds (High Precision)</option>
                    <option value={5}>5 Seconds (Recommended)</option>
                    <option value={15}>15 Seconds (Low Bandwidth)</option>
                  </select>
                </div>

                <div className="flex items-center justify-between py-2 border-b border-slate-200">
                  <div>
                    <p className="font-semibold text-slate-800">Critical Alert Audio Chime</p>
                    <p className="text-slate-500 text-[11px]">Play chime when landslide or critical blockage is reported</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.soundAlerts}
                    onChange={(e) => {
                      setFormData({ ...formData, soundAlerts: e.target.checked });
                      updateUser({ soundAlerts: e.target.checked });
                    }}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>

                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-semibold text-slate-800">Emergency SOS SMS Dispatch</p>
                    <p className="text-slate-500 text-[11px]">Send automatic SMS notification when Emergency SOS triggers</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.smsAlerts}
                    onChange={(e) => {
                      setFormData({ ...formData, smsAlerts: e.target.checked });
                      updateUser({ smsAlerts: e.target.checked });
                    }}
                    className="w-4 h-4 text-indigo-600 rounded"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <button
            onClick={logout}
            className="text-xs font-bold text-red-600 hover:text-red-800 underline"
          >
            Log Out of Platform
          </button>

          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-5 py-2 rounded-xl text-xs transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};

export default UserProfileModal;
