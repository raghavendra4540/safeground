const Badge = ({ children, variant = 'default', size = 'sm' }) => {
  const variants = {
    default: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
    critical: 'bg-red-500/15 text-red-400 border-red-500/30',
    high: 'bg-orange-500/15 text-orange-400 border-orange-500/30',
    moderate: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/30',
    safe: 'bg-green-500/15 text-green-400 border-green-500/30',
    blue: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    urgent: 'bg-red-500/15 text-red-400 border-red-500/30',
  };
  const sizes = { xs: 'text-xs px-1.5 py-0.5', sm: 'text-xs px-2 py-1', md: 'text-sm px-3 py-1' };

  return (
    <span className={`inline-flex items-center rounded-md border font-medium ${variants[variant] || variants.default} ${sizes[size]}`}>
      {children}
    </span>
  );
};

export default Badge;
