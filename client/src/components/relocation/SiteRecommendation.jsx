import { motion } from 'framer-motion';
import { Shield, MapPin, Heart, DollarSign, CheckCircle, XCircle, Star } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency.js';

const SiteRecommendation = ({ recommendation, onSelect, selected }) => {
  const { site, rank, label, candidateScore, distance, transport, feasibility, safetyImprovement } = recommendation;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: (rank - 1) * 0.1 }}
      onClick={() => onSelect?.(recommendation)}
      className={`glass-card cursor-pointer transition-all border ${
        selected ? 'border-blue-500/50 bg-blue-500/5' : rank === 1 ? 'border-green-500/20' : 'hover:border-white/10'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            {rank === 1 && <Star size={14} className="text-yellow-400 fill-yellow-400" />}
            <span className={`text-xs font-semibold ${rank === 1 ? 'text-green-400' : 'text-gray-400'}`}>
              #{rank} {label}
            </span>
          </div>
          <h3 className="text-sm font-semibold text-gray-100">{site.name}</h3>
        </div>
        <div className={`text-2xl font-bold ${candidateScore >= 75 ? 'text-green-400' : candidateScore >= 50 ? 'text-yellow-400' : 'text-orange-400'}`}>
          {candidateScore}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="flex items-center gap-2 text-xs">
          <Shield size={12} className="text-green-400" />
          <span className="text-gray-400">Safety:</span>
          <span className="text-green-400 font-semibold">{site.safetyScore}/100</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <MapPin size={12} className="text-purple-400" />
          <span className="text-gray-400">Distance:</span>
          <span className="text-gray-200 font-semibold">{distance} km</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <DollarSign size={12} className="text-yellow-400" />
          <span className="text-gray-400">Cost:</span>
          <span className="text-gray-200 font-semibold">{formatCurrency(transport?.totalCost)}</span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <Heart size={12} className="text-red-400" />
          <span className="text-gray-400">Healthcare:</span>
          <span className="text-gray-200 font-semibold">{site.healthcareScore}/100</span>
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-white/5">
        <div className="flex items-center gap-1.5 text-xs">
          {feasibility?.feasible
            ? <><CheckCircle size={12} className="text-green-400" /><span className="text-green-400">Feasible</span></>
            : <><XCircle size={12} className="text-orange-400" /><span className="text-orange-400">Partial capacity</span></>
          }
        </div>
        <span className="text-xs text-green-400 font-semibold">+{safetyImprovement}% safer</span>
      </div>
    </motion.div>
  );
};

export default SiteRecommendation;
