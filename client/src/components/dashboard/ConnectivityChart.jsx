import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Navigation, 
  MapPin, 
  ExternalLink, 
  Sparkles, 
  ArrowRight,
  TrendingUp,
  X
} from 'lucide-react';

import { useLanguage } from '../../context/LanguageContext';

const STATE_DETAILS = {
  'Assam': { score: 92, status: 'High Connectivity', mainHighway: 'NH 27 (East-West Corridor)', terrain: 'Plains & River Valley', floodProne: 'High', landslideProne: 'Low', activeFleet: 48 },
  'Arunachal': { score: 65, status: 'Moderate (Mountainous)', mainHighway: 'NH 13 (Trans-Arunachal)', terrain: 'High Himalayas & Steep Valleys', floodProne: 'Moderate', landslideProne: 'Very High', activeFleet: 14 },
  'Meghalaya': { score: 78, status: 'Good (Hill Highway)', mainHighway: 'NH 6 (Guwahati-Shillong-Silchar)', terrain: 'Hilly Plateau (Cloud Belt)', floodProne: 'Low', landslideProne: 'High', activeFleet: 22 },
  'Manipur': { score: 54, status: 'Restricted Transit', mainHighway: 'NH 2 & NH 102 (Imphal-Moreh)', terrain: 'Central Valley & Surrounding Hills', floodProne: 'Moderate', landslideProne: 'High', activeFleet: 12 },
  'Mizoram': { score: 60, status: 'Moderate Transit', mainHighway: 'NH 2 & NH 306 (Silchar-Aizawl)', terrain: 'Steep Hill Ridges', floodProne: 'Low', landslideProne: 'Very High', activeFleet: 9 },
  'Nagaland': { score: 72, status: 'Good Transit Corridor', mainHighway: 'NH 29 (Dimapur-Kohima)', terrain: 'Mountainous Hills', floodProne: 'Moderate', landslideProne: 'High', activeFleet: 16 },
  'Sikkim': { score: 85, status: 'Stable Himalayan Route', mainHighway: 'NH 10 (Siliguri-Gangtok)', terrain: 'High Mountainous & Teesta Valley', floodProne: 'Low', landslideProne: 'High', activeFleet: 18 },
  'Tripura': { score: 88, status: 'High Transit Linkage', mainHighway: 'NH 8 (Karimganj-Agartala)', terrain: 'Low Plains & Rolling Hills', floodProne: 'High', landslideProne: 'Low', activeFleet: 20 },
};

const ConnectivityChart = ({ data }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [selectedState, setSelectedState] = useState('Assam');

  const chartData = data || [
    { state: 'Assam', score: 92 },
    { state: 'Arunachal', score: 65 },
    { state: 'Meghalaya', score: 78 },
    { state: 'Manipur', score: 54 },
    { state: 'Mizoram', score: 60 },
    { state: 'Nagaland', score: 72 },
    { state: 'Sikkim', score: 85 },
    { state: 'Tripura', score: 88 },
  ];

  const getColor = (score) => {
    if (score >= 80) return '#10B981'; // Green
    if (score >= 60) return '#F59E0B'; // Amber
    return '#EF4444'; // Red
  };

  const activeStateInfo = STATE_DETAILS[selectedState] || STATE_DETAILS['Assam'];

  return (
    <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <span>{t('regionalConnectivity')}</span>
            <span className="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
              {t('liveAiScore')}
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{t('clickStateDrilldown')}</p>
        </div>

        <button
          onClick={() => navigate('/analytics')}
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <span>{t('deepAnalytics')}</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* State Selection Interactive Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
        {chartData.map((item) => (
          <button
            key={item.state}
            onClick={() => setSelectedState(item.state)}
            className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
              selectedState === item.state
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <span 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: getColor(item.score) }}
            />
            <span>{item.state} ({item.score}%)</span>
          </button>
        ))}
      </div>

      {/* Main Bar Chart */}
      <div className="h-60 cursor-pointer">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart 
            data={chartData} 
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            onClick={(e) => {
              if (e?.activePayload?.[0]?.payload?.state) {
                setSelectedState(e.activePayload[0].payload.state);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="state" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fill: '#64748b', fontWeight: 600 }} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              domain={[0, 100]}
              tick={{ fontSize: 11, fill: '#64748b' }} 
            />
            <Tooltip 
              cursor={{ fill: '#f8fafc' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-lg text-xs space-y-1 border border-slate-700">
                      <p className="font-bold">{data.state}</p>
                      <p className="text-slate-300">Connectivity Index: <span className="font-bold text-emerald-400">{data.score}/100</span></p>
                      <p className="text-[10px] text-slate-400">Click to view details</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="score" radius={[6, 6, 0, 0]}>
              {chartData.map((entry) => (
                <Cell 
                  key={`cell-${entry.state}`} 
                  fill={getColor(entry.score)} 
                  opacity={selectedState === entry.state ? 1 : 0.75}
                  stroke={selectedState === entry.state ? '#0f172a' : 'none'}
                  strokeWidth={selectedState === entry.state ? 2 : 0}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* State Interactive Detail Card */}
      <div className="bg-gradient-to-r from-slate-50 to-indigo-50/40 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-fadeIn">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm text-slate-900">{selectedState} State Transit Profile</span>
            <span 
              className="text-[11px] font-bold px-2 py-0.5 rounded-md text-white"
              style={{ backgroundColor: getColor(activeStateInfo.score) }}
            >
              Score: {activeStateInfo.score}%
            </span>
          </div>
          <p className="text-xs text-slate-600">
            Primary Corridor: <span className="font-bold text-slate-900">{activeStateInfo.mainHighway}</span> • Terrain: <span className="font-semibold">{activeStateInfo.terrain}</span>
          </p>
          <div className="flex items-center gap-3 text-[11px] text-slate-500 pt-1">
            <span>Landslide Prone: <strong className="text-slate-700">{activeStateInfo.landslideProne}</strong></span>
            <span>•</span>
            <span>Active Convoy Fleet: <strong className="text-indigo-700">{activeStateInfo.activeFleet} Trucks</strong></span>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={() => navigate('/routes')}
            className="flex-1 sm:flex-none bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Navigation size={13} />
            <span>Optimize {selectedState} Route</span>
          </button>
          
          <button
            onClick={() => navigate('/map')}
            className="bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold px-3 py-2 rounded-xl transition-colors cursor-pointer"
          >
            View Map
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectivityChart;
