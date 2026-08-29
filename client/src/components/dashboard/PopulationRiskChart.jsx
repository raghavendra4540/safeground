import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = { CRITICAL: '#ef4444', HIGH: '#f97316', MODERATE: '#eab308', SAFE: '#22c55e' };

const PopulationRiskChart = ({ data }) => {
  if (!data) return null;

  const chartData = data.byRiskLevel?.map(d => ({
    level: d.level,
    population: d.population,
    color: COLORS[d.level],
  })) || [];

  return (
    <div className="glass-card">
      <h3 className="text-sm font-semibold text-gray-200 mb-4">Population by Risk Level</h3>
      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} barSize={32}>
            <XAxis dataKey="level" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false}
              tickFormatter={v => v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v} />
            <Tooltip
              contentStyle={{ background: '#0f2040', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              formatter={(v) => [v.toLocaleString('en-IN'), 'Population']}
            />
            <Bar dataKey="population" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, i) => (
                <Cell key={i} fill={entry.color} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PopulationRiskChart;
