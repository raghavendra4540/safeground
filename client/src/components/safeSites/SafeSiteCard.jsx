import { motion } from 'framer-motion';
import { Shield, MapPin, Heart, GraduationCap, Droplets, Route } from 'lucide-react';
import CapacityBar from './CapacityBar.jsx';

const SafeSiteCard = ({ site, rank, onSelect, selected }) => {
  const available = site.totalCapacity - site.occupiedCapacity;
  const rankLabel = rank === 1 ? '🥇 Recommended' : rank === 2 ? '🥈 Alternative 1' : rank === 3 ? '🥉 Alternative 2' : `#${rank}`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: (rank - 1) * 0.08 }}
      onClick={() => onSelect?.(site)}
      className={`glass-card cursor-pointer transition-all ${selected ? 'border-blue-500/40 bg-blue-500/5' : 'hover:border-white/10'}`}
    >
      {rank && (
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-semibold text-gray-400">{rankLabel}</span>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-green-400">Active</span>
          </div>
        </div>
      )}

      <h3 className="font-semibold text-gray-100 text-sm mb-1">{site.name}</h3>
      <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-3">
        <MapPin size={11} />
        <span>{site.regionName} • {site.elevation}m elevation</span>
      </div>

      {/* Safety score */}
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-gray-400">Safety Score</span>
            <span className="text-green-400 font-bold">{site.safetyScore}/100</span>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-green-500" style={{ width: `${site.safetyScore}%` }} />
          </div>
        </div>
      </div>

      <CapacityBar total={site.totalCapacity} occupied={site.occupiedCapacity} className="mb-3" />

      {/* Scores grid */}
      <div className="grid grid-cols-2 gap-1.5">
        {[
          { icon: Heart, label: 'Healthcare', value: site.healthcareScore, color: 'text-red-400' },
          { icon: GraduationCap, label: 'Education', value: site.educationScore, color: 'text-blue-400' },
          { icon: Droplets, label: 'Water', value: site.waterCapacity, color: 'text-cyan-400' },
          { icon: Route, label: 'Road Access', value: site.roadAccessibility, color: 'text-purple-400' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="flex items-center gap-1.5 bg-white/3 rounded-lg p-2 border border-white/5">
            <Icon size={11} className={color} />
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-xs font-semibold text-gray-200">{value}/100</p>
            </div>
          </div>
        ))}
      </div>

      {site.transportDistance > 0 && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
          <span>~{site.transportDistance} km</span>
          <span>₹{site.transportCost}/person est.</span>
        </div>
      )}
    </motion.div>
  );
};

export default SafeSiteCard;
