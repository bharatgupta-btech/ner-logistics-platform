import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[200px]">
      <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      {text && <p className="mt-4 text-sm text-slate-500">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
