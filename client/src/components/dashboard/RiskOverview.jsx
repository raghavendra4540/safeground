import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const COLORS = { CRITICAL: '#ef4444', HIGH: '#f97316', MODERATE: '#eab308', SAFE: '#22c55e' };

const RiskOverview = ({ data }) => {
  if (!data) return null;

  const chartData = Object.entries(data).map(([level, count]) => ({
    name: level,
    value: count,
    color: COLORS[level],
  })).filter(d => d.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    return (
      <div className="glass border border-white/10 rounded-lg px-3 py-2 text-xs">
        <p style={{ color: payload[0].payload.color }}>{payload[0].name}: {payload[0].value} settlements</p>
      </div>
    );
  };

  return (
    <div className="glass-card">
      <h3 className="text-sm font-semibold text-gray-200 mb-4">Risk Distribution</h3>
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={75}
              paddingAngle={3} dataKey="value">
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} stroke="none" />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-2">
        {chartData.map(d => (
          <div key={d.name} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ background: d.color }} />
            <span className="text-xs text-gray-400">{d.name}: <span className="text-gray-200 font-medium">{d.value}</span></span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RiskOverview;
