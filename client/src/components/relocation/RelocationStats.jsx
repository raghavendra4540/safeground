import { Users, MapPin, DollarSign, Clock, TrendingUp, Home } from 'lucide-react';
import { formatCurrency } from '../../utils/formatCurrency.js';

const Stat = ({ icon: Icon, label, value, sub, color = 'text-blue-400' }) => (
  <div className="bg-white/3 rounded-xl p-3.5 border border-white/5 flex items-start gap-3">
    <div className={`w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center ${color}`}>
      <Icon size={16} />
    </div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`text-base font-bold ${color}`}>{value}</p>
      {sub && <p className="text-xs text-gray-500 mt-0.5">{sub}</p>}
    </div>
  </div>
);

const RelocationStats = ({ transport, settlement, site, safetyImprovement }) => {
  if (!transport) return null;
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
      <Stat icon={Users} label="Population" value={transport.population?.toLocaleString()} sub="to relocate" color="text-blue-400" />
      <Stat icon={MapPin} label="Distance" value={`${transport.distance} km`} sub={`~${transport.travelTimeMinutes} min travel`} color="text-purple-400" />
      <Stat icon={DollarSign} label="Est. Transport Cost" value={formatCurrency(transport.totalCost)} sub={`${formatCurrency(transport.costPerPerson)}/person`} color="text-yellow-400" />
      <Stat icon={Home} label="Vehicles Required" value={`${transport.vehiclesRequired}`} sub={`${transport.tripsRequired} trip(s)`} color="text-orange-400" />
      <Stat icon={TrendingUp} label="Safety Improvement" value={`+${safetyImprovement || 0}%`} sub="risk reduction" color="text-green-400" />
      <Stat icon={Clock} label="Operation Time" value={`${transport.totalOperationHours}h`} sub="estimated total" color="text-cyan-400" />
    </div>
  );
};

export default RelocationStats;
