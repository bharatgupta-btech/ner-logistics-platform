export const NER_CENTER = [26.2, 92.9];
export const NER_BOUNDS = [
  [21.9, 89.6],
  [29.5, 97.4]
];

export const NER_STATES = [
  { id: 'AS', name: 'Assam', color: '#3B82F6', center: [26.2, 92.9] },
  { id: 'AR', name: 'Arunachal Pradesh', color: '#10B981', center: [28.2, 94.6] },
  { id: 'MN', name: 'Manipur', color: '#F59E0B', center: [24.8, 93.9] },
  { id: 'ML', name: 'Meghalaya', color: '#8B5CF6', center: [25.5, 91.2] },
  { id: 'MZ', name: 'Mizoram', color: '#EC4899', center: [23.7, 92.7] },
  { id: 'NL', name: 'Nagaland', color: '#EF4444', center: [26.1, 94.5] },
  { id: 'SK', name: 'Sikkim', color: '#14B8A6', center: [27.5, 88.5] },
  { id: 'TR', name: 'Tripura', color: '#F97316', center: [23.9, 91.9] }
];

export const VEHICLE_TYPES = {
  TRUCK: { icon: '🚛', color: '#3B82F6' },
  VAN: { icon: '🚐', color: '#10B981' },
  TANKER: { icon: '🛢️', color: '#F59E0B' },
  REFRIGERATED: { icon: '❄️', color: '#8B5CF6' }
};

export const ALERT_SEVERITIES = {
  CRITICAL: { color: '#EF4444', bg: 'bg-red-100' },
  HIGH: { color: '#F97316', bg: 'bg-orange-100' },
  MEDIUM: { color: '#F59E0B', bg: 'bg-yellow-100' },
  LOW: { color: '#3B82F6', bg: 'bg-blue-100' }
};

export const CARGO_TYPES = ['Essential', 'Medical', 'Fuel', 'Construction', 'General'];

export const STATUS_COLORS = {
  active: 'bg-green-100 text-green-800 border-green-200',
  delayed: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  blocked: 'bg-red-100 text-red-800 border-red-200',
  delivered: 'bg-blue-100 text-blue-800 border-blue-200'
};

export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी' },
  { code: 'as', name: 'অসমীয়া' },
  { code: 'mni', name: 'মৈতৈলোন্' },
  { code: 'nag', name: 'Nagamese' }
];
