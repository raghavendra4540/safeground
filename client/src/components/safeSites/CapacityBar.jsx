const CapacityBar = ({ total, occupied, className = '' }) => {
  const percent = total > 0 ? Math.round((occupied / total) * 100) : 0;
  const color = percent >= 90 ? '#ef4444' : percent >= 70 ? '#f97316' : percent >= 50 ? '#eab308' : '#22c55e';

  return (
    <div className={className}>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-400">Capacity used</span>
        <span style={{ color }}>{percent}%</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${percent}%`, background: color }} />
      </div>
      <div className="flex justify-between text-xs mt-1 text-gray-500">
        <span>{occupied?.toLocaleString()} occupied</span>
        <span>{(total - occupied)?.toLocaleString()} available</span>
      </div>
    </div>
  );
};

export default CapacityBar;
