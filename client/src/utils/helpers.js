import { format, formatDistanceToNow } from 'date-fns';

export const formatDate = (date) => date ? format(new Date(date), 'MMM dd, yyyy') : '';
export const formatTime = (date) => date ? format(new Date(date), 'HH:mm') : '';
export const timeAgo = (date) => date ? formatDistanceToNow(new Date(date), { addSuffix: true }) : '';

export const getRiskColor = (score) => {
  if (score < 30) return '#10B981';
  if (score < 60) return '#F59E0B';
  if (score < 80) return '#F97316';
  return '#EF4444';
};

export const getStatusColor = (status) => {
  const colors = {
    accessible: 'bg-green-100 text-green-800 border-green-200',
    partial: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    blocked: 'bg-red-100 text-red-800 border-red-200',
    in_transit: 'bg-blue-100 text-blue-800 border-blue-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    delayed: 'bg-red-100 text-red-800 border-red-200'
  };
  return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
};

export const formatDistance = (km) => `${Number(km).toFixed(1)} km`;
export const formatDuration = (mins) => {
  const h = Math.floor(mins / 60);
  const m = Math.floor(mins % 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
};

export const generateId = () => Math.random().toString(36).substring(2, 9);
