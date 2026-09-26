import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { LanguageProvider } from './context/LanguageContext';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import MapView from './components/map/MapView';
import VehicleTracker from './components/vehicles/VehicleTracker';
import RouteOptimizer from './components/routes/RouteOptimizer';
import AlertCenter from './components/alerts/AlertCenter';
import FieldReporting from './components/reports/FieldReporting';
import Analytics from './components/analytics/Analytics';

const Login = () => {
  const { login } = useAuth();
  const handleSubmit = (e) => {
    e.preventDefault();
    login('admin', 'password');
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800">NER Logistics</h1>
          <p className="text-slate-500">Intelligence Platform</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input type="text" required className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" required className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors mt-4">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return children;
};

const AppContent = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="map" element={<MapView />} />
        <Route path="vehicles" element={<VehicleTracker />} />
        <Route path="routes" element={<RouteOptimizer />} />
        <Route path="alerts" element={<AlertCenter />} />
        <Route path="reports" element={<FieldReporting />} />
        <Route path="analytics" element={<Analytics />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
