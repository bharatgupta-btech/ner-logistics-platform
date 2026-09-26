import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Truck, 
  BellRing, 
  Route, 
  CheckCircle2, 
  TrendingUp, 
  TrendingDown, 
  ArrowRight,
  ShieldAlert,
  Radio
} from 'lucide-react';
import { getVehicles, getAlerts } from '../../utils/api';
import { useLanguage } from '../../context/LanguageContext';

const StatsCards = ({ stats }) => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const [liveStats, setLiveStats] = useState({
    activeVehicles: 124,
    activeVehiclesTrend: 5,
    openAlerts: 18,
    openAlertsTrend: -2,
    blockedRoutes: 7,
    blockedRoutesTrend: 1,
    successRate: 94,
    successRateTrend: 0.5
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [vehRes, alertRes] = await Promise.allSettled([
          getVehicles(),
          getAlerts()
        ]);

        if (vehRes.status === 'fulfilled' && vehRes.value.data?.data) {
          const vehList = vehRes.value.data.data;
          const activeCount = vehList.length;
          setLiveStats(prev => ({ ...prev, activeVehicles: activeCount || 124 }));
        }

        if (alertRes.status === 'fulfilled' && alertRes.value.data?.data) {
          const alertList = alertRes.value.data.data;
          const openCount = alertList.filter(a => a.status === 'active' || !a.status).length;
          const blockedCount = alertList.filter(a => a.severity === 'critical' || a.type === 'landslide').length;
          setLiveStats(prev => ({
            ...prev,
            openAlerts: openCount || 18,
            blockedRoutes: blockedCount || 7
          }));
        }
      } catch (err) {
        console.error('Error fetching dynamic stats:', err);
      }
    };

    fetchCounts();
  }, []);

  const Card = ({ title, value, icon: Icon, trend, color, path, actionText, bgIconColor }) => (
    <div 
      onClick={() => navigate(path)}
      className={`bg-white rounded-2xl p-5 shadow-xs border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 cursor-pointer group transform hover:-translate-y-0.5 border-t-4 ${color}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
          <h3 className="text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">{value}</h3>
        </div>
        <div className={`p-3 rounded-2xl ${bgIconColor} transition-transform group-hover:scale-110 duration-200`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-xs pt-2 border-t border-slate-100">
        <div className={`flex items-center font-bold ${trend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
          {trend >= 0 ? <TrendingUp size={14} className="mr-1" /> : <TrendingDown size={14} className="mr-1" />}
          <span>{Math.abs(trend)}% {t('fromYesterday')}</span>
        </div>
        
        <span className="text-indigo-600 group-hover:text-indigo-800 font-bold flex items-center gap-1 group-hover:underline">
          {actionText}
          <ArrowRight size={13} className="transform group-hover:translate-x-0.5 transition-transform" />
        </span>
      </div>
    </div>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
      <Card 
        title={t('activeVehicles')} 
        value={liveStats.activeVehicles} 
        icon={Truck} 
        trend={liveStats.activeVehiclesTrend} 
        color="border-blue-500" 
        bgIconColor="bg-blue-50 text-blue-600"
        path="/vehicles"
        actionText={t('trackFleet')}
      />
      <Card 
        title={t('openAlerts')} 
        value={liveStats.openAlerts} 
        icon={BellRing} 
        trend={liveStats.openAlertsTrend} 
        color="border-amber-500" 
        bgIconColor="bg-amber-50 text-amber-600"
        path="/alerts"
        actionText={t('inspectAlerts')}
      />
      <Card 
        title={t('blockedRoutes')} 
        value={liveStats.blockedRoutes} 
        icon={Route} 
        trend={liveStats.blockedRoutesTrend} 
        color="border-red-500" 
        bgIconColor="bg-red-50 text-red-600"
        path="/map"
        actionText={t('viewGisMap')}
      />
      <Card 
        title={t('deliverySuccess')} 
        value={`${liveStats.successRate}%`} 
        icon={CheckCircle2} 
        trend={liveStats.successRateTrend} 
        color="border-emerald-500" 
        bgIconColor="bg-emerald-50 text-emerald-600"
        path="/analytics"
        actionText={t('supplyChain')}
      />
    </div>
  );
};

export default StatsCards;
