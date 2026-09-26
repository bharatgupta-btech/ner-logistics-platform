import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertTriangle, 
  CloudRain, 
  Mountain, 
  Construction, 
  ArrowRight,
  ShieldAlert,
  Radio,
  Clock,
  MapPin,
  CheckCircle2,
  Navigation,
  X
} from 'lucide-react';
import { timeAgo } from '../../utils/helpers';
import { ALERT_SEVERITIES } from '../../utils/constants';
import { getAlerts } from '../../utils/api';
import { useSocket } from '../../context/SocketContext';
import { useLanguage } from '../../context/LanguageContext';

const DEFAULT_ALERTS = [
  { 
    id: 'alt-1', 
    type: 'landslide', 
    title: 'Major Landslide on NH-2 Corridor', 
    location: 'Kohima, Nagaland', 
    highway: 'NH 2 (Dimapur-Kohima Pass)',
    severity: 'critical', 
    description: 'Debris blockage covering 2 lanes near Kohima bypass. Heavy earthmoving machinery dispatched by BRO. Alternate route via Chumukedima active.',
    timestamp: new Date(Date.now() - 1000 * 60 * 15) 
  },
  { 
    id: 'alt-2', 
    type: 'weather', 
    title: 'Heavy Incessant Rainfall & Flash Flood Warning', 
    location: 'Cherrapunji & Mawsynram, Meghalaya', 
    highway: 'NH 6 / SH-12',
    severity: 'high', 
    description: 'Intense precipitation exceeding 120mm/hr. High risk of localized mudslides and low visibility across East Khasi Hills.',
    timestamp: new Date(Date.now() - 1000 * 60 * 45) 
  },
  { 
    id: 'alt-3', 
    type: 'road', 
    title: 'Bridge Structural Maintenance & Weight Restrictions', 
    location: 'Dibrugarh, Assam', 
    highway: 'NH 15 (Brahmaputra Approach)',
    severity: 'medium', 
    description: 'Bridge joint repairs in progress. Heavy multi-axle freight restricted to single convoy lane until 18:00 IST.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2) 
  },
  { 
    id: 'alt-4', 
    type: 'traffic', 
    title: 'Logistics Convoy Speed Restriction & Escort', 
    location: 'Imphal West, Manipur', 
    highway: 'NH 102 (Imphal-Moreh Highway)',
    severity: 'low', 
    description: 'Security escort convoy active along Moreh border transit. Commercial vehicles proceed in designated lanes.',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4) 
  }
];

const AlertsFeed = ({ alerts }) => {
  const navigate = useNavigate();
  const socket = useSocket();
  const { t } = useLanguage();
  const [alertList, setAlertList] = useState(alerts || DEFAULT_ALERTS);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [acknowledgedIds, setAcknowledgedIds] = useState(new Set());

  // Fetch alerts from API on mount
  useEffect(() => {
    const fetchLiveAlerts = async () => {
      try {
        const res = await getAlerts({ limit: 6 });
        if (res.data?.data && res.data.data.length > 0) {
          setAlertList(res.data.data);
        }
      } catch (err) {
        console.error('Failed to load live alerts in dashboard feed:', err);
      }
    };
    fetchLiveAlerts();
  }, []);

  // Socket.IO real-time alert updates
  useEffect(() => {
    if (!socket) return;
    const handleNewAlert = (newAlert) => {
      setAlertList(prev => [newAlert, ...prev.slice(0, 9)]);
    };
    socket.on('new_alert', handleNewAlert);
    return () => socket.off('new_alert', handleNewAlert);
  }, [socket]);

  const getIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'landslide': return <Mountain size={16} />;
      case 'weather': return <CloudRain size={16} />;
      case 'road': return <Construction size={16} />;
      default: return <AlertTriangle size={16} />;
    }
  };

  const handleAcknowledge = (id) => {
    setAcknowledgedIds(prev => new Set([...prev, id]));
  };

  return (
    <>
      <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200 h-full flex flex-col">
        
        {/* Top Header */}
        <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></div>
            <h3 className="text-base font-bold text-slate-900">{t('liveThreatFeed')}</h3>
          </div>
          <button 
            onClick={() => navigate('/alerts')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 cursor-pointer"
          >
            <span>{t('viewAll')} ({alertList.length})</span>
            <ArrowRight size={13} />
          </button>
        </div>
        
        {/* Alerts Scrollable Stream */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2.5 divide-y-0">
          {alertList.map((alert) => {
            const sevKey = (alert.severity || 'low').toUpperCase();
            const config = ALERT_SEVERITIES[sevKey] || ALERT_SEVERITIES.LOW;
            const isAck = acknowledgedIds.has(alert.id);

            return (
              <div 
                key={alert.id}
                onClick={() => setSelectedAlert(alert)}
                className={`p-3.5 rounded-2xl border transition-all duration-150 cursor-pointer flex items-start space-x-3 group transform hover:-translate-y-0.5 ${
                  isAck 
                    ? 'bg-slate-50 border-slate-200 opacity-60' 
                    : 'bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs'
                }`}
                style={{ borderLeftColor: config.color, borderLeftWidth: '4px' }}
              >
                <div 
                  className={`p-2 rounded-xl shrink-0 ${config.bg}`} 
                  style={{ color: config.color }}
                >
                  {getIcon(alert.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                      {alert.title}
                    </h4>
                    <span 
                      className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded shrink-0"
                      style={{ backgroundColor: config.bg, color: config.color }}
                    >
                      {alert.severity || 'ALERT'}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                    <MapPin size={11} className="text-slate-400" />
                    <span>{alert.location || alert.district || 'NER Highway'}</span>
                  </p>

                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-50 text-[10px] text-slate-400">
                    <span>{timeAgo(alert.timestamp || alert.created_at || new Date())}</span>
                    <span className="text-indigo-600 font-bold group-hover:underline">Inspect Details →</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Quick Action */}
        <div className="pt-3 border-t border-slate-100 mt-2">
          <button
            onClick={() => navigate('/reports')}
            className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          >
            <span>Submit Officer Ground Report</span>
            <ArrowRight size={13} />
          </button>
        </div>

      </div>

      {/* Alert Detail Modal */}
      {selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full max-h-[90vh] flex flex-col overflow-hidden my-auto animate-scaleUp">
            
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-red-600/30 border border-red-500/40 rounded-xl text-red-400">
                  {getIcon(selectedAlert.type)}
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-red-400">
                    {selectedAlert.severity || 'Incident'} Severity
                  </span>
                  <h3 className="text-base font-bold leading-tight mt-0.5">{selectedAlert.title}</h3>
                </div>
              </div>
              <button 
                onClick={() => setSelectedAlert(null)}
                className="p-1.5 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-semibold flex items-center gap-1">
                    <MapPin size={13} className="text-indigo-600" />
                    Jurisdiction:
                  </span>
                  <span className="font-bold text-slate-900">{selectedAlert.location || selectedAlert.district}</span>
                </div>
                {selectedAlert.highway && (
                  <div className="flex justify-between items-center text-slate-600">
                    <span className="font-semibold">Highway Corridor:</span>
                    <span className="font-bold text-slate-900">{selectedAlert.highway}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-slate-600">
                  <span className="font-semibold flex items-center gap-1">
                    <Clock size={13} className="text-slate-400" />
                    Logged Time:
                  </span>
                  <span className="text-slate-700">{timeAgo(selectedAlert.timestamp || selectedAlert.created_at || new Date())}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-800 mb-1">Incident Assessment & Ground Report:</h4>
                <p className="text-slate-600 leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-200 text-xs">
                  {selectedAlert.description || selectedAlert.details || 'Disruption verified by ground sensors and SDRF telemetry. High caution recommended for freight convoys.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    handleAcknowledge(selectedAlert.id);
                    setSelectedAlert(null);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <CheckCircle2 size={15} />
                  <span>Acknowledge</span>
                </button>

                <button
                  onClick={() => {
                    setSelectedAlert(null);
                    navigate('/routes');
                  }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-colors cursor-pointer"
                >
                  <Navigation size={15} />
                  <span>Find Alternate Route</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
};

export default AlertsFeed;
