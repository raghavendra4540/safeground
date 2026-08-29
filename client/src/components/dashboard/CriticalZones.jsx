import { motion } from 'framer-motion';
import { AlertTriangle, ArrowRight, MapPin, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import RiskBadge from '../common/RiskBadge.jsx';
import useMapStore from '../../store/mapStore.js';

const CriticalZones = ({ settlements = [] }) => {
  const navigate = useNavigate();
  const { setSelectedSettlement, setMapCenter, setMapZoom } = useMapStore();

  const handleOpenOnMap = (s, e) => {
    e?.stopPropagation();
    setSelectedSettlement(s);
    if (s.location?.coordinates) {
      setMapCenter([s.location.coordinates[1], s.location.coordinates[0]]);
      setMapZoom(10);
    }
    navigate('/map');
  };

  const handleRelocate = (s, e) => {
    e?.stopPropagation();
    navigate(`/relocation?settlementId=${s._id}`);
  };

  return (
    <div className="glass-card">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-gray-200">High-Risk Settlements Requiring Action</h3>
          <p className="text-[11px] text-gray-400">Prioritized by multi-hazard exposure & community vulnerability</p>
        </div>
        <button
          onClick={() => navigate('/settlements')}
          className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 transition-colors"
        >
          View all 30 <ArrowRight size={12} />
        </button>
      </div>

      <div className="space-y-2">
        {settlements.slice(0, 5).map((s, i) => (
          <motion.div
            key={s._id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.06 }}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white/3 hover:bg-white/6 transition-all border border-white/5 group"
          >
            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={15} className="text-red-400" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-gray-200 truncate">{s.name}</p>
                <RiskBadge level={s.riskLevel} size="xs" />
              </div>
              <p className="text-xs text-gray-500">
                {s.population?.toLocaleString()} residents · Priority score: <span className="text-orange-400 font-semibold">{s.priorityScore || 85}</span>
              </p>
            </div>

            <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
              <button
                onClick={(e) => handleOpenOnMap(s, e)}
                title="View on Interactive Map"
                className="px-2 py-1 rounded-lg bg-blue-600/15 hover:bg-blue-600/30 text-blue-300 text-xs border border-blue-500/20 flex items-center gap-1 transition-colors"
              >
                <MapPin size={11} />
                Map
              </button>
              <button
                onClick={(e) => handleRelocate(s, e)}
                title="Plan Relocation"
                className="px-2 py-1 rounded-lg bg-emerald-600/15 hover:bg-emerald-600/30 text-emerald-300 text-xs border border-emerald-500/20 flex items-center gap-1 transition-colors font-medium"
              >
                <Navigation size={11} />
                Relocate
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CriticalZones;

