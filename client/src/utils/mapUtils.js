import L from 'leaflet';

export const getLevelFromScore = (score) => {
  if (score >= 76) return 'CRITICAL';
  if (score >= 51) return 'HIGH';
  if (score >= 26) return 'MODERATE';
  return 'SAFE';
};

export const getSettlementRiskForLayer = (settlement, activeLayer = 'composite') => {
  if (!settlement) return { score: 0, level: 'SAFE', label: 'Overall Risk' };

  let score = settlement.hazardScore ?? 50;
  let label = 'Composite Risk';

  switch (activeLayer) {
    case 'flood':
      score = settlement.floodRisk ?? 0;
      label = 'Flood Risk';
      break;
    case 'landslide':
      score = settlement.landslideRisk ?? 0;
      label = 'Landslide Risk';
      break;
    case 'cyclone':
      score = settlement.cycloneRisk ?? 0;
      label = 'Cyclone Risk';
      break;
    case 'heat':
      score = settlement.heatRisk ?? 0;
      label = 'Extreme Heat Risk';
      break;
    case 'composite':
    default:
      score = settlement.hazardScore ?? 50;
      label = 'Composite Risk';
      break;
  }

  const level = getLevelFromScore(score);
  return { score, level, label };
};

export const getRiskPolygonStyle = (riskScore, layerType = 'composite') => {
  if (layerType === 'flood') {
    if (riskScore >= 76) return { color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.45, weight: 2.5 };
    if (riskScore >= 51) return { color: '#3b82f6', fillColor: '#60a5fa', fillOpacity: 0.35, weight: 2 };
    return { color: '#60a5fa', fillColor: '#93c5fd', fillOpacity: 0.25, weight: 1.5 };
  }
  if (layerType === 'landslide') {
    if (riskScore >= 76) return { color: '#b45309', fillColor: '#d97706', fillOpacity: 0.45, weight: 2.5 };
    if (riskScore >= 51) return { color: '#d97706', fillColor: '#f59e0b', fillOpacity: 0.35, weight: 2 };
    return { color: '#f59e0b', fillColor: '#fcd34d', fillOpacity: 0.25, weight: 1.5 };
  }
  if (layerType === 'cyclone') {
    if (riskScore >= 76) return { color: '#6d28d9', fillColor: '#8b5cf6', fillOpacity: 0.45, weight: 2.5 };
    if (riskScore >= 51) return { color: '#8b5cf6', fillColor: '#a78bfa', fillOpacity: 0.35, weight: 2 };
    return { color: '#a78bfa', fillColor: '#c4b5fd', fillOpacity: 0.25, weight: 1.5 };
  }
  if (layerType === 'heat') {
    if (riskScore >= 76) return { color: '#b91c1c', fillColor: '#ef4444', fillOpacity: 0.45, weight: 2.5 };
    if (riskScore >= 51) return { color: '#ef4444', fillColor: '#f87171', fillOpacity: 0.35, weight: 2 };
    return { color: '#f87171', fillColor: '#fca5a5', fillOpacity: 0.25, weight: 1.5 };
  }

  // Composite multi-hazard
  if (riskScore >= 76) return { color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.35, weight: 2.5 };
  if (riskScore >= 51) return { color: '#f97316', fillColor: '#f97316', fillOpacity: 0.3, weight: 2 };
  if (riskScore >= 26) return { color: '#eab308', fillColor: '#eab308', fillOpacity: 0.22, weight: 1.5 };
  return { color: '#22c55e', fillColor: '#22c55e', fillOpacity: 0.18, weight: 1.5 };
};

export const getHazardColor = (type) => {
  const map = {
    composite: '#ef4444',
    flood: '#3b82f6',
    landslide: '#d97706',
    cyclone: '#8b5cf6',
    heat: '#ef4444',
  };
  return map[type] || '#3b82f6';
};

export const createSettlementIcon = (riskLevel, score = 50, activeLayer = 'composite') => {
  let color = '#22c55e';
  if (riskLevel === 'CRITICAL') color = '#ef4444';
  else if (riskLevel === 'HIGH') color = '#f97316';
  else if (riskLevel === 'MODERATE') color = '#eab308';

  // Customize glow / color accent if a specific hazard layer is active
  if (activeLayer === 'flood' && score >= 50) color = score >= 75 ? '#2563eb' : '#3b82f6';
  if (activeLayer === 'landslide' && score >= 50) color = score >= 75 ? '#b45309' : '#d97706';
  if (activeLayer === 'cyclone' && score >= 50) color = score >= 75 ? '#7c3aed' : '#8b5cf6';
  if (activeLayer === 'heat' && score >= 50) color = score >= 75 ? '#dc2626' : '#ef4444';

  const isHighDanger = score >= 75 || riskLevel === 'CRITICAL';
  const size = isHighDanger ? 22 : 18;
  const pulseClass = isHighDanger ? 'marker-pulse' : '';

  return L.divIcon({
    className: 'safe-settlement-marker',
    html: `<div style="
      width:${size}px;
      height:${size}px;
      border-radius:50%;
      background:${color};
      border:2px solid #ffffff;
      box-shadow:0 0 10px ${color}cc;
      display:flex;
      align-items:center;
      justify-content:center;
      cursor:pointer;
      transition:transform 0.2s;
    " class="${pulseClass}">
      <span style="font-size:9px;font-weight:800;color:#ffffff;line-height:1;text-shadow:0 1px 2px rgba(0,0,0,0.8);">${score}</span>
    </div>`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
};

export const createSafeSiteIcon = () => L.divIcon({
  className: 'safe-site-marker',
  html: `<div style="
    width:22px;
    height:22px;
    border-radius:6px;
    background:#10b981;
    border:2px solid #ffffff;
    box-shadow:0 0 12px rgba(16,185,129,0.8);
    display:flex;
    align-items:center;
    justify-content:center;
    font-size:11px;
    color:#ffffff;
    font-weight:900;
    cursor:pointer;
  ">✓</div>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
});
