import React from 'react';
import { 
  AlertTriangle, 
  CloudRain, 
  Truck, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  ShieldAlert, 
  Radio, 
  Flame, 
  ArrowUpRight 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const AlertCard = ({ alert, onAcknowledge }) => {
  if (!alert) return null;

  const getSeverityStyle = (severity) => {
    switch (severity) {
      case 'emergency':
        return {
          badge: 'bg-red-600 text-white border-red-700 animate-pulse',
          border: 'border-l-4 border-l-red-600 bg-red-50/40',
          icon: <Flame className="w-5 h-5 text-red-600" />
        };
      case 'critical':
        return {
          badge: 'bg-rose-100 text-rose-800 border-rose-200',
          border: 'border-l-4 border-l-rose-500 bg-rose-50/20',
          icon: <ShieldAlert className="w-5 h-5 text-rose-600" />
        };
      case 'warning':
        return {
          badge: 'bg-amber-100 text-amber-800 border-amber-200',
          border: 'border-l-4 border-l-amber-500 bg-amber-50/20',
          icon: <AlertTriangle className="w-5 h-5 text-amber-600" />
        };
      default:
        return {
          badge: 'bg-blue-100 text-blue-800 border-blue-200',
          border: 'border-l-4 border-l-blue-500 bg-blue-50/20',
          icon: <Radio className="w-5 h-5 text-blue-600" />
        };
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'landslide':
        return <AlertTriangle className="w-4 h-4 text-amber-600" />;
      case 'weather':
      case 'flood':
        return <CloudRain className="w-4 h-4 text-blue-600" />;
      case 'delay':
        return <Truck className="w-4 h-4 text-orange-600" />;
      case 'bridge_damage':
        return <ShieldAlert className="w-4 h-4 text-rose-600" />;
      default:
        return <Radio className="w-4 h-4 text-indigo-600" />;
    }
  };

  const style = getSeverityStyle(alert.severity);

  let formattedTime = 'Just now';
  try {
    if (alert.created_at) {
      formattedTime = formatDistanceToNow(new Date(alert.created_at), { addSuffix: true });
    }
  } catch (e) {
    formattedTime = 'Recent';
  }

  return (
    <div className={`rounded-xl border border-slate-200 p-5 shadow-sm transition-all hover:shadow-md bg-white ${style.border}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-white shadow-xs border border-slate-100 mt-0.5">
            {style.icon}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className={`text-[11px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full border ${style.badge}`}>
                {alert.severity}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                {getTypeIcon(alert.type)}
                <span className="capitalize">{alert.type?.replace('_', ' ')}</span>
              </span>
              {alert.is_acknowledged ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  <CheckCircle2 className="w-3 h-3" /> Acknowledged
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                  Active
                </span>
              )}
            </div>

            <h3 className="font-bold text-slate-900 text-base mt-1">{alert.title}</h3>
            <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">{alert.message}</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-4 flex-wrap">
          {alert.district_id && (
            <div className="flex items-center gap-1 text-slate-700 font-medium">
              <MapPin className="w-3.5 h-3.5 text-indigo-500" />
              <span>{alert.district_id.replace(/^[A-Z]+_/, '')}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formattedTime}</span>
          </div>

          {alert.lat && alert.lng && (
            <span className="text-[11px] font-mono text-slate-400">
              {Number(alert.lat).toFixed(3)}°N, {Number(alert.lng).toFixed(3)}°E
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {!alert.is_acknowledged && onAcknowledge && (
            <button
              onClick={() => onAcknowledge(alert.id)}
              className="inline-flex items-center gap-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors shadow-xs"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Acknowledge Alert
            </button>
          )}

          <a
            href={`/map?lat=${alert.lat || 26.2}&lng=${alert.lng || 92.9}`}
            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-semibold px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors"
          >
            View on GIS Map
            <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default AlertCard;
