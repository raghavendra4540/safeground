export const getRiskColor = (level) => {
  const map = { SAFE: '#22c55e', MODERATE: '#eab308', HIGH: '#f97316', CRITICAL: '#ef4444' };
  return map[level] || '#6b7280';
};

export const getRiskBg = (level) => {
  const map = {
    SAFE: 'bg-green-500/10 border-green-500/30 text-green-400',
    MODERATE: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400',
    HIGH: 'bg-orange-500/10 border-orange-500/30 text-orange-400',
    CRITICAL: 'bg-red-500/10 border-red-500/30 text-red-400',
  };
  return map[level] || 'bg-gray-500/10 border-gray-500/30 text-gray-400';
};

export const getRiskTextColor = (level) => {
  const map = { SAFE: 'text-green-400', MODERATE: 'text-yellow-400', HIGH: 'text-orange-400', CRITICAL: 'text-red-400' };
  return map[level] || 'text-gray-400';
};

export const getPriorityColor = (level) => {
  const map = { LOW: 'text-green-400', MEDIUM: 'text-yellow-400', HIGH: 'text-orange-400', URGENT: 'text-red-400' };
  return map[level] || 'text-gray-400';
};

export const getRiskLabel = (score) => {
  if (score >= 76) return 'CRITICAL';
  if (score >= 51) return 'HIGH';
  if (score >= 26) return 'MODERATE';
  return 'SAFE';
};

export const getScoreColor = (score) => getRiskColor(getRiskLabel(score));
