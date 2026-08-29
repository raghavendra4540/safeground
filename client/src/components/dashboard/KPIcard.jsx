import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown } from 'lucide-react';

const useCounter = (target, duration = 1500) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    const start = Date.now();
    const step = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration]);
  return count;
};

const KPICard = ({ title, value, icon: Icon, color = 'blue', trend, trendLabel, prefix = '', suffix = '', delay = 0 }) => {
  const count = useCounter(typeof value === 'number' ? value : 0, 1500);
  const displayValue = typeof value === 'number' ? count.toLocaleString('en-IN') : value;

  const colors = {
    blue: { bg: 'from-blue-600/20 to-blue-600/5', border: 'border-blue-500/20', icon: 'bg-blue-500/20 text-blue-400', text: 'text-blue-400' },
    red: { bg: 'from-red-600/20 to-red-600/5', border: 'border-red-500/20', icon: 'bg-red-500/20 text-red-400', text: 'text-red-400' },
    orange: { bg: 'from-orange-600/20 to-orange-600/5', border: 'border-orange-500/20', icon: 'bg-orange-500/20 text-orange-400', text: 'text-orange-400' },
    green: { bg: 'from-green-600/20 to-green-600/5', border: 'border-green-500/20', icon: 'bg-green-500/20 text-green-400', text: 'text-green-400' },
    purple: { bg: 'from-purple-600/20 to-purple-600/5', border: 'border-purple-500/20', icon: 'bg-purple-500/20 text-purple-400', text: 'text-purple-400' },
  };

  const c = colors[color] || colors.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`relative overflow-hidden rounded-xl border ${c.border} bg-gradient-to-br ${c.bg} p-5`}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-xs font-medium text-gray-400 uppercase tracking-wide">{title}</p>
        <div className={`w-9 h-9 rounded-lg ${c.icon} flex items-center justify-center`}>
          <Icon size={18} />
        </div>
      </div>
      <div className="flex items-end gap-2">
        <p className={`text-2xl font-bold counter-text ${c.text}`}>
          {prefix}{displayValue}{suffix}
        </p>
        {trend !== undefined && (
          <div className={`flex items-center gap-0.5 text-xs mb-0.5 ${trend > 0 ? 'text-red-400' : 'text-green-400'}`}>
            {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            <span>{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
      {trendLabel && <p className="text-xs text-gray-500 mt-1">{trendLabel}</p>}
      {/* subtle glow */}
      <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full opacity-10 bg-gradient-radial ${c.text}`} />
    </motion.div>
  );
};

export default KPICard;
