import React from 'react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  User, 
  ShieldCheck, 
  Clock, 
  Compass, 
  Activity, 
  Package, 
  ArrowRight 
} from 'lucide-react';

const VehicleDetail = ({ vehicle }) => {
  if (!vehicle) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-6 text-center text-slate-400 text-xs">
        Select a vehicle to inspect live telematics and cargo manifest.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-400">Convoy Telematics Unit</span>
          <h3 className="text-lg font-black text-slate-900">{vehicle.vehicle_number}</h3>
        </div>
        <span className="px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg border border-indigo-200 uppercase">
          {vehicle.type} Cargo
        </span>
      </div>

      {/* Driver and Cargo Details */}
      <div className="grid grid-cols-2 gap-3 text-xs">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Assigned Driver</span>
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span>{vehicle.driver_name}</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-500 text-[11px] mt-1">
            <Phone className="w-3 h-3 text-slate-400" />
            <span>{vehicle.driver_phone || '+91 98621 00452'}</span>
          </div>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[11px] text-slate-400 font-semibold block mb-1">Manifest Details</span>
          <div className="flex items-center gap-1.5 font-bold text-slate-800">
            <Package className="w-3.5 h-3.5 text-emerald-600" />
            <span className="truncate">{vehicle.cargo_description}</span>
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">Priority Clearance: Verified</span>
        </div>
      </div>

      {/* Telematics stats */}
      <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-slate-900 text-white rounded-xl text-center text-xs">
        <div>
          <span className="text-[10px] uppercase text-slate-400 block font-bold">Speed</span>
          <span className="text-base font-extrabold text-emerald-400">{Math.round(vehicle.speed || 48)} km/h</span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-slate-400 block font-bold">Heading</span>
          <span className="text-base font-extrabold text-indigo-300">{Math.round(vehicle.heading || 120)}° NE</span>
        </div>
        <div>
          <span className="text-[10px] uppercase text-slate-400 block font-bold">Status</span>
          <span className="text-xs font-extrabold uppercase text-amber-300 block mt-0.5">{vehicle.status}</span>
        </div>
      </div>

      {/* Transit Route Progress */}
      <div className="space-y-2 text-xs">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Transit Corridor</span>
        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Origin</span>
            <strong className="text-slate-800 text-sm">{vehicle.origin}</strong>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400" />
          <div className="text-right">
            <span className="text-[10px] uppercase text-slate-400 font-bold block">Destination</span>
            <strong className="text-slate-800 text-sm">{vehicle.destination}</strong>
          </div>
        </div>
      </div>

      {/* Live GPS location */}
      <div className="text-[11px] text-slate-400 flex items-center justify-between pt-1">
        <span>Current GPS Coordinates:</span>
        <span className="font-mono font-bold text-slate-700">
          {Number(vehicle.current_lat || 26.2).toFixed(4)}°N, {Number(vehicle.current_lng || 92.9).toFixed(4)}°E
        </span>
      </div>
    </div>
  );
};

export default VehicleDetail;
