import React from 'react';
import { Truck, MapPin, Clock, ArrowRight, ShieldCheck } from 'lucide-react';

const VehicleList = ({ vehicles, selectedVehicle, onSelectVehicle }) => {
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="p-8 text-center text-slate-400 text-xs">
        No vehicles matching current filter.
      </div>
    );
  }

  const getTypeBadge = (type) => {
    switch (type) {
      case 'medical':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'food':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'construction':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      default:
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delayed':
        return 'bg-amber-500 text-white';
      case 'delivered':
        return 'bg-emerald-500 text-white';
      case 'stopped':
        return 'bg-slate-500 text-white';
      default:
        return 'bg-blue-600 text-white animate-pulse';
    }
  };

  return (
    <div className="divide-y divide-slate-100">
      {vehicles.map((v) => {
        const isSelected = selectedVehicle?.id === v.id;

        return (
          <div
            key={v.id}
            onClick={() => onSelectVehicle(v)}
            className={`p-4 cursor-pointer transition-all hover:bg-slate-50 border-l-4 ${
              isSelected
                ? 'bg-indigo-50/60 border-l-indigo-600 shadow-xs'
                : v.status === 'delayed'
                ? 'border-l-amber-500'
                : 'border-l-transparent'
            }`}
          >
            <div className="flex items-center justify-between gap-2 mb-1.5">
              <span className="font-extrabold text-slate-900 text-sm tracking-wide">
                {v.vehicle_number}
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${getStatusBadge(v.status)}`}>
                {v.status?.replace('_', ' ')}
              </span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-2">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${getTypeBadge(v.type)}`}>
                {v.type}
              </span>
              <span className="text-slate-400 text-[11px] truncate">• {v.cargo_description}</span>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100">
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-emerald-600" />
                <span className="font-medium text-slate-700 text-[11px]">{v.origin}</span>
              </div>
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-rose-600" />
                <span className="font-medium text-slate-700 text-[11px]">{v.destination}</span>
              </div>
            </div>

            <div className="mt-2.5 flex items-center justify-between text-[11px] text-slate-400">
              <span>Driver: <strong className="text-slate-700">{v.driver_name}</strong></span>
              <span>Speed: <strong className="text-slate-700">{Math.round(v.speed || 45)} km/h</strong></span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default VehicleList;
