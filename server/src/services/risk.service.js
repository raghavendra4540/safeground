import { RISK_WEIGHTS } from '../utils/constants.js';
import { clamp, getRiskLevel } from '../utils/calculateScore.js';

/**
 * Risk Calculation Engine
 * Deterministic weighted scoring — LLM never touches raw scores
 */
export const calculateRiskScore = (settlement, weights = RISK_WEIGHTS) => {
  const {
    floodRisk = 0,
    landslideRisk = 0,
    cycloneRisk = 0,
    heatRisk = 0,
    population = 0,
    infrastructureRisk = 0,
    roadAccessibility = 50,
  } = settlement;

  // Normalize population exposure (0-100 based on density/size)
  const populationExposure = Math.min(100, (population / 10000) * 100);

  // Accessibility risk (inverse of road accessibility)
  const accessibilityRisk = 100 - roadAccessibility;

  const factors = {
    flood: floodRisk,
    landslide: landslideRisk,
    cyclone: cycloneRisk,
    heat: heatRisk,
    populationExposure,
    infrastructureVulnerability: infrastructureRisk,
    accessibilityRisk,
  };

  // Weighted composite score
  let score = 0;
  for (const [key, weight] of Object.entries(weights)) {
    score += (factors[key] || 0) * weight;
  }

  score = clamp(Math.round(score), 0, 100);
  const level = getRiskLevel(score);

  return {
    score,
    level,
    factors: {
      floodRisk,
      landslideRisk,
      cycloneRisk,
      heatRisk,
      populationExposure: Math.round(populationExposure),
      infrastructureVulnerability: infrastructureRisk,
      accessibilityRisk: Math.round(accessibilityRisk),
    },
    weights,
  };
};

export const getRiskColor = (level) => {
  const colors = {
    SAFE: '#22c55e',
    MODERATE: '#eab308',
    HIGH: '#f97316',
    CRITICAL: '#ef4444',
  };
  return colors[level] || '#6b7280';
};
