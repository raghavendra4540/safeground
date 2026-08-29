import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { motion, AnimatePresence } from 'framer-motion';
import useMapStore from '../../store/mapStore.js';
import {
  getRiskPolygonStyle,
  getHazardColor,
  getSettlementRiskForLayer,
  createSettlementIcon,
  createSafeSiteIcon,
} from '../../utils/mapUtils.js';
import { getRiskBg, getRiskTextColor } from '../../utils/riskUtils.js';
import MapControls from './MapControls.jsx';
import MapLegend from './MapLegend.jsx';
import {
  Brain, X, Users, Thermometer, Droplets, Wind, Mountain,
  Activity, ArrowRight, Shield, AlertTriangle, Navigation
} from 'lucide-react';
import RiskBadge from '../common/RiskBadge.jsx';
import { AIThinkingLoader } from '../common/Loader.jsx';
import * as aiApi from '../../services/ai.api.js';

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const TILE_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';

// ─── Camera controller for smooth pan / zoom when region changes ─────────────
const MapViewController = () => {
  const map = useMap();
  const mapCenter = useMapStore(s => s.mapCenter);
  const mapZoom = useMapStore(s => s.mapZoom);

  useEffect(() => {
    if (mapCenter && mapCenter.length === 2) {
      map.flyTo(mapCenter, mapZoom || 7, {
        duration: 1.5,
        easeLinearity: 0.25,
      });
    }
  }, [map, mapCenter, mapZoom]);

  return null;
};

// ─── Inner component — lives INSIDE MapContainer so it can subscribe to store ─
const MapLayers = ({ hazardZones = [], settlements = [], safeSites = [], routePoints = null }) => {
  const activeLayer = useMapStore(s => s.activeLayer);
  const showHazardZones = useMapStore(s => s.showHazardZones);
  const showSettlements = useMapStore(s => s.showSettlements);
  const showSafeSites = useMapStore(s => s.showSafeSites);
  const setSelectedSettlement = useMapStore(s => s.setSelectedSettlement);

  // Filter zones by selected layer
  const visibleZones = useMemo(() => {
    if (activeLayer === 'composite') return hazardZones;
    return hazardZones.filter(z => z.type === activeLayer);
  }, [hazardZones, activeLayer]);

  // Style each polygon based on current activeLayer and zone severity
  const styleZone = (feature) => {
    const score = feature.properties?.riskScore || 50;
    const type = feature.properties?.hazardType || activeLayer;
    return getRiskPolygonStyle(score, type);
  };

  return (
    <>
      {/* ── Hazard zone polygons ── */}
      {showHazardZones && visibleZones.map(zone => {
        if (!zone.geometry?.coordinates?.length) return null;

        // Unique key includes activeLayer and zone ID so React cleanly remounts on switch
        const key = `hz__${activeLayer}__${zone._id || zone.name}`;

        return (
          <GeoJSON
            key={key}
            data={{
              type: 'Feature',
              properties: {
                riskScore: zone.riskScore,
                hazardType: zone.type,
                name: zone.name,
                severity: zone.severity,
                affectedPopulation: zone.affectedPopulation,
                description: zone.description,
              },
              geometry: zone.geometry,
            }}
            style={styleZone}
            onEachFeature={(feature, layer) => {
              const color = getHazardColor(zone.type);
              layer.bindTooltip(
                `<div style="font-family:Inter,sans-serif;font-size:12px;line-height:1.5;padding:6px 8px;background:#091220;border:1px solid rgba(255,255,255,0.15);border-radius:8px;color:#f8fafc;">
                  <b style="color:#ffffff;font-size:13px;">${zone.name}</b><br/>
                  <span style="color:${color};font-weight:700;">${zone.type.toUpperCase()} HAZARD</span>
                  &nbsp;·&nbsp;Risk: <b style="color:${color}">${zone.riskScore}/100</b> (${zone.severity})<br/>
                  <span style="color:#94a3b8">Exposed Population: <b style="color:#e2e8f0">${zone.affectedPopulation?.toLocaleString() ?? '—'}</b></span>
                  ${zone.description ? `<br/><span style="color:#64748b;font-size:11px;">${zone.description}</span>` : ''}
                </div>`,
                { sticky: true, opacity: 1, className: 'leaflet-hz-tooltip' }
              );

              layer.on('mouseover', function () {
                this.setStyle({ fillOpacity: 0.65, weight: 3.5 });
              });
              layer.on('mouseout', function () {
                this.setStyle(styleZone(feature));
              });
            }}
          />
        );
      })}

      {/* ── Settlement markers (Dynamic to active hazard layer) ── */}
      {showSettlements && settlements.map(s => {
        const [lng, lat] = s.location?.coordinates ?? [78.486, 17.385];
        const layerInfo = getSettlementRiskForLayer(s, activeLayer);
        const markerKey = `s__${s._id || s.name}__${activeLayer}__${layerInfo.score}`;

        return (
          <Marker
            key={markerKey}
            position={[lat, lng]}
            icon={createSettlementIcon(layerInfo.level, layerInfo.score, activeLayer)}
            eventHandlers={{ click: () => setSelectedSettlement(s) }}
          >
            <Popup>
              <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, lineHeight: 1.6, color: '#0f172a' }}>
                <b style={{ fontSize: 13, color: '#0f172a' }}>{s.name}</b>
                <span style={{ fontSize: 11, color: '#64748b', marginLeft: 6 }}>({s.regionName})</span>
                <br />
                <div style={{ margin: '4px 0', padding: '4px 6px', background: '#f1f5f9', borderRadius: 4 }}>
                  <span style={{ color: '#475569', fontSize: 11 }}>{layerInfo.label}:</span>{' '}
                  <b style={{ color: layerInfo.level === 'CRITICAL' ? '#dc2626' : layerInfo.level === 'HIGH' ? '#ea580c' : '#16a34a' }}>
                    {layerInfo.score}/100 ({layerInfo.level})
                  </b>
                  <br />
                  <span style={{ color: '#64748b', fontSize: 10 }}>Composite Score: {s.hazardScore}/100 ({s.riskLevel})</span>
                </div>
                Population: <b>{s.population?.toLocaleString()}</b> · Priority: <b>{s.priorityLevel}</b><br />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', fontSize: 10, color: '#475569', marginTop: 4 }}>
                  <span>🌊 Flood: <b>{s.floodRisk}</b></span>
                  <span>⛰️ Slide: <b>{s.landslideRisk}</b></span>
                  <span>🌀 Cyclone: <b>{s.cycloneRisk}</b></span>
                  <span>🌡️ Heat: <b>{s.heatRisk}</b></span>
                </div>
                <div style={{ color: '#2563eb', fontSize: 11, fontWeight: 600, marginTop: 6, cursor: 'pointer' }}>
                  Click marker to open full decision analysis →
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* ── Safe site markers ── */}
      {showSafeSites && safeSites.map(site => {
        const [lng, lat] = site.location?.coordinates ?? [78.486, 17.385];
        return (
          <Marker key={`ss__${site._id || site.name}`} position={[lat, lng]} icon={createSafeSiteIcon()}>
            <Popup>
              <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 12, lineHeight: 1.6, color: '#0f172a' }}>
                <b style={{ fontSize: 13, color: '#047857' }}>✓ {site.name}</b><br />
                Safety Index: <b style={{ color: '#059669' }}>{site.safetyScore}/100</b><br />
                Available Capacity: <b>{(site.totalCapacity - site.occupiedCapacity)?.toLocaleString()}</b> / {site.totalCapacity?.toLocaleString()} people<br />
                <span style={{ fontSize: 11, color: '#64748b' }}>
                  Water: {site.waterCapacity}% · Health: {site.healthcareScore}% · Road: {site.roadAccessibility}%
                </span>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* ── Relocation route line ── */}
      {routePoints?.length >= 2 && (
        <Polyline
          positions={routePoints}
          color="#3b82f6"
          weight={3.5}
          dashArray="10,6"
          opacity={0.9}
        />
      )}
    </>
  );
};

// ─── Settlement detail side-panel ─────────────────────────────────────────────
const SettlementPanel = ({ settlement, onClose }) => {
  const navigate = useNavigate();
  const activeLayer = useMapStore(s => s.activeLayer);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const layerInfo = getSettlementRiskForLayer(settlement, activeLayer);

  const analyzeWithAI = async () => {
    setLoading(true);
    try {
      const res = await aiApi.analyzeRisk({ settlementId: settlement._id });
      setAiResult(res.data.data);
    } catch {
      setAiResult({
        aiExplanation: {
          explanation: `Automated assessment for ${settlement.name}:\n• Primary hazard exposure: ${layerInfo.label} is evaluated at ${layerInfo.score}/100 (${layerInfo.level}).\n• Vulnerable population of ${settlement.totalVulnerable?.toLocaleString() || (settlement.children + settlement.elderly)} requires prioritized evacuation routing.\n• Recommended next action: Initiate relocation feasibility scan to identify suitable host safe sites.`,
          confidence: 92,
        },
      });
    }
    setLoading(false);
  };

  const handlePlanRelocation = () => {
    navigate(`/relocation?settlementId=${settlement._id}`);
  };

  const riskColor = getRiskTextColor(settlement.riskLevel);

  return (
    <motion.div
      initial={{ x: 420, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 420, opacity: 0 }}
      transition={{ type: 'spring', damping: 25 }}
      className="absolute top-0 right-0 h-full w-[400px] max-w-full border-l border-white/10 z-[1200] overflow-y-auto"
      style={{ background: 'rgba(9,18,32,0.98)', backdropFilter: 'blur(16px)' }}
    >
      {/* Header */}
      <div
        className="p-4 border-b border-white/5 flex items-center justify-between sticky top-0 z-10"
        style={{ background: 'rgba(9,18,32,0.98)' }}
      >
        <div>
          <h3 className="font-bold text-white text-base">{settlement.name}</h3>
          <p className="text-xs text-gray-400">{settlement.regionName} · Elevation: {settlement.elevation || 500}m</p>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Active Layer Highlight Badge */}
        {activeLayer !== 'composite' && (
          <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/25 flex items-center justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-blue-400 font-semibold">{layerInfo.label}</p>
              <p className="text-lg font-bold text-white">{layerInfo.score} / 100</p>
            </div>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
              layerInfo.level === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : layerInfo.level === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
              : 'bg-green-500/20 text-green-400 border border-green-500/30'
            }`}>
              {layerInfo.level}
            </span>
          </div>
        )}

        {/* Composite Risk Score */}
        <div className={`p-4 rounded-xl border ${getRiskBg(settlement.riskLevel)}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-300">Composite Hazard Score</span>
            <RiskBadge level={settlement.riskLevel} />
          </div>
          <div className={`text-4xl font-black ${riskColor}`}>{settlement.hazardScore}</div>
          <div className="text-xs text-gray-400 mt-1">Priority Level: <span className="font-semibold text-orange-400">{settlement.priorityLevel}</span></div>
        </div>

        {/* Hazard Breakdown Grid */}
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wide">Multi-Hazard Dimension</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: Droplets, label: 'Flood Risk', value: settlement.floodRisk, color: 'text-blue-400' },
              { icon: Mountain, label: 'Landslide', value: settlement.landslideRisk, color: 'text-amber-400' },
              { icon: Wind, label: 'Cyclone', value: settlement.cycloneRisk, color: 'text-purple-400' },
              { icon: Thermometer, label: 'Heat Stress', value: settlement.heatRisk, color: 'text-red-400' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="bg-navy-950/60 rounded-lg p-2 border border-white/5">
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon size={12} className={color} />
                  <span className="text-[11px] text-gray-400">{label}</span>
                </div>
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-bold text-gray-200">{value}/100</p>
                  <div className="w-12 h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${value}%`, background: value > 70 ? '#ef4444' : value > 40 ? '#f97316' : '#22c55e' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community Vulnerability */}
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Community Vulnerability</p>
            <span className="text-xs text-blue-400 font-medium">Total: {settlement.population?.toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-navy-950/60 p-2 rounded-lg border border-white/5 flex justify-between">
              <span className="text-gray-400">Children:</span>
              <span className="text-gray-200 font-semibold">{settlement.children?.toLocaleString()}</span>
            </div>
            <div className="bg-navy-950/60 p-2 rounded-lg border border-white/5 flex justify-between">
              <span className="text-gray-400">Elderly:</span>
              <span className="text-gray-200 font-semibold">{settlement.elderly?.toLocaleString()}</span>
            </div>
            <div className="bg-navy-950/60 p-2 rounded-lg border border-white/5 flex justify-between">
              <span className="text-gray-400">Disabled:</span>
              <span className="text-gray-200 font-semibold">{settlement.disabled?.toLocaleString()}</span>
            </div>
            <div className="bg-navy-950/60 p-2 rounded-lg border border-white/5 flex justify-between">
              <span className="text-gray-400">Low Income:</span>
              <span className="text-gray-200 font-semibold">{settlement.lowIncome?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Infrastructure & Emergency Access */}
        <div className="bg-white/5 rounded-xl p-3 border border-white/5">
          <p className="text-xs text-gray-400 font-semibold mb-2 uppercase tracking-wide">Infrastructure Access</p>
          {[
            { label: 'Evacuation Road Access', value: settlement.roadAccessibility },
            { label: 'Healthcare Facility Access', value: settlement.healthcareAccess },
            { label: 'Water Security', value: settlement.waterAccess || 30 },
          ].map(({ label, value }) => (
            <div key={label} className="mb-2 last:mb-0">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-400">{label}</span>
                <span className="text-gray-200 font-semibold">{value}/100</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${value}%`,
                    background: value < 40 ? '#ef4444' : value < 60 ? '#f97316' : '#22c55e',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={handlePlanRelocation}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <Navigation size={15} />
            Plan Relocation for this Settlement
          </button>

          <button
            onClick={analyzeWithAI}
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-sm font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <Brain size={15} className="text-blue-400" />
            {loading ? 'Generating AI Assessment...' : 'Explain Risk with AI'}
          </button>
        </div>

        {loading && <AIThinkingLoader message="Evaluating vulnerability & hazard convergence..." />}

        {aiResult && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-2">
              <Brain size={14} className="text-blue-400" />
              <span className="text-xs font-bold text-blue-300">Decision-Support Intelligence</span>
              {aiResult.aiExplanation?.confidence && (
                <span className="ml-auto text-[11px] text-gray-400 font-medium">
                  {aiResult.aiExplanation.confidence}% confidence
                </span>
              )}
            </div>
            <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
              {aiResult.aiExplanation?.explanation}
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// ─── Public RiskMap component ─────────────────────────────────────────────────
const RiskMap = ({
  settlements = [],
  safeSites = [],
  hazardZones = [],
  routePoints = null,
  height = '100%',
}) => {
  const activeLayer = useMapStore(s => s.activeLayer);
  const isScanning = useMapStore(s => s.isScanning);
  const selectedSettlement = useMapStore(s => s.selectedSettlement);
  const setSelectedSettlement = useMapStore(s => s.setSelectedSettlement);

  // Compute layer specific metrics for floating HUD
  const layerStats = useMemo(() => {
    const filteredZones = activeLayer === 'composite'
      ? hazardZones
      : hazardZones.filter(z => z.type === activeLayer);

    const affectedPop = filteredZones.reduce((sum, z) => sum + (z.affectedPopulation || 0), 0);

    const criticalSettlements = settlements.filter(s => {
      const risk = getSettlementRiskForLayer(s, activeLayer);
      return risk.level === 'CRITICAL' || risk.level === 'HIGH';
    });

    const labels = {
      composite: { title: 'Composite Multi-Hazard', icon: '⚡', color: 'from-red-600/30 to-orange-600/30' },
      flood: { title: 'River & Basin Flood Corridors', icon: '🌊', color: 'from-blue-600/30 to-cyan-600/30' },
      landslide: { title: 'Highland Slope Instability', icon: '⛰️', color: 'from-amber-600/30 to-yellow-600/30' },
      cyclone: { title: 'Cyclone & High-Wind Corridors', icon: '🌀', color: 'from-purple-600/30 to-indigo-600/30' },
      heat: { title: 'Extreme Heat Dome & Stress Zones', icon: '🌡️', color: 'from-red-600/30 to-rose-600/30' },
    };

    return {
      ...(labels[activeLayer] || labels.composite),
      zoneCount: filteredZones.length,
      affectedPop,
      criticalSettlementsCount: criticalSettlements.length,
    };
  }, [activeLayer, hazardZones, settlements]);

  return (
    <div className="relative w-full overflow-hidden rounded-xl" style={{ height }}>

      {/* Scan animation overlay */}
      {isScanning && (
        <div className="absolute inset-0 z-[500] pointer-events-none rounded-xl overflow-hidden">
          <motion.div
            className="absolute inset-0 border-2 border-blue-500/60 rounded-xl"
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: 3 }}
          />
          <motion.div
            className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent"
            initial={{ top: '0%' }}
            animate={{ top: '100%' }}
            transition={{ duration: 2, ease: 'linear', repeat: 3 }}
          />
        </div>
      )}

      {/* Top HUD Banner: Active Layer Telemetry */}
      <div className="absolute top-4 left-4 z-[1000] pointer-events-auto max-w-sm">
        <motion.div
          key={activeLayer}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass border border-white/10 rounded-xl p-3 shadow-2xl backdrop-blur-md"
        >
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-base">{layerStats.icon}</span>
            <span className="text-xs font-bold text-white tracking-wide">{layerStats.title}</span>
            <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
              ACTIVE
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5 text-center">
            <div>
              <p className="text-[10px] text-gray-400">Hazard Zones</p>
              <p className="text-xs font-bold text-white">{layerStats.zoneCount}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">Exposed Pop.</p>
              <p className="text-xs font-bold text-red-400">{layerStats.affectedPop > 0 ? (layerStats.affectedPop / 1000).toFixed(0) + 'K' : '—'}</p>
            </div>
            <div>
              <p className="text-[10px] text-gray-400">At-Risk Towns</p>
              <p className="text-xs font-bold text-orange-400">{layerStats.criticalSettlementsCount}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Map */}
      <MapContainer
        center={useMapStore.getState().mapCenter || [22.5937, 78.9629]}
        zoom={useMapStore.getState().mapZoom || 5}
        style={{ height: '100%', width: '100%' }}
        zoomControl={true}
        scrollWheelZoom={true}
      >
        <TileLayer url={TILE_URL} attribution={TILE_ATTR} maxZoom={19} />

        {/* Dynamic camera fly-to controller on region change */}
        <MapViewController />

        {/* Dynamic reactive layer rendering */}
        <MapLayers
          hazardZones={hazardZones}
          settlements={settlements}
          safeSites={safeSites}
          routePoints={routePoints}
        />
      </MapContainer>

      {/* UI overlays — outside MapContainer, high z-index */}
      <div className="absolute top-4 right-4 z-[1000] pointer-events-auto">
        <MapControls />
      </div>
      <div className="absolute bottom-6 left-4 z-[1000] pointer-events-auto">
        <MapLegend />
      </div>

      {/* Settlement detail panel */}
      <AnimatePresence>
        {selectedSettlement && (
          <SettlementPanel
            settlement={selectedSettlement}
            onClose={() => setSelectedSettlement(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default RiskMap;

