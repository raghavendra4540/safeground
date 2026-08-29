import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Users, Shield, Navigation, Activity, Scan, RefreshCw } from 'lucide-react';
import KPICard from '../components/dashboard/KPIcard.jsx';
import RiskOverview from '../components/dashboard/RiskOverview.jsx';
import HazardBreakdown from '../components/dashboard/HazardBreakdown.jsx';
import CriticalZones from '../components/dashboard/CriticalZones.jsx';
import PopulationRiskChart from '../components/dashboard/PopulationRiskChart.jsx';
import { PageLoader } from '../components/common/Loader.jsx';
import useDashboardStore from '../store/dashboardStore.js';
import useMapStore from '../store/mapStore.js';

const Dashboard = () => {
  const { overview, riskSummary, loading, fetchOverview, lastFetched, selectedRegion } = useDashboardStore();
  const { setScanning } = useMapStore();
  const [scanning, setLocalScanning] = useState(false);

  useEffect(() => {
    fetchOverview();
  }, [selectedRegion]);

  const runRegionalScan = async () => {
    setLocalScanning(true);
    setScanning(true);
    await fetchOverview();
    setTimeout(() => {
      setLocalScanning(false);
      setScanning(false);
    }, 2500);
  };

  if (loading && !overview) return <PageLoader />;

  const kpis = overview?.kpis || {};

  return (
    <div className="p-6 space-y-6">
      {/* Hero header */}
      <div className="flex items-start justify-between">
        <div>
          <motion.h1 initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-bold text-white mb-1 flex items-center gap-2">
            Disaster Intelligence Overview
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
              {selectedRegion || 'All India'}
            </span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
            className="text-gray-400 text-sm">
            Real-time multi-hazard assessment and proactive relocation intelligence across {selectedRegion || 'All India'}
          </motion.p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => fetchOverview()}
            className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white text-sm border border-white/10 transition-colors">
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <motion.button
            onClick={runRegionalScan}
            disabled={scanning}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-sm font-semibold disabled:opacity-60 transition-all shadow-glow"
          >
            <Scan size={15} className={scanning ? 'animate-spin' : ''} />
            {scanning ? `Scanning ${selectedRegion}...` : `Run Scan for ${selectedRegion}`}
          </motion.button>
        </div>
      </div>

      {/* Scanning overlay banner */}
      {scanning && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30"
        >
          <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-sm text-blue-300 font-medium">
            Regional GIS scan active for {selectedRegion} — analyzing {kpis.totalSettlements || 0} settlements, {kpis.totalSafeSites || 0} safe sites, {kpis.totalHazardZones || 0} hazard zones...
          </span>
        </motion.div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KPICard title="Critical Zones" value={kpis.criticalZones ?? 0} icon={AlertTriangle} color="red" delay={0} trendLabel={`Across ${kpis.totalHazardZones ?? 0} hazard polygons`} />
        <KPICard title="High-Risk Settlements" value={kpis.highRiskSettlements ?? 0} icon={Activity} color="orange" delay={0.05} trendLabel={`Of ${kpis.totalSettlements ?? 0} monitored towns`} />
        <KPICard title="Population at Risk" value={kpis.populationAtRisk ?? 0} icon={Users} color="purple" delay={0.1} trendLabel="In high/critical zones" />
        <KPICard title="Relocation Candidates" value={kpis.relocationCandidates ?? 0} icon={Navigation} color="blue" delay={0.15} trendLabel="Urgent priority relocation" />
        <KPICard title="Safe Capacity Available" value={kpis.totalSafeCapacity ?? 0} icon={Shield} color="green" delay={0.2} trendLabel={`Across ${kpis.totalSafeSites ?? 0} safe host sites`} />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <RiskOverview data={overview?.riskDistribution} />
        </div>
        <div className="lg:col-span-1">
          <HazardBreakdown data={overview?.hazardTypeBreakdown} />
        </div>
        <div className="lg:col-span-2">
          <PopulationRiskChart data={riskSummary} />
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <CriticalZones settlements={overview?.topCriticalSettlements || []} />

        {/* AI Status card */}
        <div className="glass-card">
          <h3 className="text-sm font-semibold text-gray-200 mb-4">System Intelligence Status</h3>
          <div className="space-y-3">
            {[
              { label: 'AI Risk Engine', status: 'ONLINE', color: 'text-green-400', dot: 'bg-green-400' },
              { label: 'GIS Hazard Layers', status: 'ACTIVE', color: 'text-green-400', dot: 'bg-green-400' },
              { label: 'Relocation Optimizer', status: 'READY', color: 'text-blue-400', dot: 'bg-blue-400' },
              { label: 'Transport Estimator', status: 'READY', color: 'text-blue-400', dot: 'bg-blue-400' },
              { label: 'Early Warning System', status: 'MONITORING', color: 'text-yellow-400', dot: 'bg-yellow-400' },
            ].map(({ label, status, color, dot }) => (
              <div key={label} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                <span className="text-sm text-gray-300">{label}</span>
                <div className="flex items-center gap-2">
                  <div className={`w-1.5 h-1.5 rounded-full animate-pulse ${dot}`} />
                  <span className={`text-xs font-medium ${color}`}>{status}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 p-3 rounded-lg bg-white/3 border border-white/5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-400">Last Analysis</span>
              <span className="text-gray-200">{lastFetched ? new Date(lastFetched).toLocaleTimeString() : '—'}</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-gray-400">Confidence</span>
              <span className="text-blue-400 font-semibold">{overview?.recentActivity?.analysisConfidence || 94}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
