import { motion } from 'framer-motion';
import { Layers, Eye, EyeOff, Shield, AlertTriangle, Building2 } from 'lucide-react';
import useMapStore from '../../store/mapStore.js';

const LAYERS = [
  { id: 'composite', label: 'Composite Risk', icon: '⚡', color: '#ef4444' },
  { id: 'flood', label: 'River/Flood Zone', icon: '🌊', color: '#3b82f6' },
  { id: 'landslide', label: 'Landslide Slope', icon: '⛰️', color: '#d97706' },
  { id: 'cyclone', label: 'Cyclone Corridor', icon: '🌀', color: '#8b5cf6' },
  { id: 'heat', label: 'Extreme Heat Dome', icon: '🌡️', color: '#ef4444' },
];

const MapControls = () => {
  const {
    activeLayer, setActiveLayer,
    showSafeSites, toggleSafeSites,
    showSettlements, toggleSettlements,
    showHazardZones, toggleHazardZones,
  } = useMapStore();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      onClick={e => e.stopPropagation()}
      className="glass border border-white/10 rounded-xl p-3 shadow-2xl w-52 select-none"
      style={{ pointerEvents: 'auto' }}
    >
      {/* Layer selector */}
      <div className="flex items-center gap-2 mb-2 pb-1.5 border-b border-white/5">
        <Layers size={14} className="text-blue-400" />
        <span className="text-xs font-bold text-white tracking-wide">Hazard Layers</span>
      </div>

      <div className="space-y-1 mb-3">
        {LAYERS.map(l => {
          const isActive = activeLayer === l.id;
          return (
            <button
              key={l.id}
              onClick={() => setActiveLayer(l.id)}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs transition-all ${
                isActive
                  ? 'bg-blue-600/25 text-white font-bold border border-blue-500/40 shadow-sm'
                  : 'text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent'
              }`}
            >
              <span className="text-sm">{l.icon}</span>
              <span className="truncate">{l.label}</span>
              {isActive && (
                <span className="ml-auto w-2 h-2 rounded-full" style={{ background: l.color, boxShadow: `0 0 6px ${l.color}` }} />
              )}
            </button>
          );
        })}
      </div>

      {/* Visibility toggles */}
      <div className="border-t border-white/5 pt-2 space-y-1">
        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold px-1 mb-1">GIS Overlays</p>

        <button
          onClick={toggleSettlements}
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
            showSettlements ? 'text-gray-200 hover:bg-white/5' : 'text-gray-600 hover:bg-white/5'
          }`}
        >
          <Building2 size={13} className={showSettlements ? 'text-blue-400' : 'text-gray-600'} />
          <span>Settlements</span>
          <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-bold ${
            showSettlements ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-gray-600'
          }`}>
            {showSettlements ? 'ON' : 'OFF'}
          </span>
        </button>

        <button
          onClick={toggleSafeSites}
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
            showSafeSites ? 'text-gray-200 hover:bg-white/5' : 'text-gray-600 hover:bg-white/5'
          }`}
        >
          <Shield size={13} className={showSafeSites ? 'text-emerald-400' : 'text-gray-600'} />
          <span>Safe Sites</span>
          <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-bold ${
            showSafeSites ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-white/5 text-gray-600'
          }`}>
            {showSafeSites ? 'ON' : 'OFF'}
          </span>
        </button>

        <button
          onClick={toggleHazardZones}
          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs transition-colors ${
            showHazardZones ? 'text-gray-200 hover:bg-white/5' : 'text-gray-600 hover:bg-white/5'
          }`}
        >
          <AlertTriangle size={13} className={showHazardZones ? 'text-amber-400' : 'text-gray-600'} />
          <span>Hazard Polygons</span>
          <span className={`ml-auto text-[10px] px-1.5 py-0.5 rounded font-bold ${
            showHazardZones ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/5 text-gray-600'
          }`}>
            {showHazardZones ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>
    </motion.div>
  );
};

export default MapControls;

