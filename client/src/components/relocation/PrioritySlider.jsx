const PrioritySlider = ({ label, value, onChange, color = '#3b82f6' }) => (
  <div className="mb-4">
    <div className="flex items-center justify-between mb-2">
      <span className="text-sm text-gray-300">{label}</span>
      <span className="text-sm font-semibold" style={{ color }}>{Math.round(value * 100)}%</span>
    </div>
    <input
      type="range"
      min="0"
      max="1"
      step="0.05"
      value={value}
      onChange={e => onChange(parseFloat(e.target.value))}
      className="w-full h-2 rounded-full appearance-none cursor-pointer"
      style={{
        background: `linear-gradient(to right, ${color} 0%, ${color} ${value * 100}%, rgba(255,255,255,0.1) ${value * 100}%, rgba(255,255,255,0.1) 100%)`,
      }}
    />
  </div>
);

export default PrioritySlider;
