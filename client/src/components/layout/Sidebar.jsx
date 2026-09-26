import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Map, Truck, Route, Bell, FileText, BarChart3, ChevronLeft, ChevronRight, Globe } from 'lucide-react';
import { LANGUAGES } from '../../utils/constants';
import { useLanguage } from '../../context/LanguageContext';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { currentLanguage, changeLanguage, t } = useLanguage();

  const navItems = [
    { to: '/', icon: <LayoutDashboard size={20} />, label: t('dashboard') },
    { to: '/map', icon: <Map size={20} />, label: t('liveMap') },
    { to: '/vehicles', icon: <Truck size={20} />, label: t('vehicles') },
    { to: '/routes', icon: <Route size={20} />, label: t('routes') },
    { to: '/alerts', icon: <Bell size={20} />, label: t('alerts'), badge: 3 },
    { to: '/reports', icon: <FileText size={20} />, label: t('fieldReports') },
    { to: '/analytics', icon: <BarChart3 size={20} />, label: t('analytics') },
  ];

  return (
    <aside className={`bg-slate-900 text-white flex flex-col transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'} shrink-0 z-30`}>
      <div className="flex items-center justify-between p-4 border-b border-slate-800">
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-extrabold text-lg text-indigo-400 tracking-tight">🚛 {t('platformTitle')}</span>
            <span className="text-[11px] text-slate-400 font-medium">{t('platformSubtitle')}</span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="p-1 hover:bg-slate-800 rounded-xl transition-colors">
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2.5 rounded-xl transition-colors font-semibold text-xs sm:text-sm ${
                    isActive ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <span className="flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <span className="ml-3 flex-1">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800">
        {!collapsed ? (
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-300 bg-slate-800/80 p-2 rounded-xl border border-slate-700">
            <Globe size={16} className="text-indigo-400 shrink-0" />
            <select 
              value={currentLanguage}
              onChange={(e) => changeLanguage(e.target.value)}
              className="bg-transparent border-none outline-none cursor-pointer w-full text-slate-200 font-bold text-xs"
            >
              {LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code} className="bg-slate-900 text-white font-semibold">
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <Globe size={20} className="mx-auto text-indigo-400 cursor-pointer" title="Select Language" />
        )}
        <div className="mt-4 flex items-center space-x-2 px-1">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          {!collapsed && <span className="text-[11px] font-semibold text-slate-400">{t('systemOnline')}</span>}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
