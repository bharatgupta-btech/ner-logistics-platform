import React, { useState } from 'react';
import SupplyChainView from './SupplyChainView';
import PredictionPanel from './PredictionPanel';

const Analytics = () => {
  const [tab, setTab] = useState('supply');

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-800">Analytics & Intelligence</h2>
        <div className="bg-slate-100 p-1 rounded-lg inline-flex">
          <button 
            onClick={() => setTab('supply')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'supply' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-800'}`}
          >
            Supply Chain
          </button>
          <button 
            onClick={() => setTab('ai')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${tab === 'ai' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-600 hover:text-slate-800'}`}
          >
            AI Predictions
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        {tab === 'supply' ? <SupplyChainView /> : <PredictionPanel />}
      </div>
    </div>
  );
};

export default Analytics;
