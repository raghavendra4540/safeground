import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Play, AlertTriangle, Users, Shield, Zap, TrendingUp } from 'lucide-react';
import { runSimulation } from '../services/simulation.api.js';
import AIThinking from '../components/ai/AIThinking.jsx';
import AIRecommendation from '../components/ai/AIRecommendation.jsx';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const SCENARIOS = [
  { id: 'flood', label: 'Flood', icon: '🌊', color: '#3b82f6', desc: 'River overflow and flash flooding' },
  { id: 'cyclone', label: 'Cyclone', icon: '🌀', color: '#7c3aed', desc: 'Bay of Bengal cyclonic event' },
  { id: 'heat', label: 'Extreme Heat', icon: '🌡️', color: '#dc2626', desc: 'Heat wave above 46°C' },
  { id: 'landslide', label: 'Landslide', icon: '⛰️', color: '#a16207', desc: 'Highland slope failures' },
  { id: 'combined', label: 'Multi-Hazard', icon: '⚡', color: '#ef4444', desc: 'Simultaneous compound event' },
];

const SEVERITIES = [
  { id: 'low', label: 'Low', color: '#22c55e' },
  { id: 'medium', label: 'Medium', color: '#eab308' },
  { id: 'high', label: 'High', color: '#f97316' },
  { id: 'extreme', label: 'Extreme', color: '#ef4444' },
];

const Simulation = () => {
  const [scenario, setScenario] = useState('flood');
  const [severity, setSeverity] = useState('medium');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [aiPlan, setAiPlan] = useState(null);

  const handleRun = async () => {
    setRunning(true);
    setResult(null);
    setAiPlan(null);
    try {
      const res = await runSimulation({ type: scenario, severity });
      setResult(res.data.data.result);
      setAiPlan({ plan: res.data.data.aiPlan?.plan, confidence: res.data.data.aiPlan?.confidence });
    } catch (e) {
      console.error(e);
    }
    setRunning(false);
  };

  const selectedScenario = SCENARIOS.find(s => s.id === scenario);

  const chartData = result ? [
    { label: 'Baseline Pop. at Risk', before: result.baseline?.populationAtRisk || 0, after: result.simulated?.affectedPopulation || 0 },
    { label: 'Critical Zones', before: result.baseline?.criticalZones || 0, after: result.simulated?.criticalZones || 0 },
    { label: 'Relocation Demand', before: 0, after: result.simulated?.relocationDemand || 0 },
  ] : [];

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white mb-1">Disaster Scenario Simulator</h1>
        <p className="text-sm text-gray-400">Model disaster impacts and generate emergency response plans</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Config panel */}
        <div className="space-y-4">
          {/* Scenario picker */}
          <div className="glass-card">
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Select Scenario</h3>
            <div className="space-y-2">
              {SCENARIOS.map(s => (
                <button key={s.id}
                  onClick={() => setScenario(s.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border text-sm transition-all ${
                    scenario === s.id
                      ? 'border-opacity-50 bg-opacity-10 text-white'
                      : 'border-white/5 text-gray-400 hover:bg-white/5'
                  }`}
                  style={scenario === s.id ? { borderColor: s.color + '50', backgroundColor: s.color + '15' } : {}}
                >
                  <span className="text-xl">{s.icon}</span>
                  <div className="text-left">
                    <p className="font-medium text-sm">{s.label}</p>
                    <p className="text-xs text-gray-500">{s.desc}</p>
                  </div>
                  {scenario === s.id && <div className="ml-auto w-2 h-2 rounded-full" style={{ background: s.color }} />}
                </button>
              ))}
            </div>
          </div>

          {/* Severity picker */}
          <div className="glass-card">
            <h3 className="text-sm font-semibold text-gray-200 mb-3">Severity Level</h3>
            <div className="grid grid-cols-2 gap-2">
              {SEVERITIES.map(s => (
                <button key={s.id}
                  onClick={() => setSeverity(s.id)}
                  className={`py-2.5 rounded-xl border text-sm font-semibold transition-all ${
                    severity === s.id ? 'text-white' : 'border-white/5 text-gray-400 hover:bg-white/5'
                  }`}
                  style={severity === s.id ? { borderColor: s.color + '50', backgroundColor: s.color + '20', color: s.color } : {}}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Run button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleRun}
            disabled={running}
            className="w-full py-3.5 rounded-xl font-bold text-white text-sm flex items-center justify-center gap-2 disabled:opacity-60"
            style={{ background: `linear-gradient(135deg, ${selectedScenario?.color}, ${selectedScenario?.color}cc)` }}
          >
            {running ? (
              <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Running Simulation...</>
            ) : (
              <><Play size={16} />Run Simulation</>
            )}
          </motion.button>
        </div>

        {/* Results panel */}
        <div className="lg:col-span-2 space-y-4">
          {running && (
            <div className="glass-card">
              <AIThinking active />
            </div>
          )}

          {!result && !running && (
            <div className="glass-card flex flex-col items-center justify-center h-64 text-center">
              <Activity size={36} className="text-gray-600 mb-3" />
              <p className="text-gray-400 font-medium mb-1">Select a scenario and severity</p>
              <p className="text-sm text-gray-500">Then click Run Simulation to model disaster impacts</p>
            </div>
          )}

          {result && !running && (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                {/* KPI cards */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    { label: 'Affected Population', value: result.simulated?.affectedPopulation?.toLocaleString(), icon: Users, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
                    { label: 'Critical Zones', value: result.simulated?.criticalZones, icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10 border-orange-500/20' },
                    { label: 'Relocation Demand', value: result.simulated?.relocationDemand?.toLocaleString(), icon: TrendingUp, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
                    { label: 'Safe Capacity', value: result.simulated?.safeCapacity?.toLocaleString(), icon: Shield, color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/20' },
                    { label: 'Capacity Gap', value: result.simulated?.capacityGap > 0 ? result.simulated?.capacityGap?.toLocaleString() : 'None', icon: Zap, color: result.simulated?.capacityGap > 0 ? 'text-red-400' : 'text-green-400', bg: result.simulated?.capacityGap > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-green-500/10 border-green-500/20' },
                    { label: 'Infra Stress', value: `${result.simulated?.infrastructureStress}%`, icon: Activity, color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/20' },
                  ].map(({ label, value, icon: Icon, color, bg }) => (
                    <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                      className={`p-3.5 rounded-xl border ${bg}`}>
                      <div className="flex items-center gap-2 mb-1.5">
                        <Icon size={14} className={color} />
                        <span className="text-xs text-gray-400">{label}</span>
                      </div>
                      <p className={`text-xl font-bold ${color}`}>{value}</p>
                    </motion.div>
                  ))}
                </div>

                {/* Before/After chart */}
                <div className="glass-card">
                  <h3 className="text-sm font-semibold text-gray-200 mb-3">Before vs After Simulation</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} barGap={4}>
                        <XAxis dataKey="label" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false}
                          tickFormatter={v => v >= 1000 ? (v / 1000).toFixed(0) + 'K' : v} />
                        <Tooltip contentStyle={{ background: '#0f2040', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                        <Bar dataKey="before" name="Baseline" fill="#3b82f680" radius={[4, 4, 0, 0]} barSize={24} />
                        <Bar dataKey="after" name="Simulated" fill={selectedScenario?.color + 'cc'} radius={[4, 4, 0, 0]} barSize={24} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex gap-4 mt-2 text-xs">
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-blue-500/50" /><span className="text-gray-400">Baseline</span></div>
                    <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded" style={{ background: selectedScenario?.color + 'cc' }} /><span className="text-gray-400">Simulated</span></div>
                  </div>
                </div>

                {/* Capacity status */}
                {result.simulated?.capacityGap > 0 && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    className="flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/25">
                    <AlertTriangle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-red-300">Capacity Shortfall Detected</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Shelter demand exceeds available capacity by {result.simulated.capacityGap?.toLocaleString()} people.
                        Additional temporary shelters or mutual-aid resources required.
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* AI Plan */}
                {aiPlan?.plan && (
                  <div className="glass-card">
                    <div className="flex items-center gap-2 mb-3">
                      <Zap size={15} className="text-orange-400" />
                      <h3 className="text-sm font-semibold text-gray-200">AI Emergency Action Plan</h3>
                      {aiPlan.confidence && <span className="ml-auto text-xs text-gray-500">{aiPlan.confidence}% confidence</span>}
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">{aiPlan.plan}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
};

export default Simulation;
