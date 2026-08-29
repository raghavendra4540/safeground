import { SIMULATION_MULTIPLIERS } from '../utils/constants.js';
import { clamp } from '../utils/calculateScore.js';

/**
 * Disaster Scenario Simulation Engine
 */
export const runSimulation = (type, severity, baselineData) => {
  const multipliers = SIMULATION_MULTIPLIERS[type] || SIMULATION_MULTIPLIERS.flood;
  const multiplier = multipliers[severity] || multipliers.medium;

  const {
    basePopulationAtRisk = 18000,
    baseCriticalZones = 8,
    baseSafeCapacity = 61000,
    totalPopulation = 128450,
  } = baselineData;

  const affectedPopulation = Math.min(
    totalPopulation,
    Math.round(basePopulationAtRisk * multiplier)
  );

  const criticalZones = Math.min(30, Math.round(baseCriticalZones * multiplier));

  // Relocation demand = portion of affected that must move
  const relocationFactor = { low: 0.3, medium: 0.45, high: 0.6, extreme: 0.8 }[severity] || 0.45;
  const relocationDemand = Math.round(affectedPopulation * relocationFactor);

  // Safe capacity reduces under stress
  const capacityStressFactor = { low: 0.95, medium: 0.88, high: 0.75, extreme: 0.60 }[severity] || 0.88;
  const safeCapacity = Math.round(baseSafeCapacity * capacityStressFactor);

  const capacityGap = Math.max(0, relocationDemand - safeCapacity);
  const infrastructureStress = clamp(Math.round((affectedPopulation / totalPopulation) * 100 * multiplier));

  const evacuationRoutesDamaged = Math.round(criticalZones * 0.4);
  const hospitalsAtRisk = Math.round(criticalZones * 0.25);
  const schoolsDisrupted = Math.round(criticalZones * 0.6);

  // Hazard-specific impacts
  const hazardImpacts = getHazardImpacts(type, severity, affectedPopulation);

  return {
    type,
    severity,
    multiplier,
    baseline: {
      populationAtRisk: basePopulationAtRisk,
      criticalZones: baseCriticalZones,
      safeCapacity: baseSafeCapacity,
    },
    simulated: {
      affectedPopulation,
      criticalZones,
      relocationDemand,
      safeCapacity,
      capacityGap,
      infrastructureStress,
      evacuationRoutesDamaged,
      hospitalsAtRisk,
      schoolsDisrupted,
    },
    hazardImpacts,
    riskChange: {
      populationIncrease: affectedPopulation - basePopulationAtRisk,
      populationIncreasePercent: Math.round(((affectedPopulation - basePopulationAtRisk) / basePopulationAtRisk) * 100),
      zonesIncrease: criticalZones - baseCriticalZones,
    },
    status: capacityGap > 0 ? 'CAPACITY_INSUFFICIENT' : 'CAPACITY_SUFFICIENT',
  };
};

const getHazardImpacts = (type, severity, affectedPopulation) => {
  const impacts = {
    flood: {
      waterInundation: `${Math.round(affectedPopulation * 0.3).toLocaleString()} people in submerged zones`,
      cropDamage: severity === 'extreme' ? 'Catastrophic agricultural loss' : 'Significant crop damage',
      roadsDamaged: `${Math.round(12 * { low:1,medium:2,high:3,extreme:5 }[severity])} road segments affected`,
    },
    cyclone: {
      windDamage: `${Math.round(affectedPopulation * 0.4).toLocaleString()} structures at wind risk`,
      powerOutage: severity === 'extreme' ? 'Region-wide power disruption' : 'Localised power failures',
      evacuationWindow: { low: '48 hours', medium: '24 hours', high: '12 hours', extreme: '6 hours' }[severity],
    },
    heat: {
      heatstrokeRisk: `${Math.round(affectedPopulation * 0.05).toLocaleString()} people at heatstroke risk`,
      waterScarcity: `${Math.round(affectedPopulation * 0.6).toLocaleString()} facing water shortage`,
      outdoorWorkBan: severity === 'extreme' || severity === 'high',
    },
    landslide: {
      slopeFailures: `${Math.round(4 * { low:1,medium:1.5,high:2.5,extreme:4 }[severity])} slope failures expected`,
      roadsBlocked: `${Math.round(8 * { low:1,medium:2,high:3,extreme:5 }[severity])} routes blocked`,
    },
    combined: {
      compoundRisk: 'Multiple simultaneous hazard events',
      systemFailure: severity === 'extreme' ? 'Complete infrastructure failure likely' : 'Partial system disruption',
      evacuationComplexity: 'High — multiple hazard zones active simultaneously',
    },
  };
  return impacts[type] || impacts.flood;
};
