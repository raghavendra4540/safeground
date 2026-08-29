import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import RiskMap from '../components/map/RiskMap.jsx';
import { PageLoader } from '../components/common/Loader.jsx';
import { getSettlements } from '../services/settlement.api.js';
import { getSafeSites } from '../services/safeSite.api.js';
import { getHazards } from '../services/hazard.api.js';
import useDashboardStore from '../store/dashboardStore.js';
import { Map, Info, Globe } from 'lucide-react';

const RiskMapPage = () => {
  const selectedRegion = useDashboardStore(s => s.selectedRegion);
  const [data, setData] = useState({ settlements: [], safeSites: [], hazardZones: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const regionParam = selectedRegion === 'All India' ? {} : { region: selectedRegion };
        const [s, ss, h] = await Promise.all([
          getSettlements({ limit: 120, ...regionParam }),
          getSafeSites(regionParam),
          getHazards(regionParam),
        ]);
        setData({
          settlements: s.data.data,
          safeSites: ss.data.data,
          hazardZones: h.data.data,
        });
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };
    load();
  }, [selectedRegion]);

  if (loading) return <PageLoader />;

  return (
    <div className="flex flex-col h-full">
      {/* Header bar */}
      <div className="px-6 py-3 border-b border-white/5 flex items-center gap-3 bg-navy-900/50">
        <Map size={16} className="text-blue-400" />
        <span className="text-sm font-medium text-gray-200">Interactive Risk Map</span>
        <span className="text-xs text-gray-500">·</span>
        <span className="text-xs text-gray-400">
          {data.settlements.length} settlements · {data.safeSites.length} safe sites · {data.hazardZones.length} hazard zones
        </span>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-gray-400">
          <Info size={12} />
          <span>Click a settlement marker to analyze</span>
        </div>
      </div>

      {/* Full-height map */}
      <div className="flex-1 p-4">
        <RiskMap
          settlements={data.settlements}
          safeSites={data.safeSites}
          hazardZones={data.hazardZones}
          height="100%"
        />
      </div>
    </div>
  );
};

export default RiskMapPage;
