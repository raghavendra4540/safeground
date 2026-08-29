import useMapStore from '../../store/mapStore.js';

const LAYER_LEGENDS = {
  composite: {
    title: 'Composite Risk',
    levels: [
      { label: 'Critical (76–100)', color: '#ef4444' },
      { label: 'High (51–75)', color: '#f97316' },
      { label: 'Moderate (26–50)', color: '#eab308' },
      { label: 'Safe (0–25)', color: '#22c55e' },
    ],
  },
  flood: {
    title: 'Flood Risk Level',
    levels: [
      { label: 'Severe Flood (76–100)', color: '#2563eb' },
      { label: 'High Inundation (51–75)', color: '#3b82f6' },
      { label: 'Low/Moderate (0–50)', color: '#60a5fa' },
    ],
  },
  landslide: {
    title: 'Landslide Hazard',
    levels: [
      { label: 'High Slope Failure (76–100)', color: '#b45309' },
      { label: 'Active Slide Zone (51–75)', color: '#d97706' },
      { label: 'Low/Moderate (0–50)', color: '#f59e0b' },
    ],
  },
  cyclone: {
    title: 'Cyclone Impact',
    levels: [
      { label: 'Severe Wind Corridor (76–100)', color: '#6d28d9' },
      { label: 'High Wind Zone (51–75)', color: '#8b5cf6' },
      { label: 'Moderate Impact (0–50)', color: '#a78bfa' },
    ],
  },
  heat: {
    title: 'Extreme Heat Stress',
    levels: [
      { label: 'Heat Dome 46°C+ (76–100)', color: '#b91c1c' },
      { label: 'High Heat Wave (51–75)', color: '#ef4444' },
      { label: 'Moderate (0–50)', color: '#f87171' },
    ],
  },
};

const MapLegend = () => {
  const activeLayer = useMapStore(s => s.activeLayer);
  const legend = LAYER_LEGENDS[activeLayer] || LAYER_LEGENDS.composite;

  return (
    <div
      onClick={e => e.stopPropagation()}
      className="glass border border-white/10 rounded-xl p-3 text-xs shadow-xl select-none"
      style={{ pointerEvents: 'auto', minWidth: 160 }}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-gray-300 font-semibold uppercase tracking-wider text-[11px]">{legend.title}</p>
      </div>

      {legend.levels.map(({ label, color }) => (
        <div key={label} className="flex items-center gap-2 mb-1.5">
          <div className="w-3 h-3 rounded-sm flex-shrink-0" style={{ background: color, opacity: 0.9 }} />
          <span className="text-gray-300 text-[11px]">{label}</span>
        </div>
      ))}

      <div className="mt-2 pt-2 border-t border-white/5 space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-sm flex-shrink-0 bg-emerald-500 flex items-center justify-center text-white font-bold" style={{ fontSize: 9 }}>✓</div>
          <span className="text-gray-300 text-[11px]">Safe Relocation Site</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded-full flex-shrink-0 bg-red-500 border border-white/80 flex items-center justify-center text-[7px] text-white font-bold">90</div>
          <span className="text-gray-300 text-[11px]">Settlement (Score)</span>
        </div>
      </div>
    </div>
  );
};

export default MapLegend;
