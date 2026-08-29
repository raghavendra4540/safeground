export const formatNumber = (n) => {
  if (n === undefined || n === null) return '—';
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
  return n.toLocaleString('en-IN');
};

export const formatLargeNumber = (n) => {
  if (!n) return '0';
  return n.toLocaleString('en-IN');
};
