import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Bell, 
  User, 
  AlertTriangle, 
  PhoneCall, 
  MapPin, 
  Truck, 
  Route as RouteIcon, 
  X, 
  ChevronRight,
  ShieldAlert,
  Compass,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { format } from 'date-fns';
import { getDistricts, getVehicles } from '../../utils/api';
import EmergencySosModal from '../emergency/EmergencySosModal';
import { UserProfileModal } from '../profile/UserProfileModal';
import { useLanguage } from '../../context/LanguageContext';

// Static Highway list for search reference
const NER_HIGHWAYS = [
  { code: 'NH 27', name: 'East-West Highway (Silchar - Guwahati - Bongaigaon)', state: 'Assam' },
  { code: 'NH 6', name: 'Guwahati - Shillong - Silchar Corridor', state: 'Meghalaya / Assam' },
  { code: 'NH 2', name: 'Dibrugarh - Kohima - Imphal - Aizawl', state: 'Assam / Nagaland / Manipur' },
  { code: 'NH 10', name: 'Siliguri - Gangtok Himalayan Corridor', state: 'Sikkim' },
  { code: 'NH 8', name: 'Agartala - Karimganj - Tripura Gateway', state: 'Tripura' },
  { code: 'NH 13', name: 'Trans-Arunachal Highway (Tawang - Pasighat)', state: 'Arunachal Pradesh' },
  { code: 'NH 15', name: 'Baihat - Tezpur - Dibrugarh North Bank', state: 'Assam' },
  { code: 'NH 102', name: 'Imphal - Moreh Border Highway', state: 'Manipur' },
];

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  
  const [time, setTime] = useState(new Date());
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [allDistricts, setAllDistricts] = useState([]);
  const [allVehicles, setAllVehicles] = useState([]);
  const [searchResults, setSearchResults] = useState({ districts: [], vehicles: [], highways: [] });

  const searchContainerRef = useRef(null);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Fetch districts and vehicles on load for instant global search indexing
  useEffect(() => {
    const loadSearchIndex = async () => {
      try {
        const [distRes, vehRes] = await Promise.allSettled([
          getDistricts(),
          getVehicles()
        ]);

        if (distRes.status === 'fulfilled' && distRes.value.data?.data) {
          setAllDistricts(distRes.value.data.data);
        }
        if (vehRes.status === 'fulfilled' && vehRes.value.data?.data) {
          setAllVehicles(vehRes.value.data.data);
        }
      } catch (err) {
        console.error('Error loading search index:', err);
      }
    };

    loadSearchIndex();
  }, []);

  // Live search filtering
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) {
      setSearchResults({ districts: [], vehicles: [], highways: [] });
      setIsSearchDropdownOpen(false);
      return;
    }

    const matchedDistricts = allDistricts.filter(d => 
      d.name.toLowerCase().includes(query) || 
      d.state.toLowerCase().includes(query)
    ).slice(0, 4);

    const matchedVehicles = allVehicles.filter(v => 
      (v.vehicle_number && v.vehicle_number.toLowerCase().includes(query)) ||
      (v.driver_name && v.driver_name.toLowerCase().includes(query)) ||
      (v.type && v.type.toLowerCase().includes(query))
    ).slice(0, 4);

    const matchedHighways = NER_HIGHWAYS.filter(h => 
      h.code.toLowerCase().includes(query) || 
      h.name.toLowerCase().includes(query) || 
      h.state.toLowerCase().includes(query)
    ).slice(0, 3);

    setSearchResults({
      districts: matchedDistricts,
      vehicles: matchedVehicles,
      highways: matchedHighways
    });

    setIsSearchDropdownOpen(
      matchedDistricts.length > 0 || 
      matchedVehicles.length > 0 || 
      matchedHighways.length > 0
    );
  }, [searchQuery, allDistricts, allVehicles]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectDistrict = (district) => {
    setIsSearchDropdownOpen(false);
    setSearchQuery('');
    // Navigate to Route Optimizer and trigger routing view
    navigate('/routes');
  };

  const handleSelectVehicle = (vehicle) => {
    setIsSearchDropdownOpen(false);
    setSearchQuery('');
    // Navigate to Vehicles telematics view
    navigate('/vehicles');
  };

  const handleSelectHighway = (highway) => {
    setIsSearchDropdownOpen(false);
    setSearchQuery('');
    navigate('/routes');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    if (searchResults.districts.length > 0) {
      handleSelectDistrict(searchResults.districts[0]);
    } else if (searchResults.vehicles.length > 0) {
      handleSelectVehicle(searchResults.vehicles[0]);
    } else {
      navigate('/routes');
      setIsSearchDropdownOpen(false);
    }
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Operational Overview';
    if (path === '/map') return 'GIS Accessibility Map';
    if (path === '/vehicles') return 'Fleet GPS Telematics';
    if (path === '/routes') return 'AI Route Optimizer';
    if (path === '/alerts') return 'Emergency Alerts Center';
    if (path === '/reports') return 'Field Officer Incident Reports';
    if (path === '/analytics') return 'AI Intelligence & Supply Chain';
    return path.substring(1).charAt(0).toUpperCase() + path.substring(2);
  };

  const totalResultsCount = searchResults.districts.length + searchResults.vehicles.length + searchResults.highways.length;

  return (
    <>
      <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-6 z-20 sticky top-0 shadow-xs">
        {/* Page Title */}
        <div className="flex items-center gap-3">
          <h1 className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight">{getPageTitle()}</h1>
        </div>
        
        {/* Right Actions: Search + SOS + Time + Notifications + Profile */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          
          {/* Global Search Bar */}
          <div className="relative" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={17} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchQuery.trim()) setIsSearchDropdownOpen(true);
                }}
                placeholder="Search districts, vehicles, NH..." 
                className="pl-10 pr-9 py-2 border border-slate-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 w-52 sm:w-72 bg-slate-50/50 transition-all focus:bg-white focus:w-80"
              />
              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => { setSearchQuery(''); setIsSearchDropdownOpen(false); }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={15} />
                </button>
              )}
            </form>

            {/* Live Search Results Dropdown */}
            {isSearchDropdownOpen && totalResultsCount > 0 && (
              <div className="absolute left-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden z-50 animate-fadeIn">
                <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>Quick Results ({totalResultsCount} found)</span>
                  <span className="text-[11px] text-slate-400">Click to navigate</span>
                </div>

                <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                  {/* Districts */}
                  {searchResults.districts.length > 0 && (
                    <div className="p-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1">
                        <MapPin size={12} className="text-indigo-500" />
                        <span>Districts & Hubs</span>
                      </div>
                      {searchResults.districts.map(d => (
                        <button
                          key={d.id || d.name}
                          onClick={() => handleSelectDistrict(d)}
                          className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-indigo-50/80 flex items-center justify-between transition-colors group"
                        >
                          <div>
                            <span className="font-bold text-xs text-slate-800 group-hover:text-indigo-700">{d.name}</span>
                            <span className="text-[11px] text-slate-500 block">{d.state} • Elev: {d.elevation}m</span>
                          </div>
                          <span className="text-[10px] bg-slate-100 group-hover:bg-indigo-100 group-hover:text-indigo-700 text-slate-600 px-2 py-0.5 rounded font-semibold">
                            Route
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Vehicles */}
                  {searchResults.vehicles.length > 0 && (
                    <div className="p-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1">
                        <Truck size={12} className="text-emerald-500" />
                        <span>Fleet Vehicles</span>
                      </div>
                      {searchResults.vehicles.map(v => (
                        <button
                          key={v.id}
                          onClick={() => handleSelectVehicle(v)}
                          className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-emerald-50/80 flex items-center justify-between transition-colors group"
                        >
                          <div>
                            <span className="font-bold text-xs text-slate-800 group-hover:text-emerald-700">{v.vehicle_number}</span>
                            <span className="text-[11px] text-slate-500 block">Driver: {v.driver_name || 'Assigned'} • {v.type}</span>
                          </div>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-semibold uppercase">
                            {v.status || 'Active'}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Highway Corridors */}
                  {searchResults.highways.length > 0 && (
                    <div className="p-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 flex items-center gap-1">
                        <RouteIcon size={12} className="text-amber-500" />
                        <span>Highways & Corridors</span>
                      </div>
                      {searchResults.highways.map(h => (
                        <button
                          key={h.code}
                          onClick={() => handleSelectHighway(h)}
                          className="w-full text-left px-2.5 py-2 rounded-xl hover:bg-amber-50/80 flex items-center justify-between transition-colors group"
                        >
                          <div>
                            <span className="font-bold text-xs text-slate-800 group-hover:text-amber-800">{h.code}</span>
                            <span className="text-[11px] text-slate-500 block">{h.name}</span>
                          </div>
                          <ArrowRight size={14} className="text-slate-400 group-hover:text-amber-600" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Emergency SOS Button */}
          <button 
            onClick={() => setIsSosOpen(true)}
            className="bg-red-600 hover:bg-red-700 active:bg-red-800 text-white px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center space-x-2 transition-all shadow-md shadow-red-500/20 transform hover:scale-[1.02] cursor-pointer"
            title="Open Emergency SOS Police & Family Dialing Console"
          >
            <AlertTriangle size={17} className="animate-pulse" />
            <span className="tracking-wide">Emergency SOS</span>
          </button>

          {/* Live Date & Time Clock */}
          <div className="hidden xl:block text-xs font-semibold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            {format(time, 'dd MMM yyyy, HH:mm:ss')} IST
          </div>

          {/* Alerts Notification Bell */}
          <button 
            onClick={() => navigate('/alerts')}
            className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            title="View Active Emergency Alerts"
          >
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center space-x-2.5 border-l border-slate-200 pl-4">
            <button
              onClick={() => setIsProfileOpen(true)}
              className="w-8 h-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center font-bold text-xs shadow-sm transition-all hover:scale-105 cursor-pointer"
              title="View & Edit Officer Profile"
            >
              {user?.name?.charAt(0) || 'O'}
            </button>
            <div className="hidden md:flex flex-col">
              <button
                onClick={() => setIsProfileOpen(true)}
                className="text-xs font-bold text-slate-800 hover:text-indigo-600 leading-tight text-left cursor-pointer transition-colors"
              >
                {user?.name || 'Officer / Admin'}
              </button>
              <button 
                onClick={logout} 
                className="text-[11px] text-slate-500 hover:text-red-600 text-left font-medium transition-colors cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Emergency SOS Modal Dialog */}
      <EmergencySosModal 
        isOpen={isSosOpen} 
        onClose={() => setIsSosOpen(false)} 
      />

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </>
  );
};

export default Header;
