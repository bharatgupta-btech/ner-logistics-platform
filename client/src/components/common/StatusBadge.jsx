import React from 'react';
import { getStatusColor } from '../../utils/helpers';

const StatusBadge = ({ status, text }) => {
  const colorClass = getStatusColor(status);
  const displayText = text || status;

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${colorClass}`}>
      {displayText}
    </span>
  );
};

export default StatusBadge;
