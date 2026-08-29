import { RadarChart, PolarGrid, PolarAngleAxis, Radar, ResponsiveContainer, Tooltip } from 'recharts';

const HazardBreakdown = ({ data }) => {
  if (!data) return null;

  const chartData = [
    { subject: 'Flood', value: data.flood || 0 },
    { subject: 'Landslide', value: data.landslide || 0 },
    { subject: 'Cyclone', value: data.cyclone || 0 },
    { subject: 'Heat', value: data.heat || 0 },
  ];

  return (
    <div className="glass-card">
      <h3 className="text-sm font-semibold text-gray-200 mb-4">Average Hazard Profile</h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData} cx="50%" cy="50%" outerRadius={70}>
            <PolarGrid stroke="rgba(255,255,255,0.05)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#9ca3af', fontSize: 11 }} />
            <Radar name="Hazard" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.25} />
            <Tooltip
              contentStyle={{ background: '#0f2040', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
              labelStyle={{ color: '#e2e8f0' }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HazardBreakdown;
