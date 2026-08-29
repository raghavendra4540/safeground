import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, BarChart2, SlidersHorizontal, X, Globe } from 'lucide-react';
import { getSafeSites } from '../services/safeSite.api.js';
import SafeSiteCard from '../components/safeSites/SafeSiteCard.jsx';
import SiteComparison from '../components/safeSites/SiteComparison.jsx';
import { PageLoader } from '../components/common/Loader.jsx';
import EmptyState from '../components/common/EmptyState.jsx';
import useDashboardStore from '../store/dashboardStore.js';

const SORT_OPTIONS = [
  { value: 'safetyScore', label: 'Highest Safety' },
  { value: 'capacity', label: 'Highest Capacity' },
  { value: 'transportCost', label: 'Lowest Cost' },
  { value: 'transportDistance', label: 'Closest' },
  { value: 'healthcareScore', label: 'Best Healthcare' },
];

const SafeSites = () => {
  const selectedRegion = useDashboardStore(s => s.selectedRegion);
  const [sites, setSites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('safetyScore');
  const [comparing, setComparing] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    setLoading(true);
    const regionParam = selectedRegion === 'All India' ? {} : { region: selectedRegion };
    getSafeSites(regionParam)
      .then(res => { setSites(res.data.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [selectedRegion]);

  const sorted = [...sites].sort((a, b) => {
    if (sortBy === 'capacity') return (b.totalCapacity - b.occupiedCapacity) - (a.totalCapacity - a.occupiedCapacity);
    if (sortBy === 'transportCost') return (a.transportCost || 999) - (b.transportCost || 999);
    if (sortBy === 'transportDistance') return (a.transportDistance || 999) - (b.transportDistance || 999);
    return (b[sortBy] || 0) - (a[sortBy] || 0);
  });

  const toggleCompare = (site) => {
    setComparing(prev => {
      if (prev.find(s => s._id === site._id)) return prev.filter(s => s._id !== site._id);
      if (prev.length >= 3) return prev;
      return [...prev, site];
    });
  };

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white mb-1">Safe Relocation Sites</h1>
          <p className="text-sm text-gray-400">{sites.length} designated safe zones · {sites.reduce((s, x) => s + (x.totalCapacity - x.occupiedCapacity), 0).toLocaleString()} total available capacity</p>
        </div>
        <div className="flex gap-2">
          {comparing.length >= 2 && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              onClick={() => setShowComparison(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600/20 text-blue-300 text-sm border border-blue-500/30 hover:bg-blue-600/30 transition-colors"
            >
              <BarChart2 size={15} />
              Compare {comparing.length} Sites
            </motion.button>
          )}
        </div>
      </div>

      {/* Sort */}
      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal size={14} className="text-gray-500" />
        <span className="text-xs text-gray-500">Sort by:</span>
        {SORT_OPTIONS.map(opt => (
          <button key={opt.value}
            onClick={() => setSortBy(opt.value)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              sortBy === opt.value ? 'bg-blue-600/20 text-blue-300 border-blue-500/30' : 'text-gray-400 border-white/5 hover:bg-white/5'
            }`}>{opt.label}</button>
        ))}
        {comparing.length > 0 && (
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs text-blue-300">{comparing.length}/3 selected for comparison</span>
            <button onClick={() => setComparing([])} className="text-xs text-gray-500 hover:text-gray-300">Clear</button>
          </div>
        )}
      </div>

      {/* Comparison panel */}
      {showComparison && (
        <div className="relative">
          <button onClick={() => setShowComparison(false)} className="absolute top-3 right-3 p-1 rounded-lg hover:bg-white/10 text-gray-500 z-10">
            <X size={14} />
          </button>
          <SiteComparison sites={comparing} />
        </div>
      )}

      {sorted.length === 0 ? (
        <EmptyState icon={Shield} title="No safe sites found" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sorted.map((site, i) => (
            <div key={site._id} className="relative group">
              <SafeSiteCard
                site={site}
                rank={i + 1}
                selected={comparing.some(s => s._id === site._id)}
                onSelect={toggleCompare}
              />
              <button
                onClick={() => toggleCompare(site)}
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity px-2 py-1 rounded bg-blue-600/20 text-blue-300 text-xs border border-blue-500/20"
              >
                {comparing.some(s => s._id === site._id) ? '✓ Added' : '+ Compare'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SafeSites;
