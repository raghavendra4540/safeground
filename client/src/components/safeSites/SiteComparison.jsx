import { motion } from 'framer-motion';
import { X, Brain } from 'lucide-react';

const metrics = [
  { key: 'safetyScore', label: 'Safety Score', suffix: '/100', higher: true },
  { key: 'availableCapacity', label: 'Available Capacity', higher: true, format: (v, s) => (s.totalCapacity - s.occupiedCapacity)?.toLocaleString() },
  { key: 'healthcareScore', label: 'Healthcare', suffix: '/100', higher: true },
  { key: 'roadAccessibility', label: 'Road Access', suffix: '/100', higher: true },
  { key: 'educationScore', label: 'Education', suffix: '/100', higher: true },
  { key: 'waterCapacity', label: 'Water Supply', suffix: '/100', higher: true },
  { key: 'transportDistance', label: 'Distance', suffix: ' km', higher: false },
  { key: 'transportCost', label: 'Est. Cost/person', prefix: '₹', higher: false },
];

const SiteComparison = ({ sites, onClose }) => {
  if (!sites?.length) return null;

  const getBest = (key, higher) => {
    const values = sites.map(s => {
      if (key === 'availableCapacity') return s.totalCapacity - s.occupiedCapacity;
      return s[key];
    });
    return higher ? Math.max(...values) : Math.min(...values);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card overflow-hidden"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Brain size={16} className="text-blue-400" />
          <h3 className="text-sm font-semibold text-gray-200">Site Comparison</h3>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-white/10 text-gray-500">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/5">
              <th className="text-left py-2 pr-4 text-gray-500 font-medium">Metric</th>
              {sites.map(s => (
                <th key={s._id} className="text-center py-2 px-3 text-gray-200 font-semibold min-w-28">
                  {s.name.split(' ').slice(0, 2).join(' ')}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {metrics.map(({ key, label, suffix = '', prefix = '', higher, format }) => {
              const best = getBest(key, higher);
              return (
                <tr key={key} className="border-b border-white/3 hover:bg-white/2">
                  <td className="py-2 pr-4 text-gray-400">{label}</td>
                  {sites.map(s => {
                    const val = key === 'availableCapacity' ? s.totalCapacity - s.occupiedCapacity : s[key];
                    const isBest = val === best;
                    return (
                      <td key={s._id} className={`text-center py-2 px-3 font-semibold ${isBest ? 'text-green-400' : 'text-gray-300'}`}>
                        {format ? format(val, s) : `${prefix}${typeof val === 'number' ? val.toLocaleString() : val}${suffix}`}
                        {isBest && <span className="ml-1 text-xs">★</span>}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="mt-3 p-3 rounded-lg bg-blue-500/5 border border-blue-500/15">
        <p className="text-xs text-blue-300">
          <span className="font-semibold">★ AI Recommendation: </span>
          {sites.reduce((best, s) => s.safetyScore > best.safetyScore ? s : best, sites[0])?.name} offers the best safety-capacity balance.
        </p>
      </div>
    </motion.div>
  );
};

export default SiteComparison;
