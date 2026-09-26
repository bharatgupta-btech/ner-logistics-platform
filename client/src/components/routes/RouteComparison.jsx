import React from 'react';
import { Clock, MapPin, AlertTriangle, ShieldCheck, Zap, Navigation, CheckCircle2 } from 'lucide-react';
import StatusBadge from '../common/StatusBadge';

const RouteComparison = ({ routes, selectedRoute, onSelectRoute }) => {
  if (!routes || routes.length === 0) return null;

  const getRiskColor = (score) => {
    if (score < 30) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score < 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getIcon = (color) => {
    if (color === 'emerald') return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
    if (color === 'amber') return <Zap className="w-5 h-5 text-amber-600" />;
    return <Navigation className="w-5 h-5 text-indigo-600" />;
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
        <Navigation className="w-5 h-5 text-indigo-600" />
        AI Alternate Route Options ({routes.length})
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {routes.map((route, idx) => {
          const isSelected = selectedRoute?.id === route.id || (idx === 0 && !selectedRoute);

          return (
            <div
              key={route.id}
              onClick={() => onSelectRoute(route)}
              className={`cursor-pointer rounded-xl border p-5 transition-all relative bg-white ${
                isSelected
                  ? 'border-indigo-600 ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-200 hover:border-indigo-300 hover:shadow-sm'
              }`}
            >
              {isSelected && (
                <div className="absolute top-3 right-3 bg-indigo-600 text-white p-1 rounded-full">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              )}

              <div className="flex items-center gap-2.5 mb-2">
                {getIcon(route.color)}
                <div>
                  <h4 className="font-bold text-slate-900 text-base">{route.name}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{route.description}</p>
                </div>
              </div>

              <div className="my-4 grid grid-cols-3 gap-2 py-3 px-3 bg-slate-50 rounded-lg border border-slate-100 text-center">
                <div>
                  <span className="text-[11px] uppercase font-semibold text-slate-400 block">Distance</span>
                  <span className="text-sm font-bold text-slate-800">{route.total_distance} km</span>
                </div>
                <div>
                  <span className="text-[11px] uppercase font-semibold text-slate-400 block">ETA</span>
                  <span className="text-sm font-bold text-slate-800">{route.formatted_eta}</span>
                </div>
                <div>
                  <span className="text-[11px] uppercase font-semibold text-slate-400 block">Risk Score</span>
                  <span className={`text-xs font-extrabold px-1.5 py-0.5 rounded border inline-block mt-0.5 ${getRiskColor(route.risk_score)}`}>
                    {route.risk_score}/100
                  </span>
                </div>
              </div>

              {/* Waypoints preview */}
              <div className="space-y-1 text-xs text-slate-600 mb-4">
                <span className="font-medium text-slate-400 text-[11px] uppercase block mb-1">Key Waypoints</span>
                <div className="flex flex-wrap gap-1">
                  {route.waypoints?.slice(0, 4).map((wp, i) => (
                    <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px]">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {wp.name}
                    </span>
                  ))}
                  {route.waypoints?.length > 4 && (
                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-500 text-[11px]">
                      +{route.waypoints.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              {/* Road conditions warning */}
              {route.blocked_count > 0 && (
                <div className="flex items-center gap-1.5 text-xs text-rose-600 bg-rose-50 px-2.5 py-1.5 rounded-md border border-rose-100">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{route.blocked_count} blocked segment(s) on route</span>
                </div>
              )}

              <button
                type="button"
                className={`w-full mt-3 py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
                  isSelected
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {isSelected ? 'Selected Route' : 'Select This Route'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RouteComparison;
