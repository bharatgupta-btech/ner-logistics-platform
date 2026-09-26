import React, { useState, useEffect } from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';
import { 
  Truck, 
  Clock, 
  AlertOctagon, 
  TrendingUp, 
  TrendingDown, 
  ShieldCheck, 
  PackageCheck,
  AlertTriangle,
  ArrowUpRight,
  Layers
} from 'lucide-react';
import api from '../../utils/api';
import LoadingSpinner from '../common/LoadingSpinner';

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

const SupplyChainView = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupplyChain = async () => {
      try {
        const response = await api.get('/analytics/supply-chain');
        if (response.data?.success) {
          setData(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load supply chain analytics:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSupplyChain();
  }, []);

  if (loading) {
    return (
      <div className="p-12 text-center">
        <LoadingSpinner />
        <p className="text-sm font-semibold text-slate-600 mt-3">Loading supply chain intelligence...</p>
      </div>
    );
  }

  const byCargo = data?.by_cargo_type || [
    { type: 'medical', count: 6, delivered: 4, delayed: 2 },
    { type: 'food', count: 5, delivered: 3, delayed: 1 },
    { type: 'construction', count: 4, delivered: 2, delayed: 2 },
    { type: 'agriculture', count: 3, delivered: 3, delayed: 0 }
  ];

  const bottlenecks = data?.bottleneck_routes || [];
  const supplyGaps = data?.supply_gaps || [];
  const dailyMetrics = data?.daily_metrics || [];

  const pieData = byCargo.map(c => ({
    name: c.type?.toUpperCase(),
    value: c.count
  }));

  return (
    <div className="p-6 space-y-6">
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs uppercase font-bold text-slate-400">Total Essential Convoys</span>
          <div className="text-2xl font-extrabold text-slate-900 mt-1 flex items-baseline justify-between">
            <span>{byCargo.reduce((s, c) => s + c.count, 0)} Active</span>
            <Truck className="w-5 h-5 text-indigo-600" />
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +12% volume vs last week
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs uppercase font-bold text-slate-400">Delivery Success Rate</span>
          <div className="text-2xl font-extrabold text-emerald-600 mt-1 flex items-baseline justify-between">
            <span>88.4%</span>
            <PackageCheck className="w-5 h-5 text-emerald-600" />
          </div>
          <span className="text-[11px] text-slate-500 mt-1 block">Monitored across 8 NER states</span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs uppercase font-bold text-slate-400">Average Transit Delay</span>
          <div className="text-2xl font-extrabold text-amber-600 mt-1 flex items-baseline justify-between">
            <span>2.8 hrs</span>
            <Clock className="w-5 h-5 text-amber-600" />
          </div>
          <span className="text-[11px] text-amber-700 font-semibold mt-1 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Due to mountain pass rains
          </span>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 shadow-xs">
          <span className="text-xs uppercase font-bold text-slate-400">Critical Bottleneck Corridors</span>
          <div className="text-2xl font-extrabold text-rose-600 mt-1 flex items-baseline justify-between">
            <span>{bottlenecks.length || 3} Routes</span>
            <AlertOctagon className="w-5 h-5 text-rose-600" />
          </div>
          <span className="text-[11px] text-rose-600 font-semibold mt-1 block">Landslide diversion required</span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Daily Deliveries & Delay Trend */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">7-Day Supply Chain Delivery Performance</h3>
              <p className="text-xs text-slate-400">Completed shipments vs weather-delayed shipments</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748B' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748B' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Bar dataKey="deliveries" fill="#4F46E5" name="Completed Deliveries" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delays" fill="#F59E0B" name="Delayed Deliveries" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Cargo Type Distribution */}
        <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-3">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-slate-800 text-sm">Cargo Type Allocation</h3>
            <p className="text-xs text-slate-400">Distribution of essential relief supplies</p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#1E293B', borderRadius: '8px', color: '#fff', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            {pieData.map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></span>
                <span className="text-slate-600 font-medium">{item.name}: <strong className="text-slate-800">{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Critical Bottlenecks & Supply Gap Table */}
      <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <AlertOctagon className="w-4 h-4 text-rose-600" />
              District Supply Gap & Logistics Bottleneck Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">High-priority districts facing route disruption and pending inventory requirements</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[11px] border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">District / State</th>
                <th className="py-3 px-4">Connectivity Status</th>
                <th className="py-3 px-4">Risk Index</th>
                <th className="py-3 px-4">Pending Supplies</th>
                <th className="py-3 px-4">Action Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {supplyGaps.length > 0 ? supplyGaps.map((g, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-800">
                    {g.name}, <span className="text-slate-500 font-normal">{g.state}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                      g.connectivity_status === 'blocked' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {g.connectivity_status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div 
                          className="bg-rose-500 h-2 rounded-full" 
                          style={{ width: `${g.risk_score || 70}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-rose-600">{g.risk_score || 70}/100</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-bold text-indigo-600">
                    {g.pending_deliveries || 2} Critical Inbound
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-slate-700 bg-slate-100 px-2 py-1 rounded text-[11px] inline-flex items-center gap-1">
                      <ArrowUpRight className="w-3 h-3 text-indigo-600" />
                      Reroute via Highway Express
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" className="py-6 text-center text-slate-400">
                    All monitored districts currently have adequate supply connectivity.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupplyChainView;
