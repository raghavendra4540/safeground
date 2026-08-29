import { RISK_LEVELS, PRIORITY_LEVELS } from './constants.js';

export const clamp = (val, min = 0, max = 100) => Math.min(max, Math.max(min, val));

export const getRiskLevel = (score) => {
  if (score >= 76) return 'CRITICAL';
  if (score >= 51) return 'HIGH';
  if (score >= 26) return 'MODERATE';
  return 'SAFE';
};

export const getPriorityLevel = (score) => {
  if (score >= 76) return 'URGENT';
  if (score >= 51) return 'HIGH';
  if (score >= 26) return 'MEDIUM';
  return 'LOW';
};

export const normalizeScore = (value, min, max) => {
  if (max === min) return 50;
  return clamp(((value - min) / (max - min)) * 100);
};

export const weightedSum = (factors, weights) => {
  let total = 0;
  let weightSum = 0;
  for (const [key, weight] of Object.entries(weights)) {
    if (factors[key] !== undefined) {
      total += factors[key] * weight;
      weightSum += weight;
    }
  }
  return weightSum > 0 ? clamp(total / weightSum) : 0;
};
