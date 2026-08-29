import { clamp } from '../utils/calculateScore.js';

/**
 * Carrying Capacity Engine
 * Determines if a safe site can absorb a given population
 */
export const calculateCarryingCapacity = (site) => {
  const {
    totalCapacity = 0,
    occupiedCapacity = 0,
    waterCapacity = 50,
    healthcareScore = 50,
    educationScore = 50,
    roadAccessibility = 50,
    infrastructureScore = 50,
    landAvailability = 50,
  } = site;

  const availableCapacity = Math.max(0, totalCapacity - occupiedCapacity);
  const occupancyRate = totalCapacity > 0 ? (occupiedCapacity / totalCapacity) * 100 : 100;

  // Each resource score translates to a capacity fraction
  const waterCap = Math.round((waterCapacity / 100) * totalCapacity);
  const healthcareCap = Math.round((healthcareScore / 100) * totalCapacity * 1.2); // healthcare can support slightly more
  const educationCap = Math.round((educationScore / 100) * totalCapacity * 1.5);
  const infraCap = Math.round((infrastructureScore / 100) * totalCapacity);
  const landCap = Math.round((landAvailability / 100) * totalCapacity * 1.3);

  // Carrying capacity is the minimum bottleneck resource
  const resourceCapacities = [availableCapacity, waterCap, healthcareCap, infraCap, landCap];
  const finalCarryingCapacity = Math.min(...resourceCapacities);

  // Score: how well resourced is this site relative to its total capacity?
  const carryingCapacityScore = clamp(Math.round(
    waterCapacity * 0.25 +
    healthcareScore * 0.20 +
    infrastructureScore * 0.20 +
    roadAccessibility * 0.15 +
    landAvailability * 0.10 +
    educationScore * 0.10
  ));

  return {
    availableCapacity,
    occupancyRate: Math.round(occupancyRate),
    waterCapacity: waterCap,
    healthcareCapacity: healthcareCap,
    educationCapacity: educationCap,
    infrastructureCapacity: infraCap,
    landCapacity: landCap,
    finalCarryingCapacity,
    carryingCapacityScore,
    isFull: availableCapacity <= 0,
  };
};

export const checkRelocationFeasibility = (site, populationToRelocate) => {
  const capacity = calculateCarryingCapacity(site);
  const feasible = capacity.finalCarryingCapacity >= populationToRelocate;
  const remainingAfter = capacity.availableCapacity - populationToRelocate;

  return {
    feasible,
    availableCapacity: capacity.availableCapacity,
    finalCarryingCapacity: capacity.finalCarryingCapacity,
    populationToRelocate,
    remainingCapacity: Math.max(0, remainingAfter),
    utilizationAfter: Math.round(
      ((site.occupiedCapacity + populationToRelocate) / site.totalCapacity) * 100
    ),
    explanation: feasible
      ? `Site can absorb ${populationToRelocate.toLocaleString()} residents. ${Math.max(0, remainingAfter).toLocaleString()} capacity remains.`
      : `Site cannot absorb ${populationToRelocate.toLocaleString()} residents. Available: ${capacity.finalCarryingCapacity.toLocaleString()}.`,
    bottleneck: getBottleneck(capacity, populationToRelocate),
  };
};

const getBottleneck = (capacity, population) => {
  if (capacity.waterCapacity < population) return 'water_supply';
  if (capacity.healthcareCapacity < population) return 'healthcare';
  if (capacity.infrastructureCapacity < population) return 'infrastructure';
  if (capacity.availableCapacity < population) return 'space';
  return null;
};
