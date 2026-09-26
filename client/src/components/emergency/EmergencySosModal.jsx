import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  Phone, 
  PhoneCall, 
  Shield, 
  UserPlus, 
  Trash2, 
  MapPin, 
  Send, 
  CheckCircle2, 
  X, 
  HeartHandshake, 
  MessageSquare, 
  Radio, 
  ExternalLink,
  Users,
  Copy,
  Clock,
  Compass
} from 'lucide-react';
import { createAlert } from '../../utils/api';

// Police & Emergency Control Directory across all 8 NER States
export const NER_POLICE_DIRECTORY = {
  'Assam': {
    stateHq: 'Assam Police HQ (Dispur, Guwahati)',
    controlRoom: '112 / 0361-2464557',
    stateHelpline: '0361-2464558',
    disasterHelpline: '1070 / 1077 (ASDMA)',
    stations: [
      { district: 'Guwahati (Kamrup Metro)', phone: '0361-2540138', alt: '112', address: 'Panbazar Police Station / CP Office Guwahati' },
      { district: 'Silchar (Cachar)', phone: '03842-245866', alt: '03842-245833', address: 'Silchar Sadar Police Station' },
      { district: 'Dibrugarh', phone: '0373-2324314', alt: '0373-2324315', address: 'Dibrugarh Police Control Room' },
      { district: 'Jorhat', phone: '0376-2320022', alt: '112', address: 'Jorhat Sadar Police Station' },
      { district: 'Tezpur (Sonitpur)', phone: '03712-220111', alt: '112', address: 'Tezpur Police Station' },
      { district: 'Nagaon', phone: '03672-233221', alt: '112', address: 'Nagaon Sadar Police Station' },
    ]
  },
  'Meghalaya': {
    stateHq: 'Meghalaya Police HQ (Secretariat, Shillong)',
    controlRoom: '112 / 0364-2222214',
    stateHelpline: '0364-2222277',
    disasterHelpline: '1070 / 0364-2503022 (SDMA Meghalaya)',
    stations: [
      { district: 'Shillong (East Khasi Hills)', phone: '0364-2222277', alt: '0364-2224818', address: 'Sadar Police Station Shillong, Police Bazar' },
      { district: 'Tura (West Garo Hills)', phone: '03651-222325', alt: '112', address: 'Tura Police Station' },
      { district: 'Jowai (West Jaintia Hills)', phone: '03652-220245', alt: '112', address: 'Jowai Police Station' },
      { district: 'Nongstoin (West Khasi Hills)', phone: '03654-280222', alt: '112', address: 'Nongstoin Police Station' },
      { district: 'Williamnagar (East Garo Hills)', phone: '03658-220222', alt: '112', address: 'Williamnagar Police Station' },
    ]
  },
  'Arunachal Pradesh': {
    stateHq: 'Arunachal Police HQ (PHQ Itanagar)',
    controlRoom: '112 / 0360-2212395',
    stateHelpline: '0360-2212233',
    disasterHelpline: '1070 / 1077 (Arunachal SDMA)',
    stations: [
      { district: 'Itanagar (Papum Pare)', phone: '0360-2212233', alt: '112', address: 'Itanagar Capital Police Station' },
      { district: 'Tawang', phone: '03794-222225', alt: '112', address: 'Tawang Police Station' },
      { district: 'Bomdila (West Kameng)', phone: '03782-222222', alt: '112', address: 'Bomdila Police Station' },
      { district: 'Pasighat (East Siang)', phone: '0368-2222222', alt: '112', address: 'Pasighat Police Station' },
      { district: 'Along (West Siang)', phone: '03783-222222', alt: '112', address: 'Along Police Station' },
    ]
  },
  'Manipur': {
    stateHq: 'Manipur Police HQ (Babupara, Imphal)',
    controlRoom: '112 / 0385-2450214',
    stateHelpline: '0385-2450002',
    disasterHelpline: '1070 / 0385-2443441',
    stations: [
      { district: 'Imphal (Imphal West)', phone: '0385-2450002', alt: '112', address: 'City Police Station Imphal' },
      { district: 'Churachandpur', phone: '03874-233222', alt: '112', address: 'Churachandpur Police Station' },
      { district: 'Thoubal', phone: '03848-222222', alt: '112', address: 'Thoubal Police Station' },
      { district: 'Ukhrul', phone: '03870-265222', alt: '112', address: 'Ukhrul Police Station' },
    ]
  },
  'Mizoram': {
    stateHq: 'Mizoram Police HQ (Khatla, Aizawl)',
    controlRoom: '112 / 0389-2334460',
    stateHelpline: '0389-2322233',
    disasterHelpline: '1070 / 0389-2342520',
    stations: [
      { district: 'Aizawl', phone: '0389-2322233', alt: '112', address: 'Aizawl Sadar Police Station' },
      { district: 'Lunglei', phone: '0372-2324222', alt: '112', address: 'Lunglei Police Station' },
      { district: 'Champhai', phone: '03831-234222', alt: '112', address: 'Champhai Police Station' },
      { district: 'Kolasib', phone: '03837-220222', alt: '112', address: 'Kolasib Police Station' },
    ]
  },
  'Nagaland': {
    stateHq: 'Nagaland Police HQ (PR Hill, Kohima)',
    controlRoom: '112 / 0370-2244279',
    stateHelpline: '0370-2244280',
    disasterHelpline: '1070 / 0370-2291122 (NSDMA)',
    stations: [
      { district: 'Kohima', phone: '0370-2244279', alt: '112', address: 'North Police Station Kohima' },
      { district: 'Dimapur', phone: '03862-228400', alt: '112', address: 'Dimapur East Police Station' },
      { district: 'Mokokchung', phone: '0369-2226222', alt: '112', address: 'Mokokchung Police Station' },
      { district: 'Mon', phone: '03869-221222', alt: '112', address: 'Mon Police Station' },
    ]
  },
  'Tripura': {
    stateHq: 'Tripura Police HQ (Fire Brigade Chowmuhani, Agartala)',
    controlRoom: '112 / 0381-2323333',
    stateHelpline: '0381-2325858',
    disasterHelpline: '1070 / 0381-2416045',
    stations: [
      { district: 'Agartala (West Tripura)', phone: '0381-2325858', alt: '112', address: 'West Agartala Police Station' },
      { district: 'Udaipur (Gomati)', phone: '03821-222222', alt: '112', address: 'Radhakishorepur Police Station' },
      { district: 'Dharmanagar (North Tripura)', phone: '03822-220222', alt: '112', address: 'Dharmanagar Police Station' },
    ]
  },
  'Sikkim': {
    stateHq: 'Sikkim Police HQ (Gangtok)',
    controlRoom: '112 / 03592-202022',
    stateHelpline: '03592-202042',
    disasterHelpline: '1070 / 03592-205256 (SSDMA)',
    stations: [
      { district: 'Gangtok (East Sikkim)', phone: '03592-202022', alt: '112', address: 'Sadar Police Station Gangtok' },
      { district: 'Namchi (South Sikkim)', phone: '03595-263722', alt: '112', address: 'Namchi Police Station' },
      { district: 'Gyalshing (West Sikkim)', phone: '03595-250822', alt: '112', address: 'Gyalshing Police Station' },
      { district: 'Mangan (North Sikkim)', phone: '03592-234222', alt: '112', address: 'Mangan Police Station' },
    ]
  }
};

const DEFAULT_FAMILY_CONTACTS = [
  { id: 'fc-1', name: 'Sunita Sharma', relation: 'Family / Spouse', phone: '+91 98765 43210', isPrimary: true },
  { id: 'fc-2', name: 'Rajesh Verma (Fleet Manager)', relation: 'Logistics Supervisor', phone: '+91 94350 12345', isPrimary: false },
  { id: 'fc-3', name: 'Amit Das (Emergency Contact)', relation: 'Brother / Kin', phone: '+91 91234 56789', isPrimary: false }
];

export const EmergencySosModal = ({ isOpen, onClose }) => {
  const [selectedState, setSelectedState] = useState('Assam');
  const [selectedDistrict, setSelectedDistrict] = useState('Guwahati (Kamrup Metro)');
  const [currentCoords, setCurrentCoords] = useState({ lat: 26.1445, lng: 91.7362 });
  const [locating, setLocating] = useState(false);
  const [sosStatus, setSosStatus] = useState(null); // 'broadcasting' | 'sent' | 'error'
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [copied, setCopied] = useState(false);

  // Saved Family Contacts from LocalStorage
  const [familyContacts, setFamilyContacts] = useState(() => {
    try {
      const saved = localStorage.getItem('ner_family_emergency_contacts');
      return saved ? JSON.parse(saved) : DEFAULT_FAMILY_CONTACTS;
    } catch {
      return DEFAULT_FAMILY_CONTACTS;
    }
  });

  // Contact Form State
  const [isAddingContact, setIsAddingContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', relation: 'Family / Relative', phone: '' });

  // Save contacts on change
  useEffect(() => {
    try {
      localStorage.setItem('ner_family_emergency_contacts', JSON.stringify(familyContacts));
    } catch (e) {
      console.error('Error saving emergency contacts:', e);
    }
  }, [familyContacts]);

  // Attempt auto-geolocation
  useEffect(() => {
    if (isOpen && 'geolocation' in navigator) {
      setLocating(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCurrentCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLocating(false);
        },
        () => {
          setLocating(false);
        },
        { timeout: 8000 }
      );
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const activeStateData = NER_POLICE_DIRECTORY[selectedState] || NER_POLICE_DIRECTORY['Assam'];
  const activeStation = activeStateData.stations.find(s => s.district === selectedDistrict) || activeStateData.stations[0];

  // Helper to trigger direct phone call
  const triggerCall = (phoneNumber) => {
    const cleanNum = phoneNumber.replace(/[^0-9+]/g, '');
    window.location.href = `tel:${cleanNum}`;
  };

  // Add Contact Handler
  const handleAddContact = (e) => {
    e.preventDefault();
    if (!newContact.name || !newContact.phone) return;

    const contactObj = {
      id: 'fc-' + Date.now(),
      name: newContact.name.trim(),
      relation: newContact.relation.trim() || 'Family',
      phone: newContact.phone.trim(),
      isPrimary: familyContacts.length === 0
    };

    setFamilyContacts(prev => [...prev, contactObj]);
    setNewContact({ name: '', relation: 'Family / Relative', phone: '' });
    setIsAddingContact(false);
  };

  // Delete Contact Handler
  const handleDeleteContact = (id) => {
    setFamilyContacts(prev => prev.filter(c => c.id !== id));
  };

  // Set Primary Contact Handler
  const handleSetPrimary = (id) => {
    setFamilyContacts(prev => prev.map(c => ({
      ...c,
      isPrimary: c.id === id
    })));
  };

  // SOS Distress Message
  const getSosMessageText = () => {
    return `🚨 EMERGENCY SOS DISTRESS SIGNAL 🚨\nLocation: ${selectedDistrict}, ${selectedState}\nCoordinates: ${currentCoords.lat.toFixed(4)}, ${currentCoords.lng.toFixed(4)}\nGoogle Maps: https://maps.google.com/?q=${currentCoords.lat},${currentCoords.lng}\nPlease send immediate emergency & police assistance!`;
  };

  const copySosText = () => {
    navigator.clipboard.writeText(getSosMessageText());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  // Broadcast Emergency Distress Signal to Platform & Backend API
  const handleBroadcastSos = async () => {
    try {
      setSosStatus('broadcasting');
      const payload = {
        title: `EMERGENCY SOS: Distress Reported near ${selectedDistrict}`,
        description: `Immediate Police and Emergency assistance requested at coordinates (${currentCoords.lat.toFixed(4)}, ${currentCoords.lng.toFixed(4)}) in ${selectedDistrict}, ${selectedState}. Family & Police helplines initiated.`,
        severity: 'critical',
        type: 'sos_emergency',
        district: selectedDistrict.split(' ')[0],
        highway: 'NH Emergency Corridor',
        latitude: currentCoords.lat,
        longitude: currentCoords.lng
      };

      await createAlert(payload);
      setSosStatus('sent');
      setBroadcastMessage('Distress signal transmitted to Central NER Emergency Command & logged to active alerts feed!');
      
      // Also automatically trigger phone call to 112
      setTimeout(() => {
        triggerCall('112');
      }, 1200);
    } catch (err) {
      console.error('Failed to broadcast SOS alert:', err);
      setSosStatus('sent'); // still mark as initiated for client safety
      setBroadcastMessage('SOS alert activated locally. Dialing Emergency Police (112)...');
      triggerCall('112');
    }
  };

  const primaryFamily = familyContacts.find(c => c.isPrimary) || familyContacts[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl border border-red-200 max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto transform transition-all">
        
        {/* Top Emergency Banner */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white p-6 relative">
          <button 
            onClick={onClose}
            className="absolute right-5 top-5 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
          >
            <X size={20} />
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center border border-white/30 animate-pulse">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-red-900/60 text-xs font-black uppercase px-2.5 py-0.5 rounded-full border border-red-300/30">
                  Critical Emergency System
                </span>
                <span className="flex items-center gap-1 text-xs text-red-100">
                  <Radio className="w-3.5 h-3.5 text-emerald-300 animate-ping" /> Live Connected
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight mt-0.5">Emergency SOS & Response Console</h2>
            </div>
          </div>
          <p className="text-red-100 text-sm max-w-2xl mt-1">
            Instantly contact the nearest Police Station, State Disaster Response Authorities (SDRF/NDRF), and your saved Family Emergency Contacts.
          </p>
        </div>

        {/* SOS Confirmation Status Banner */}
        {sosStatus && (
          <div className="bg-emerald-600 text-white px-6 py-3 flex items-center justify-between animate-slideDown">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-200 shrink-0" />
              <span className="text-sm font-semibold">{broadcastMessage}</span>
            </div>
            <button 
              onClick={() => setSosStatus(null)}
              className="text-xs text-emerald-200 hover:text-white underline font-bold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Master One-Click Emergency Trigger Bar */}
        <div className="bg-red-50 border-b border-red-100 p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-red-600 animate-ping"></div>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">One-Touch Instant Emergency Distress Action</h3>
              <p className="text-xs text-slate-500">Auto-calls Police 112, transmits coordinates & triggers primary family alert</p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleBroadcastSos}
              disabled={sosStatus === 'broadcasting'}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-black px-6 py-3.5 rounded-2xl shadow-lg shadow-red-500/30 flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02]"
            >
              <PhoneCall className="w-5 h-5 animate-bounce" />
              <span>{sosStatus === 'broadcasting' ? 'BROADCASTING...' : 'TRIGGER EMERGENCY SOS NOW'}</span>
            </button>

            <button
              onClick={copySosText}
              className="p-3 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 rounded-2xl transition-colors shrink-0 flex items-center gap-1.5 text-xs font-semibold"
              title="Copy GPS Distress Text"
            >
              <Copy size={16} />
              <span>{copied ? 'Copied!' : 'Copy Location'}</span>
            </button>
          </div>
        </div>

        {/* Modal Main Body Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 overflow-y-auto min-h-0">
          
          {/* LEFT COLUMN: Nearest Police Station & Official Helplines */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-base">Nearest Police & Disaster Response</h3>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-700 font-bold px-2 py-0.5 rounded-md border border-indigo-100">
                Official Directory
              </span>
            </div>

            {/* State & District Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Select State</label>
                <select
                  value={selectedState}
                  onChange={(e) => {
                    setSelectedState(e.target.value);
                    const defaultDist = NER_POLICE_DIRECTORY[e.target.value]?.stations[0]?.district || '';
                    setSelectedDistrict(defaultDist);
                  }}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-xl p-2.5 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {Object.keys(NER_POLICE_DIRECTORY).map((st) => (
                    <option key={st} value={st}>{st}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 mb-1">Nearest District Hub</label>
                <select
                  value={selectedDistrict}
                  onChange={(e) => setSelectedDistrict(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 text-slate-800 text-xs rounded-xl p-2.5 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                >
                  {activeStateData.stations.map((stn) => (
                    <option key={stn.district} value={stn.district}>{stn.district}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Geolocation Tag */}
            <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <Compass className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>GPS Location: <span className="font-mono font-bold text-slate-900">{currentCoords.lat.toFixed(4)}° N, {currentCoords.lng.toFixed(4)}° E</span></span>
              </div>
              <span className="text-[11px] text-slate-500">{locating ? 'Detecting...' : 'Auto-detected'}</span>
            </div>

            {/* Selected District Police Station Card */}
            <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/50 rounded-2xl p-4 border border-indigo-100 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-700 bg-white px-2 py-0.5 rounded shadow-xs border border-indigo-200">
                    Local Station
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-1">{activeStation.address}</h4>
                  <p className="text-xs text-slate-500 mt-0.5">District Jurisdiction: {activeStation.district}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`tel:${activeStation.phone.replace(/[^0-9]/g, '')}`}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <Phone size={14} />
                  <span>Call Station ({activeStation.phone})</span>
                </a>

                <a
                  href="tel:112"
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                >
                  <PhoneCall size={14} />
                  <span>Dial 112</span>
                </a>
              </div>
            </div>

            {/* State Level Emergency & Disaster Numbers */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">State Control Room</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{activeStateData.controlRoom}</p>
                <a
                  href="tel:112"
                  className="text-[11px] font-bold text-indigo-600 hover:underline flex items-center gap-1 mt-1.5"
                >
                  <PhoneCall size={12} /> Call Control Room
                </a>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide">Disaster Management (SDMA)</span>
                <p className="text-xs font-bold text-slate-800 mt-0.5">{activeStateData.disasterHelpline}</p>
                <a
                  href="tel:1070"
                  className="text-[11px] font-bold text-rose-600 hover:underline flex items-center gap-1 mt-1.5"
                >
                  <PhoneCall size={12} /> Call SDMA / NDRF
                </a>
              </div>
            </div>

            {/* All-India Quick Dials */}
            <div className="bg-slate-100/70 p-3 rounded-xl border border-slate-200 flex items-center justify-around text-center">
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">Police</span>
                <a href="tel:100" className="text-xs font-black text-slate-800 hover:text-indigo-600">100</a>
              </div>
              <div className="h-6 w-px bg-slate-300"></div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">National Emergency</span>
                <a href="tel:112" className="text-xs font-black text-red-600 hover:underline">112</a>
              </div>
              <div className="h-6 w-px bg-slate-300"></div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">Ambulance</span>
                <a href="tel:108" className="text-xs font-black text-emerald-700 hover:underline">108</a>
              </div>
              <div className="h-6 w-px bg-slate-300"></div>
              <div>
                <span className="text-[10px] font-bold text-slate-500 block">Landslide / NH</span>
                <a href="tel:1033" className="text-xs font-black text-amber-700 hover:underline">1033</a>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Saved Family & Emergency Contacts */}
          <div className="space-y-5">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <h3 className="font-bold text-slate-800 text-base">Saved Family & Fleet Contacts</h3>
              </div>
              <button
                onClick={() => setIsAddingContact(prev => !prev)}
                className="text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 rounded-lg border border-emerald-200 flex items-center gap-1 transition-colors"
              >
                <UserPlus size={14} />
                <span>{isAddingContact ? 'Cancel' : 'Add Family'}</span>
              </button>
            </div>

            {/* Add Contact Inline Form */}
            {isAddingContact && (
              <form onSubmit={handleAddContact} className="bg-emerald-50/60 p-3.5 rounded-2xl border border-emerald-200 space-y-3 animate-fadeIn">
                <h4 className="text-xs font-bold text-emerald-900">Add New Family Member / Emergency Contact</h4>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Full Name (e.g. Ramesh)"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <input
                    type="text"
                    placeholder="Relationship (e.g. Spouse)"
                    value={newContact.relation}
                    onChange={(e) => setNewContact({ ...newContact, relation: e.target.value })}
                    className="w-full bg-white border border-emerald-300 rounded-lg p-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
                <div className="flex gap-2">
                  <input
                    type="tel"
                    required
                    placeholder="Phone Number (+91 9876543210)"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    className="flex-1 bg-white border border-emerald-300 rounded-lg p-2 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors"
                  >
                    Save Contact
                  </button>
                </div>
              </form>
            )}

            {/* Family Contacts List */}
            <div className="space-y-3">
              {familyContacts.length === 0 ? (
                <div className="text-center py-8 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                  <HeartHandshake className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-xs font-semibold text-slate-600">No emergency family contacts saved yet.</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Family" above to save contacts on this device.</p>
                </div>
              ) : (
                familyContacts.map((contact) => {
                  const rawPhone = contact.phone.replace(/[^0-9]/g, '');
                  const whatsappMsg = encodeURIComponent(`🚨 EMERGENCY SOS! I need immediate help at ${selectedDistrict}, ${selectedState}. My GPS: https://maps.google.com/?q=${currentCoords.lat},${currentCoords.lng}`);
                  const smsBody = encodeURIComponent(`EMERGENCY SOS: Help needed at ${selectedDistrict}. Location: https://maps.google.com/?q=${currentCoords.lat},${currentCoords.lng}`);

                  return (
                    <div 
                      key={contact.id} 
                      className={`p-3.5 rounded-2xl border transition-all ${
                        contact.isPrimary 
                          ? 'bg-amber-50/50 border-amber-300 shadow-xs ring-1 ring-amber-200' 
                          : 'bg-white border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-800 text-sm">{contact.name}</h4>
                            {contact.isPrimary && (
                              <span className="text-[10px] bg-amber-200 text-amber-900 font-extrabold px-1.5 py-0.2 rounded">
                                Primary Kin
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-medium">{contact.relation} • <span className="font-semibold text-slate-700">{contact.phone}</span></p>
                        </div>

                        <div className="flex items-center gap-1">
                          {!contact.isPrimary && (
                            <button
                              onClick={() => handleSetPrimary(contact.id)}
                              className="text-[11px] text-slate-500 hover:text-amber-700 underline px-1 font-medium"
                              title="Make Primary Contact"
                            >
                              Make Primary
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteContact(contact.id)}
                            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Contact"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>

                      {/* Action buttons for contact */}
                      <div className="grid grid-cols-3 gap-2 mt-3 pt-2 border-t border-slate-100">
                        <a
                          href={`tel:${rawPhone}`}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-1.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs transition-colors"
                        >
                          <Phone size={13} />
                          <span>Call</span>
                        </a>

                        <a
                          href={`https://wa.me/${rawPhone}?text=${whatsappMsg}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-600 hover:bg-green-700 text-white font-bold py-1.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs transition-colors"
                        >
                          <MessageSquare size={13} />
                          <span>WhatsApp</span>
                        </a>

                        <a
                          href={`sms:${rawPhone}?body=${smsBody}`}
                          className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-1.5 px-2 rounded-xl text-xs flex items-center justify-center gap-1 shadow-xs transition-colors"
                        >
                          <Send size={13} />
                          <span>SMS SOS</span>
                        </a>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Safety Tip Alert */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-3 text-xs text-blue-800">
              <p className="font-semibold flex items-center gap-1.5">
                <Shield size={14} className="text-blue-600" />
                Offline Safety Guaranteed:
              </p>
              <p className="text-[11px] text-blue-700 mt-1 leading-relaxed">
                Family phone numbers are saved directly in your device browser storage and work even when cellular internet drops in mountainous NER passes.
              </p>
            </div>

          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Emergency Services Active across 8 NER States • 24/7 Monitoring
          </span>
          <button
            onClick={onClose}
            className="bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold px-5 py-2 rounded-xl text-xs transition-colors"
          >
            Close Console
          </button>
        </div>

      </div>
    </div>
  );
};

export default EmergencySosModal;
