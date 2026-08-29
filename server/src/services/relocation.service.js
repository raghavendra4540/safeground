import { rankSafeSites } from './site-ranking.service.js';
import { estimateTransportFromCoords } from './transport.service.js';
import { checkRelocationFeasibility } from './capacity.service.js';
import { clamp } from '../utils/calculateScore.js';

/**
 * Relocation Optimization Engine
 * Combines site ranking + transport estimation + feasibility check
 */
export const analyzeRelocation = (settlement, safeSites, priorities = {}) => {
  const [srcLng, srcLat] = settlement.location.coordinates;

  const weights = buildWeightsFromPriorities(priorities);

  const rankedSites = rankSafeSites(
    safeSites,
    { lat: srcLat, lng: srcLng },
    settlement.population,
    weights
  );

  const results = rankedSites.map(ranked => {
    const [destLng, destLat] = ranked.site.location.coordinates;
    const transport = estimateTransportFromCoords(
      settlement.population,
      srcLat, srcLng,
      destLat, destLng
    );

    const feasibility = checkRelocationFeasibility(ranked.site, settlement.population);

    const safetyImprovement = clamp(
      Math.round(ranked.site.safetyScore - (100 - settlement.hazardScore))
    );

    return {
      rank: ranked.rank,
      label: ranked.label,
      site: {
        _id: ranked.site._id,
        name: ranked.site.name,
        safetyScore: ranked.site.safetyScore,
        healthcareScore: ranked.site.healthcareScore,
        roadAccessibility: ranked.site.roadAccessibility,
        educationScore: ranked.site.educationScore,
        waterCapacity: ranked.site.waterCapacity,
        location: ranked.site.location,
        totalCapacity: ranked.site.totalCapacity,
        occupiedCapacity: ranked.site.occupiedCapacity,
      },
      candidateScore: ranked.candidateScore,
      distance: transport.distance,
      transport,
      feasibility,
      safetyImprovement,
      capacityRemaining: feasibility.remainingCapacity,
      scoreBreakdown: ranked.scoreBreakdown,
    };
  });

  return {
    settlement: {
      _id: settlement._id,
      name: settlement.name,
      population: settlement.population,
      hazardScore: settlement.hazardScore,
      riskLevel: settlement.riskLevel,
      priorityLevel: settlement.priorityLevel,
      location: settlement.location,
    },
    recommendations: results,
    totalCandidateSites: safeSites.length,
    appliedWeights: weights,
  };
};

const buildWeightsFromPriorities = (priorities) => {
  // priorities: { safety: 0-1, cost: 0-1, distance: 0-1, capacity: 0-1, healthcare: 0-1 }
  const {
    safety = 0.35,
    cost = 0.05,
    distance = 0.05,
    capacity = 0.20,
    healthcare = 0.10,
  } = priorities;

  const total = safety + cost + distance + capacity + healthcare;
  const normalize = (v) => v / total;

  return {
    safetyScore: normalize(safety),
    availableCapacity: normalize(capacity),
    healthcare: normalize(healthcare),
    roadAccessibility: normalize(distance * 0.5 + 0.05),
    education: 0.05,
    waterAvailability: normalize(0.10),
    distance: normalize(distance * 0.5),
    transportCost: normalize(cost),
  };
};
