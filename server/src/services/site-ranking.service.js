import { calculateDistance } from '../utils/calculateDistance.js';
import { calculateCarryingCapacity } from './capacity.service.js';
import { clamp } from '../utils/calculateScore.js';

const DEFAULT_WEIGHTS = {
  safetyScore: 0.35,
  availableCapacity: 0.20,
  healthcare: 0.10,
  roadAccessibility: 0.10,
  education: 0.05,
  waterAvailability: 0.10,
  distance: 0.05,
  transportCost: 0.05,
};

/**
 * Site Ranking Engine
 * Ranks safe sites for a given relocation scenario
 */
export const rankSafeSites = (sites, sourceLocation, populationToRelocate, customWeights = {}) => {
  const weights = { ...DEFAULT_WEIGHTS, ...customWeights };

  const MAX_DISTANCE = 100; // km
  const MAX_COST = 1000;    // ₹ per person

  const ranked = sites
    .filter(site => {
      const cap = calculateCarryingCapacity(site);
      return cap.finalCarryingCapacity >= populationToRelocate * 0.5; // at least 50% capacity
    })
    .map(site => {
      const cap = calculateCarryingCapacity(site);
      const [siteLng, siteLat] = site.location.coordinates;

      const distance = sourceLocation
        ? calculateDistance(sourceLocation.lat, sourceLocation.lng, siteLat, siteLng)
        : site.transportDistance || 20;

      // Normalize scores
      const safetyNorm = site.safetyScore / 100;
      const capacityNorm = Math.min(1, cap.availableCapacity / Math.max(populationToRelocate, 1));
      const healthcareNorm = site.healthcareScore / 100;
      const roadNorm = site.roadAccessibility / 100;
      const educationNorm = site.educationScore / 100;
      const waterNorm = site.waterCapacity / 100;
      const distanceNorm = Math.max(0, 1 - distance / MAX_DISTANCE);
      const costNorm = Math.max(0, 1 - (site.transportCost || 0) / MAX_COST);

      const candidateScore = clamp(Math.round(
        safetyNorm * weights.safetyScore * 100 +
        capacityNorm * weights.availableCapacity * 100 +
        healthcareNorm * weights.healthcare * 100 +
        roadNorm * weights.roadAccessibility * 100 +
        educationNorm * weights.education * 100 +
        waterNorm * weights.waterAvailability * 100 +
        distanceNorm * weights.distance * 100 +
        costNorm * weights.transportCost * 100
      ));

      const safetyImprovement = 0; // calculated per-settlement in relocation service

      return {
        site,
        candidateScore,
        distance,
        availableCapacity: cap.availableCapacity,
        carryingCapacityScore: cap.carryingCapacityScore,
        feasible: cap.finalCarryingCapacity >= populationToRelocate,
        scoreBreakdown: {
          safety: Math.round(safetyNorm * weights.safetyScore * 100),
          capacity: Math.round(capacityNorm * weights.availableCapacity * 100),
          healthcare: Math.round(healthcareNorm * weights.healthcare * 100),
          road: Math.round(roadNorm * weights.roadAccessibility * 100),
          distance: Math.round(distanceNorm * weights.distance * 100),
          cost: Math.round(costNorm * weights.transportCost * 100),
        },
      };
    })
    .sort((a, b) => b.candidateScore - a.candidateScore);

  return ranked.slice(0, 5).map((item, index) => ({
    rank: index + 1,
    label: index === 0 ? 'Recommended' : `Alternative ${index}`,
    ...item,
  }));
};
