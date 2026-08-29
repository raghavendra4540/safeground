// Demo hazard zones (GeoJSON polygons) around Telangana
// These are fictional demo zones for hackathon purposes

const makePolygon = (centerLng, centerLat, radiusDeg, sides = 6) => {
  const coords = [];
  for (let i = 0; i <= sides; i++) {
    const angle = (i / sides) * 2 * Math.PI;
    const variance = 0.7 + Math.random() * 0.6;
    coords.push([
      centerLng + radiusDeg * Math.cos(angle) * variance,
      centerLat + radiusDeg * Math.sin(angle) * variance * 0.7,
    ]);
  }
  coords.push(coords[0]); // close polygon
  return [coords];
};

export const hazardZonesData = [
  // FLOOD ZONES
  {
    name: 'Krishna River Flood Corridor',
    type: 'flood',
    severity: 'CRITICAL',
    riskScore: 92,
    regionName: 'Telangana',
    geometry: { type: 'Polygon', coordinates: makePolygon(79.262, 17.058, 0.18) },
    affectedPopulation: 28400,
    description: 'Perennial flood zone along Krishna river tributaries',
  },
  {
    name: 'Musi Floodplain Zone',
    type: 'flood',
    severity: 'CRITICAL',
    riskScore: 88,
    regionName: 'Telangana',
    geometry: { type: 'Polygon', coordinates: makePolygon(78.312, 17.445, 0.14) },
    affectedPopulation: 18600,
    description: 'High-risk flood zone along Musi river basin',
  },
  {
    name: 'Godavari Overflow Zone',
    type: 'flood',
    severity: 'CRITICAL',
    riskScore: 95,
    regionName: 'Telangana',
    geometry: { type: 'Polygon', coordinates: makePolygon(80.894, 17.669, 0.22) },
    affectedPopulation: 42000,
    description: 'Extreme flood risk zone during Godavari monsoon overflow',
  },
  {
    name: 'Khammam Lowland Flood',
    type: 'flood',
    severity: 'CRITICAL',
    riskScore: 86,
    regionName: 'Telangana',
    geometry: { type: 'Polygon', coordinates: makePolygon(80.152, 17.248, 0.16) },
    affectedPopulation: 31200,
    description: 'Seasonal flooding from Kinnerasani river',
  },
  {
    name: 'Suryapet Flood Basin',
    type: 'flood',
    severity: 'HIGH',
    riskScore: 78,
    regionName: 'Telangana',
    geometry: { type: 'Polygon', coordinates: makePolygon(79.612, 17.142, 0.12) },
    affectedPopulation: 15800,
    description: 'Flood-prone lowland basin near Suryapet',
  },

  // LANDSLIDE ZONES
  {
    name: 'Adilabad Highland Slide Zone',
    type: 'landslide',
    severity: 'HIGH',
    riskScore: 82,
    regionName: 'Telangana',
    geometry: { type: 'Polygon', coordinates: makePolygon(78.532, 19.664, 0.15) },
    affectedPopulation: 6800,
    description: 'Tribal highland area with high landslide risk during monsoon',
  },
  {
    name: 'Mancherial Gorge Slide Area',
    type: 'landslide',
    severity: 'HIGH',
    riskScore: 78,
    regionName: 'Telangana',
    geometry: { type: 'Polygon', coordinates: makePolygon(79.444, 18.872, 0.12) },
    affectedPopulation: 9200,
    description: 'Steep terrain with active landslide risk',
  },
  {
    name: 'Bhongir Rocky Slope Zone',
    type: 'landslide',
    severity: 'MODERATE',
    riskScore: 64,
    regionName: 'Telangana',
    geometry: { type: 'Polygon', coordinates: makePolygon(78.888, 17.509, 0.10) },
    affectedPopulation: 5400,
    description: 'Granite hill area with moderate slope instability',
  },
  {
    name: 'Devapur Landslide Belt',
    type: 'landslide',
    severity: 'HIGH',
    riskScore: 72,
    regionName: 'Telangana',
    geometry: { type: 'Polygon', coordinates: makePolygon(78.354, 17.362, 0.11) },
    affectedPopulation: 7100,
    description: 'Unstable hillside settlement area',
  },

  // CYCLONE/WIND ZONES
  {
    name: 'Bay Cyclone Impact Zone - North',
    type: 'cyclone',
    severity: 'HIGH',
    riskScore: 74,
    regionName: 'Telangana',
    geometry: { type: 'Polygon', coordinates: makePolygon(79.578, 17.978, 0.20) },
    affectedPopulation: 22000,
    description: 'High-velocity wind impact zone from Bay of Bengal cyclones',
  },
  {
    name: 'Kothapalli Wind Corridor',
    type: 'cyclone',
    severity: 'HIGH',
    riskScore: 71,
    regionName: 'Telangana',
    geometry: { type: 'Polygon', coordinates: makePolygon(78.401, 17.428, 0.13) },
    affectedPopulation: 14200,
    description: 'Cyclone wind corridor with frequent high wind events',
  },
  {
    name: 'Karimnagar Cyclone Belt',
    type: 'cyclone',
    severity: 'MODERATE',
    riskScore: 58,
    regionName: 'Telangana',
    geometry: { type: 'Polygon', coordinates: makePolygon(79.128, 18.438, 0.15) },
    affectedPopulation: 18500,
    description: 'Moderate cyclone exposure area in northern Telangana',
  },

  // HEAT ZONES
  {
    name: 'Mahabubnagar Extreme Heat Zone',
    type: 'heat',
    severity: 'CRITICAL',
    riskScore: 90,
    regionName: 'Telangana',
    geometry: { type: 'Polygon', coordinates: makePolygon(77.987, 16.735, 0.18) },
    affectedPopulation: 19800,
    description: 'Extreme heat stress zone with recorded temperatures above 47°C',
  },
  {
    name: 'Jadcherla Heat Dome',
    type: 'heat',
    severity: 'CRITICAL',
    riskScore: 88,
    regionName: 'Telangana',
    geometry: { type: 'Polygon', coordinates: makePolygon(78.178, 16.548, 0.14) },
    affectedPopulation: 11200,
    description: 'Persistent heat dome region with chronic drought conditions',
  },
  {
    name: 'Narayanpet Heat Corridor',
    type: 'heat',
    severity: 'HIGH',
    riskScore: 78,
    regionName: 'Telangana',
    geometry: { type: 'Polygon', coordinates: makePolygon(77.498, 16.742, 0.13) },
    affectedPopulation: 8800,
    description: 'Semi-arid zone with high heat exposure and limited cooling infrastructure',
  },

  // COMPOSITE / MULTI-HAZARD ZONES
  {
    name: 'Nandigama Multi-Hazard Zone',
    type: 'composite',
    severity: 'CRITICAL',
    riskScore: 88,
    regionName: 'Telangana',
    geometry: { type: 'Polygon', coordinates: makePolygon(78.268, 17.471, 0.12) },
    affectedPopulation: 12800,
    description: 'Overlapping flood and cyclone hazard zone — highest composite risk',
  },
  {
    name: 'Rampur Compound Risk Zone',
    type: 'composite',
    severity: 'CRITICAL',
    riskScore: 85,
    regionName: 'Telangana',
    geometry: { type: 'Polygon', coordinates: makePolygon(78.312, 17.445, 0.10) },
    affectedPopulation: 8400,
    description: 'Flood + heat composite risk with dense vulnerable population',
  },
  {
    name: 'Nalgonda Compound Hazard',
    type: 'composite',
    severity: 'CRITICAL',
    riskScore: 82,
    regionName: 'Telangana',
    geometry: { type: 'Polygon', coordinates: makePolygon(79.262, 17.058, 0.14) },
    affectedPopulation: 16500,
    description: 'Combined flood, heat, and infrastructure risk zone',
  },
  {
    name: 'Bhadrachalam Extreme Zone',
    type: 'composite',
    severity: 'CRITICAL',
    riskScore: 90,
    regionName: 'Telangana',
    geometry: { type: 'Polygon', coordinates: makePolygon(80.894, 17.669, 0.16) },
    affectedPopulation: 21400,
    description: 'Highest composite risk: flood + cyclone + infrastructure deficit',
  },
  {
    name: 'Miryalaguda Basin Risk',
    type: 'composite',
    severity: 'CRITICAL',
    riskScore: 84,
    regionName: 'Telangana',
    geometry: { type: 'Polygon', coordinates: makePolygon(79.565, 16.872, 0.13) },
    affectedPopulation: 19800,
    description: 'Low elevation + flooding + heat stress compound zone',
  },
];
