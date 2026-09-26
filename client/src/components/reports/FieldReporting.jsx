import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { 
  FileText, 
  MapPin, 
  AlertTriangle, 
  ShieldAlert, 
  Camera, 
  Upload, 
  CheckCircle2, 
  Clock, 
  Navigation,
  RefreshCw,
  Layers,
  Image as ImageIcon
} from 'lucide-react';
import { getDistricts, submitReport, getReports } from '../../utils/api';
import { formatDistanceToNow } from 'date-fns';
import LoadingSpinner from '../common/LoadingSpinner';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const incidentIcon = (severity) => {
  const color = severity === 'critical' || severity === 'high' ? '#EF4444' : severity === 'medium' ? '#F59E0B' : '#3B82F6';
  return L.divIcon({
    className: 'incident-marker-pin',
    html: `<div style="background-color: ${color}; width: 18px; height: 18px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 8px rgba(0,0,0,0.4);"></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const FieldReporting = () => {
  const [districts, setDistricts] = useState([]);
  const [reports, setReports] = useState([]);
  const [loadingReports, setLoadingReports] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Form state
  const [incidentType, setIncidentType] = useState('landslide');
  const [severity, setSeverity] = useState('high');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [description, setDescription] = useState('');
  const [lat, setLat] = useState('26.1445');
  const [lng, setLng] = useState('91.7362');
  const [photoPreview, setPhotoPreview] = useState(null);

  // Fetch initial districts and existing reports
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dRes, rRes] = await Promise.all([getDistricts(), getReports({ limit: 50 })]);
        if (dRes.data?.success) {
          const list = dRes.data.data;
          setDistricts(list);
          if (list.length > 0) {
            setSelectedDistrict(list[0].id);
            setLat(list[0].lat.toString());
            setLng(list[0].lng.toString());
          }
        }
        if (rRes.data?.success) {
          setReports(rRes.data.data || []);
        }
      } catch (err) {
        console.error('Failed to load field reporting data:', err);
      } finally {
        setLoadingReports(false);
      }
    };
    fetchData();
  }, []);

  // Update coordinates when district changes
  const handleDistrictChange = (distId) => {
    setSelectedDistrict(distId);
    const d = districts.find(item => item.id === distId);
    if (d) {
      setLat(d.lat.toString());
      setLng(d.lng.toString());
    }
  };

  // Auto-detect browser GPS
  const handleAutoGPS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setLat(pos.coords.latitude.toFixed(4));
          setLng(pos.coords.longitude.toFixed(4));
        },
        (err) => {
          console.warn('Geolocation denied, using default NER coordinates:', err);
        }
      );
    }
  };

  // Photo upload handling
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit Field Report
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!description.trim()) {
      setErrorMessage('Please enter an incident description.');
      return;
    }

    setErrorMessage('');
    setSuccessMessage('');
    setSubmitting(true);

    try {
      const payload = {
        incident_type: incidentType,
        severity,
        district_id: selectedDistrict,
        description,
        lat: parseFloat(lat) || 26.2,
        lng: parseFloat(lng) || 92.9,
        photo_data: photoPreview
      };

      const response = await submitReport(payload);

      if (response.data?.success) {
        const newReport = response.data.data;
        setReports(prev => [newReport, ...prev]);
        setSuccessMessage('Field incident report submitted successfully! Alert dispatched to central dashboard.');
        setDescription('');
        setPhotoPreview(null);
      } else {
        setErrorMessage(response.data?.error || 'Failed to submit field report.');
      }
    } catch (err) {
      console.error('Report submission error:', err);
      setErrorMessage(err.response?.data?.error || 'Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            Field Incident Reporting & Ground Intelligence
          </h2>
          <p className="text-slate-500 text-sm mt-0.5">
            Log geo-tagged road blockages, bridge damage, landslides, and flood incidents from the field.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Side: Submission Form */}
        <div className="lg:col-span-5 bg-white rounded-2xl shadow-sm border border-slate-200 p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-600" />
              Submit Incident Report
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">Dispatches alerts to all emergency response units</p>
          </div>

          {successMessage && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-800 px-4 py-3 rounded-xl text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs font-medium">
            <div className="grid grid-cols-2 gap-3">
              {/* Incident Type */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Incident Type</label>
                <select
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 font-semibold"
                >
                  <option value="landslide">Landslide / Rockfall</option>
                  <option value="flood">Flash Flood / Inundation</option>
                  <option value="road_damage">Road Damage / Pothole</option>
                  <option value="bridge_collapse">Bridge Damage / Crack</option>
                  <option value="traffic_block">Traffic Gridlock / Stalled Truck</option>
                  <option value="severe_weather">Fallen Tree / Heavy Rain</option>
                </select>
              </div>

              {/* Severity Level */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Severity Level</label>
                <select
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500 font-bold text-slate-800"
                >
                  <option value="critical">Critical (Road Blocked)</option>
                  <option value="high">High (Major Delays)</option>
                  <option value="medium">Medium (Slow Passable)</option>
                  <option value="low">Low (Advisory Only)</option>
                </select>
              </div>
            </div>

            {/* Affected District */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">District / Region</label>
              <select
                value={selectedDistrict}
                onChange={(e) => handleDistrictChange(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}, {d.state} ({d.terrain_type})
                  </option>
                ))}
              </select>
            </div>

            {/* GPS Coordinates */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-slate-700 font-bold">GPS Coordinates</label>
                <button
                  type="button"
                  onClick={handleAutoGPS}
                  className="text-indigo-600 hover:text-indigo-700 font-bold inline-flex items-center gap-1"
                >
                  <Navigation className="w-3 h-3" /> Auto-Detect GPS
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  step="any"
                  placeholder="Latitude"
                  value={lat}
                  onChange={(e) => setLat(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <input
                  type="number"
                  step="any"
                  placeholder="Longitude"
                  value={lng}
                  onChange={(e) => setLng(e.target.value)}
                  className="bg-slate-50 border border-slate-300 rounded-xl p-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Incident Description */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Situation Description</label>
              <textarea
                rows={3}
                required
                placeholder="Describe current road conditions, debris extent, affected vehicles, and emergency requirements..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Photo Attachment */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">Attach Field Photo (Optional)</label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                {photoPreview ? (
                  <div className="flex items-center justify-center gap-3">
                    <img src={photoPreview} alt="Field preview" className="w-14 h-14 object-cover rounded-lg border" />
                    <span className="text-slate-600 font-bold">Photo attached (Click to replace)</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2 text-slate-500">
                    <Camera className="w-4 h-4 text-indigo-500" />
                    <span>Click or drag image to upload geotagged photo</span>
                  </div>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
            >
              {submitting ? (
                <>
                  <LoadingSpinner />
                  <span>Submitting Ground Report...</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  <span>Submit Report</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Side: Interactive GIS Map & Recent Reports Feed */}
        <div className="lg:col-span-7 space-y-6">
          {/* Incident GIS Map */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 space-y-3">
            <div className="flex items-center justify-between px-2">
              <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                <Layers className="w-4 h-4 text-indigo-600" />
                Live Incident Map View ({reports.length} Reports)
              </h3>
              <span className="text-xs text-slate-400">Click markers for details</span>
            </div>

            <div className="h-[280px] rounded-xl overflow-hidden border border-slate-200 relative z-0">
              <MapContainer center={[26.2, 92.9]} zoom={6.5} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {reports.map((rep) => (
                  <Marker
                    key={rep.id}
                    position={[rep.lat || 26.2, rep.lng || 92.9]}
                    icon={incidentIcon(rep.severity)}
                  >
                    <Popup>
                      <div className="p-1 max-w-xs text-xs">
                        <span className="text-[10px] uppercase font-bold text-indigo-600 block">
                          {rep.incident_type?.replace('_', ' ')}
                        </span>
                        <strong className="text-slate-900 block font-bold mt-0.5">{rep.description}</strong>
                        <span className="text-slate-500 block mt-1">Severity: <span className="uppercase font-bold">{rep.severity}</span></span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>

          {/* Recent Reports List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-5 space-y-3">
            <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
              Recent Field Submissions
            </h3>

            {loadingReports ? (
              <div className="p-6 text-center">
                <LoadingSpinner />
              </div>
            ) : reports.length > 0 ? (
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {reports.map((r) => {
                  let timeStr = 'Recently';
                  try {
                    if (r.created_at) timeStr = formatDistanceToNow(new Date(r.created_at), { addSuffix: true });
                  } catch (e) {
                    timeStr = 'Recent';
                  }

                  return (
                    <div key={r.id} className="p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-start gap-3">
                      <div className={`p-2 rounded-lg shrink-0 ${
                        r.severity === 'critical' ? 'bg-rose-100 text-rose-600' : r.severity === 'high' ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <AlertTriangle className="w-4 h-4" />
                      </div>

                      <div className="flex-1 text-xs">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-bold text-slate-800 uppercase tracking-wide text-[11px]">
                            {r.incident_type?.replace('_', ' ')}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {timeStr}
                          </span>
                        </div>

                        <p className="text-slate-600 mt-1 leading-relaxed">{r.description}</p>

                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] bg-slate-200/60 text-slate-700 px-2 py-0.5 rounded font-medium">
                            {r.district_id ? r.district_id.replace(/^[A-Z]+_/, '') : 'NER Field'}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                            r.severity === 'critical' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {r.severity}
                          </span>
                          {r.photo_data && (
                            <span className="text-[10px] text-indigo-600 flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" /> Photo Attached
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-xs text-slate-500 text-center py-4">No field reports submitted yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FieldReporting;
