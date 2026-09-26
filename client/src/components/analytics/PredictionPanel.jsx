import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  Sparkles, 
  ShieldAlert, 
  AlertTriangle, 
  CloudRain, 
  TrendingUp, 
  Activity, 
  Compass,
  CheckCircle2,
  Info
} from 'lucide-react';
import api from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';

const PredictionPanel = () => {
  const [predictionData, setPredictionData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const response = await api.get('/analytics/predictions');
        if (response.data?.success) {
          setPredictionData(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load predictions:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPredictions();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center">
        <LoadingSpinner />
        <p className="text-sm font-semibold text-slate-600 mt-3">Running AI predictive disruption models...</p>
      </div>
    );
  }

  const predictions = predictionData?.predictions || [];
  const insights = predictionData?.insights || [];
  const districtRisks = predictionData?.district_risks || [];
  const timeline = predictionData?.timeline || [];

  const formattedTimeline = timeline.map(t => {
    const d = new Date(t.time);
    return {
      time: `${d.getHours()}:00 (+${Math.round((d - Date.now()) / 3600000)}h)`,
      avg_risk: t.avg_risk,
      high_risk_districts: t.high_risk_districts
    };
  });

  return (
    <div className="p-6 space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white rounded-2xl p-6 shadow-md relative overflow-hidden">
        <div className="relative z-10 space-y-2">
          <span className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-bold border border-indigo-400/30">
            <Sparkles className="w-3.5 h-3.5 text-indigo-300" /> AI Predictive Early Warning Engine
          </span>
          <h2 className="text-xl font-bold">72-Hour Disruption & Weather Vulnerability Forecast</h2>
          <p className="text-xs text-slate-300 max-w-2xl leading-relaxed">
            Machine learning model continuously evaluates rainfall intensity, terrain steepness, river basin saturation, and historical landslide data to predict corridor blockages before they occur.
          </p>
        </div>
      </div>

      {/* AI Strategic Insights */}
      <div className="bg-indigo-50/60 border border-indigo-100 rounded-2xl p-5 space-y-3">
        <h3 className="font-bold text-indigo-950 text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-indigo-600" />
          AI Autonomous Operational Insights & Recommended Actions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          {insights.map((insight, idx) => (
            <div key={idx} className="bg-white border border-indigo-100/80 rounded-xl p-3 shadow-2xs flex items-start gap-2.5">
              <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0"></div>
              <p className="text-slate-700 leading-relaxed font-medium">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 72-Hour Risk Timeline Chart */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-800 text-sm">72-Hour Regional Disruption Risk Curve</h3>
            <p className="text-xs text-slate-400">Predicted average risk probability across North Eastern transport corridors</p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={formattedTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#EF4444" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
              <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#64748B' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748B' }} />
              <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Area type="monotone" dataKey="avg_risk" stroke="#EF4444" strokeWidth={2.5} fillOpacity={1} fill="url(#riskGrad)" name="Average Vulnerability Risk Index" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Predicted Disruptions & High-Risk Ranking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Predicted Incident Table */}
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              Predicted Hazard Incidents (Next 24–48 Hours)
            </h3>
            <p className="text-xs text-slate-400">High-confidence forecast of potential road disruption events</p>
          </div>

          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {predictions.length > 0 ? predictions.map((p, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/30 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-rose-100 text-rose-700 shrink-0">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-sm">{p.affected_area}</span>
                    <span className="font-extrabold text-rose-700 bg-rose-100 px-2 py-0.5 rounded text-[11px]">
                      {Math.round(p.probability * 100)}% Probability
                    </span>
                  </div>
                  <p className="text-slate-600 mt-1 capitalize font-medium">
                    Predicted Event: <strong>{p.type?.replace('_', ' ')}</strong>
                  </p>
                  <span className="text-[11px] text-slate-400 block mt-1">
                    Estimated Time Window: {new Date(p.predicted_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            )) : (
              <p className="text-xs text-slate-400 text-center py-6">No extreme probability disruptions predicted in current window.</p>
            )}
          </div>
        </div>

        {/* District Risk Ranking */}
        <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-600" />
              District Vulnerability Index (Top 6)
            </h3>
            <p className="text-xs text-slate-400">Current composite risk scoring per district</p>
          </div>

          <div className="space-y-3">
            {districtRisks.slice(0, 6).map((d, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-800">{d.name}, {d.state}</span>
                  <span className={d.risk_score > 60 ? 'text-rose-600 font-bold' : 'text-amber-600 font-bold'}>
                    {d.risk_score}/100
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-2 rounded-full ${d.risk_score > 60 ? 'bg-rose-500' : 'bg-amber-500'}`}
                    style={{ width: `${d.risk_score}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PredictionPanel;
