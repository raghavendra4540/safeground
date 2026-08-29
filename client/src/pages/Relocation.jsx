import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation, ChevronRight, Check, ArrowRight, MapPin, Users, Shield, AlertTriangle } from 'lucide-react';
import { getSettlements } from '../services/settlement.api.js';
import { analyzeRelocation } from '../services/relocation.api.js';
import { recommendSite } from '../services/ai.api.js';
import SiteRecommendation from '../components/relocation/SiteRecommendation.jsx';
import RelocationStats from '../components/relocation/RelocationStats.jsx';
import PrioritySlider from '../components/relocation/PrioritySlider.jsx';
import AIThinking from '../components/ai/AIThinking.jsx';
import AIRecommendation from '../components/ai/AIRecommendation.jsx';
import RiskBadge from '../components/common/RiskBadge.jsx';
import { PageLoader } from '../components/common/Loader.jsx';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import { createSettlementIcon, createSafeSiteIcon } from '../utils/mapUtils.js';

const STEPS = ['Select Settlement', 'Set Population', 'Set Priorities', 'View Results'];
const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

const Relocation = () => {
  const [searchParams] = useSearchParams();
  const settlementIdParam = searchParams.get('settlementId');

  const [step, setStep] = useState(0);
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);

  const [selectedSettlement, setSelectedSettlement] = useState(null);
  const [settlementSearch, setSettlementSearch] = useState('');
  const [population, setPopulation] = useState(0);
  const [priorities, setPriorities] = useState({ safety: 0.45, cost: 0.15, distance: 0.15, capacity: 0.20, healthcare: 0.05 });
  const [results, setResults] = useState(null);
  const [selectedRec, setSelectedRec] = useState(null);
  const [aiRec, setAiRec] = useState(null);

  const filteredSettlements = settlements.filter(s =>
    s.name.toLowerCase().includes(settlementSearch.toLowerCase()) ||
    (s.regionName && s.regionName.toLowerCase().includes(settlementSearch.toLowerCase()))
  );

  useEffect(() => {
    getSettlements({ limit: 100 }).then(r => {
      const list = r.data.data || [];
      setSettlements(list);
      if (settlementIdParam) {
        const found = list.find(s => s._id === settlementIdParam);
        if (found) {
          setSelectedSettlement(found);
          setPopulation(found.population);
          setStep(2);
        }
      }
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [settlementIdParam]);

  const handleSelectSettlement = (s) => {
    setSelectedSettlement(s);
    setPopulation(s.population);
  };

  const runAnalysis = async () => {
    if (!selectedSettlement) return;
    setAnalyzing(true);
    setResults(null);
    setAiRec(null);
    try {
      const res = await recommendSite({ settlementId: selectedSettlement._id, priorities });
      setResults(res.data.data);
      setAiRec(res.data.data.aiRecommendation);
      setSelectedRec(res.data.data.recommendations?.[0] || null);
      setStep(3);
    } catch (e) {
      console.error(e);
    }
    setAnalyzing(false);
  };

  const routePoints = selectedRec && selectedSettlement && selectedSettlement.location?.coordinates && selectedRec.site?.location?.coordinates
    ? [
      [selectedSettlement.location.coordinates[1], selectedSettlement.location.coordinates[0]],
      [selectedRec.site.location.coordinates[1], selectedRec.site.location.coordinates[0]],
    ]
    : null;

  if (loading) return <PageLoader />;

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">AI Relocation & Destination Capacity Planner</h1>
        <p className="text-sm text-gray-400">Proactive relocation feasibility check, transport logistics estimation, and bottleneck detection</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
              i === step ? 'bg-blue-600/25 text-blue-300 border-blue-500/40'
              : i < step ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : 'text-gray-500 border-white/5'
            }`}>
              {i < step ? <Check size={12} /> : <span className="w-4 text-center">{i + 1}</span>}
              {s}
            </div>
            {i < STEPS.length - 1 && <ChevronRight size={14} className="text-gray-600" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Left: wizard panels */}
        <div className="lg:col-span-1 space-y-4">

          {/* Step 0: Settlement select */}
          <div className="glass-card">
            <h3 className="text-sm font-bold text-gray-200 mb-2 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-blue-600/30 flex items-center justify-center text-xs text-blue-300 font-bold">1</span>
              Select Target Settlement
            </h3>
            <input
              type="text"
              placeholder="Search Indian settlements..."
              value={settlementSearch}
              onChange={e => setSettlementSearch(e.target.value)}
              className="w-full px-2.5 py-1 mb-2 bg-white/5 border border-white/10 rounded-lg text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-blue-400"
            />
            <div className="space-y-1.5 max-h-60 overflow-y-auto">
              {filteredSettlements.map(s => (
                <button key={s._id}
                  onClick={() => { handleSelectSettlement(s); if (step === 0) setStep(1); }}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs border transition-all ${
                    selectedSettlement?._id === s._id ? 'bg-blue-500/15 border-blue-500/40 text-blue-300' : 'border-white/5 hover:bg-white/5 text-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold truncate mr-2">{s.name}</span>
                    <RiskBadge level={s.riskLevel} size="xs" />
                  </div>
                  <div className="flex justify-between text-gray-500 text-[11px] mt-0.5">
                    <span className="text-blue-400/80 font-medium">{s.regionName}</span>
                    <span>{s.population?.toLocaleString()} residents</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 1: Population */}
          {selectedSettlement && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
              <h3 className="text-sm font-bold text-gray-200 mb-3 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 flex items-center justify-center text-xs text-blue-300 font-bold">2</span>
                Population to Relocate
              </h3>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-blue-400" />
                  <span className="text-2xl font-black text-blue-400">{population?.toLocaleString()}</span>
                </div>
                <span className="text-xs text-gray-400">of {selectedSettlement.population?.toLocaleString()}</span>
              </div>
              <input type="range" min={100} max={selectedSettlement.population} step={50}
                value={population}
                onChange={e => { setPopulation(parseInt(e.target.value)); setStep(Math.max(step, 1)); }}
                className="w-full"
              />
              <div className="flex justify-between text-[11px] text-gray-500 mt-1">
                <span>Phase 1: 100</span>
                <span>Full: {selectedSettlement.population?.toLocaleString()}</span>
              </div>
            </motion.div>
          )}

          {/* Step 2: Priorities */}
          {step >= 1 && selectedSettlement && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass-card">
              <h3 className="text-sm font-bold text-gray-200 mb-4 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600/30 flex items-center justify-center text-xs text-blue-300 font-bold">3</span>
                Multi-Criteria Decision Weights
              </h3>
              <PrioritySlider label="Safety Score Importance" value={priorities.safety} color="#22c55e" onChange={v => setPriorities(p => ({ ...p, safety: v }))} />
              <PrioritySlider label="Transport Cost Minimization" value={priorities.cost} color="#eab308" onChange={v => setPriorities(p => ({ ...p, cost: v }))} />
              <PrioritySlider label="Distance Proximity" value={priorities.distance} color="#8b5cf6" onChange={v => setPriorities(p => ({ ...p, distance: v }))} />
              <PrioritySlider label="Host Capacity & Land" value={priorities.capacity} color="#3b82f6" onChange={v => setPriorities(p => ({ ...p, capacity: v }))} />
              <PrioritySlider label="Healthcare Access" value={priorities.healthcare} color="#ef4444" onChange={v => setPriorities(p => ({ ...p, healthcare: v }))} />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={runAnalysis}
                disabled={analyzing}
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-blue-500/25"
              >
                {analyzing ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Analyzing Candidate Sites...</>
                ) : (
                  <><Navigation size={15} />Generate Optimal Relocation Plan</>
                )}
              </motion.button>
            </motion.div>
          )}
        </div>

        {/* Right: results */}
        <div className="lg:col-span-2 space-y-4">
          {analyzing && (
            <div className="glass-card">
              <AIThinking active />
            </div>
          )}

          {results && !analyzing && (
            <>
              {/* Route map */}
              <div className="glass-card !p-0 overflow-hidden relative" style={{ height: 260 }}>
                <MapContainer center={[17.385, 78.486]} zoom={8} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                  <TileLayer url={TILE_URL} attribution={TILE_ATTR} />
                  {selectedSettlement && selectedSettlement.location?.coordinates && (
                    <Marker position={[selectedSettlement.location.coordinates[1], selectedSettlement.location.coordinates[0]]}
                      icon={createSettlementIcon(selectedSettlement.riskLevel, selectedSettlement.hazardScore)} />
                  )}
                  {selectedRec && selectedRec.site?.location?.coordinates && (
                    <Marker position={[selectedRec.site.location.coordinates[1], selectedRec.site.location.coordinates[0]]}
                      icon={createSafeSiteIcon()} />
                  )}
                  {routePoints && (
                    <Polyline positions={routePoints} color="#3b82f6" weight={4} dashArray="8,6" opacity={0.9} />
                  )}
                </MapContainer>
                {selectedSettlement && selectedRec && (
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-center gap-2 bg-navy-950/95 backdrop-blur rounded-xl px-4 py-2 text-xs text-gray-200 border border-white/10 shadow-xl">
                    <MapPin size={13} className="text-red-400" />
                    <span className="font-semibold">{selectedSettlement.name}</span>
                    <ArrowRight size={13} className="text-blue-400" />
                    <MapPin size={13} className="text-emerald-400" />
                    <span className="font-semibold">{selectedRec.site.name}</span>
                    <span className="ml-3 text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                      {selectedRec.distance} km
                    </span>
                  </div>
                )}
              </div>

              {/* Transport stats */}
              {selectedRec && (
                <RelocationStats
                  transport={selectedRec.transport}
                  settlement={selectedSettlement}
                  site={selectedRec.site}
                  safetyImprovement={selectedRec.safetyImprovement}
                />
              )}

              {/* AI recommendation */}
              {aiRec && <AIRecommendation data={aiRec} />}

              {/* Site recommendations */}
              <div>
                <h3 className="text-sm font-bold text-gray-200 mb-3">Ranked Candidate Relocation Sites</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {results.recommendations?.map(rec => (
                    <SiteRecommendation
                      key={rec.site._id}
                      recommendation={rec}
                      selected={selectedRec?.site._id === rec.site._id}
                      onSelect={r => setSelectedRec(r)}
                    />
                  ))}
                </div>
              </div>
            </>
          )}

          {!results && !analyzing && (
            <div className="glass-card flex flex-col items-center justify-center h-72 text-center p-8">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                <Navigation size={28} className="text-blue-400" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">Select a Settlement to Begin Relocation Intelligence</h3>
              <p className="text-sm text-gray-400 max-w-md">
                SafeGround checks carrying capacity, calculates transport logistics, identifies resource bottlenecks (water, healthcare, shelter), and recommends optimal destination zones.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Relocation;

