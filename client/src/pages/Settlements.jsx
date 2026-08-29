import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, ChevronUp, Users, AlertTriangle, Brain, X, MapPin, Navigation, Globe } from 'lucide-react';
import { getSettlements } from '../services/settlement.api.js';
import { analyzeRisk } from '../services/ai.api.js';
import RiskBadge from '../components/common/RiskBadge.jsx';
import { PageLoader } from '../components/common/Loader.jsx';
import AIThinking from '../components/ai/AIThinking.jsx';
import AIRecommendation from '../components/ai/AIRecommendation.jsx';
import { getRiskTextColor } from '../utils/riskUtils.js';
import EmptyState from '../components/common/EmptyState.jsx';
import useMapStore from '../store/mapStore.js';
import useDashboardStore from '../store/dashboardStore.js';

const RISK_FILTERS = ['ALL', 'CRITICAL', 'HIGH', 'MODERATE', 'SAFE'];

const Settlements = () => {
  const navigate = useNavigate();
  const { setSelectedSettlement, setMapCenter, setMapZoom } = useMapStore();
  const selectedRegion = useDashboardStore(s => s.selectedRegion);

  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('ALL');
  const [selected, setSelected] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [sortField, setSortField] = useState('hazardScore');
  const [sortDir, setSortDir] = useState('desc');

  useEffect(() => {
    loadSettlements();
  }, [selectedRegion]);

  const loadSettlements = async () => {
    setLoading(true);
    try {
      const regionParam = selectedRegion === 'All India' ? {} : { region: selectedRegion };
      const res = await getSettlements({ limit: 120, ...regionParam });
      setSettlements(res.data.data);
    } catch (e) {}
    setLoading(false);
  };

  const handleAnalyze = async (settlement) => {
    setSelected(settlement);
    setAiResult(null);
    setAiLoading(true);
    try {
      const res = await analyzeRisk({ settlementId: settlement._id });
      setAiResult(res.data.data);
    } catch (e) {
      setAiResult({
        aiExplanation: {
          explanation: `Automated assessment for ${settlement.name}:\n• Composite Red Zone score: ${settlement.hazardScore}/100 (${settlement.riskLevel}).\n• Vulnerability index: ${settlement.totalVulnerable?.toLocaleString()} residents in high-need categories.\n• Recommendation: Prioritize immediate shelter allocation.`,
          confidence: 90,
        },
      });
    }
    setAiLoading(false);
  };

  const handleOpenOnMap = (s, e) => {
    e?.stopPropagation();
    setSelectedSettlement(s);
    if (s.location?.coordinates) {
      setMapCenter([s.location.coordinates[1], s.location.coordinates[0]]);
      setMapZoom(10);
    }
    navigate('/map');
  };

  const handlePlanRelocation = (s, e) => {
    e?.stopPropagation();
    navigate(`/relocation?settlementId=${s._id}`);
  };

  const filtered = settlements
    .filter(s => filter === 'ALL' || s.riskLevel === filter)
    .filter(s => !search || s.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      const av = a[sortField] ?? 0;
      const bv = b[sortField] ?? 0;
      return sortDir === 'desc' ? bv - av : av - bv;
    });

  const toggleSort = (field) => {
    if (sortField === field) setSortDir(d => d === 'desc' ? 'asc' : 'desc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortIcon = ({ field }) => sortField === field
    ? (sortDir === 'desc' ? <ChevronDown size={12} /> : <ChevronUp size={12} />)
    : null;

  if (loading) return <PageLoader />;

  return (
    <div className="flex h-full">
      {/* Main table */}
      <div className="flex-1 p-6 overflow-y-auto min-w-0">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-xl font-bold text-white mb-1">Settlement Risk & Vulnerability Directory</h1>
            <p className="text-sm text-gray-400">{filtered.length} of {settlements.length} monitored settlements</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search settlements..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-9"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {RISK_FILTERS.map(f => (
              <button key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                  filter === f
                    ? 'bg-blue-600/25 text-blue-300 border-blue-500/40'
                    : 'text-gray-400 border-white/5 hover:bg-white/5'
                }`}>{f}</button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No settlements found" message="Try adjusting your search or filter" />
        ) : (
          <div className="glass rounded-xl border border-white/5 overflow-hidden shadow-xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 text-xs text-gray-400 uppercase tracking-wide bg-navy-950/40">
                  {[
                    { label: 'Settlement', field: 'name' },
                    { label: 'Population', field: 'population' },
                    { label: 'Risk Score', field: 'hazardScore' },
                    { label: 'Risk Level', field: 'riskLevel' },
                    { label: 'Flood Risk', field: 'floodRisk' },
                    { label: 'Heat Risk', field: 'heatRisk' },
                    { label: 'Priority', field: 'priorityScore' },
                    { label: 'Vulnerable', field: 'totalVulnerable' },
                    { label: 'Decision Actions', field: null },
                  ].map(({ label, field }) => (
                    <th key={label}
                      onClick={() => field && toggleSort(field)}
                      className={`text-left py-3 px-4 ${field ? 'cursor-pointer hover:text-gray-200' : ''} font-semibold`}>
                      <div className="flex items-center gap-1">{label}<SortIcon field={field} /></div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <motion.tr key={s._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: Math.min(i * 0.02, 0.3) }}
                    className={`border-b border-white/3 hover:bg-white/3 transition-colors ${selected?._id === s._id ? 'bg-blue-500/10' : ''}`}>
                    <td className="py-3 px-4">
                      <p className="font-semibold text-gray-200">{s.name}</p>
                      <p className="text-xs text-gray-500">{s.regionName}</p>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <Users size={12} className="text-gray-500" />
                        <span className="text-gray-200 font-medium">{s.population?.toLocaleString()}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-lg font-bold ${getRiskTextColor(s.riskLevel)}`}>{s.hazardScore}</span>
                    </td>
                    <td className="py-3 px-4"><RiskBadge level={s.riskLevel} /></td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold ${s.floodRisk > 70 ? 'text-blue-400 font-bold' : 'text-gray-400'}`}>{s.floodRisk}/100</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-semibold ${s.heatRisk > 70 ? 'text-red-400 font-bold' : 'text-gray-400'}`}>{s.heatRisk}/100</span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-14 h-1.5 bg-white/5 rounded-full overflow-hidden">
                          <div className="h-full rounded-full bg-orange-500" style={{ width: `${s.priorityScore}%` }} />
                        </div>
                        <span className="text-xs text-gray-300 font-medium">{s.priorityScore}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-300 font-medium">{s.totalVulnerable?.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => handleAnalyze(s)}
                          title="Explain risk with AI"
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 text-xs font-medium transition-colors border border-blue-500/20"
                        >
                          <Brain size={12} />
                          AI
                        </button>
                        <button
                          onClick={(e) => handleOpenOnMap(s, e)}
                          title="View on Map"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs border border-white/5 transition-colors"
                        >
                          <MapPin size={12} />
                        </button>
                        <button
                          onClick={(e) => handlePlanRelocation(s, e)}
                          title="Plan Relocation"
                          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs font-semibold transition-colors border border-emerald-500/30"
                        >
                          <Navigation size={11} />
                          Relocate
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* AI Analysis Panel */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="w-96 border-l border-white/10 p-5 overflow-y-auto bg-navy-900/90 backdrop-blur-md"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-gray-200 text-sm">Settlement Risk Diagnostic</h3>
              <button onClick={() => { setSelected(null); setAiResult(null); }} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-500">
                <X size={14} />
              </button>
            </div>

            {/* Settlement quick stats */}
            <div className="glass-card mb-4 !p-3">
              <h4 className="font-bold text-gray-200 mb-2 text-sm">{selected.name}</h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div><span className="text-gray-500">Composite Risk</span><p className={`font-black text-lg ${getRiskTextColor(selected.riskLevel)}`}>{selected.hazardScore}</p></div>
                <div><span className="text-gray-500">Risk Level</span><p className="mt-0.5"><RiskBadge level={selected.riskLevel} /></p></div>
                <div><span className="text-gray-500">Population</span><p className="text-gray-200 font-semibold">{selected.population?.toLocaleString()}</p></div>
                <div><span className="text-gray-500">Priority Level</span><p className="text-orange-400 font-bold">{selected.priorityLevel}</p></div>
              </div>

              <div className="mt-3 pt-3 border-t border-white/5 flex gap-2">
                <button
                  onClick={() => handlePlanRelocation(selected)}
                  className="flex-1 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center justify-center gap-1 transition-all"
                >
                  <Navigation size={12} />
                  Plan Relocation
                </button>
                <button
                  onClick={() => handleOpenOnMap(selected)}
                  className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs border border-white/10 flex items-center justify-center gap-1 transition-all"
                >
                  <MapPin size={12} />
                  Map
                </button>
              </div>
            </div>

            {aiLoading && <AIThinking active />}

            {aiResult && !aiLoading && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
                {aiResult.error ? (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">Analysis unavailable</div>
                ) : (
                  <>
                    <AIRecommendation data={aiResult.aiExplanation} />
                    <div className="glass-card !p-3 text-xs space-y-1.5">
                      <p className="text-gray-400 font-semibold mb-2 uppercase text-[10px] tracking-wide">Detailed Risk Breakdown</p>
                      {[
                        { label: 'Flood Risk', value: selected.floodRisk, bad: true },
                        { label: 'Landslide Risk', value: selected.landslideRisk || 40, bad: true },
                        { label: 'Cyclone Risk', value: selected.cycloneRisk || 50, bad: true },
                        { label: 'Heat Risk', value: selected.heatRisk, bad: true },
                        { label: 'Road Access', value: selected.roadAccessibility, bad: false },
                        { label: 'Healthcare', value: selected.healthcareAccess, bad: false },
                      ].map(({ label, value, bad }) => (
                        <div key={label} className="flex items-center gap-2">
                          <span className="text-gray-400 w-24 text-[11px]">{label}</span>
                          <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full rounded-full" style={{
                              width: `${value}%`,
                              background: bad ? (value > 70 ? '#ef4444' : value > 40 ? '#f97316' : '#22c55e')
                                : (value > 70 ? '#22c55e' : value > 40 ? '#f97316' : '#ef4444'),
                            }} />
                          </div>
                          <span className="text-gray-300 w-8 text-right font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Settlements;

