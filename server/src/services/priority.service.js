import { clamp, getPriorityLevel } from '../utils/calculateScore.js';

/**
 * Settlement Priority Engine
 * Calculates relocation priority score for each settlement
 */
export const calculatePriorityScore = (settlement) => {
  const {
    hazardScore = 0,
    population = 0,
    children = 0,
    elderly = 0,
    disabled = 0,
    pregnantWomen = 0,
    lowIncome = 0,
    healthcareAccess = 50,
    roadAccessibility = 50,
    infrastructureRisk = 50,
  } = settlement;

  const totalVulnerable = children + elderly + disabled + pregnantWomen;
  const vulnerabilityRatio = population > 0 ? (totalVulnerable / population) * 100 : 0;
  const lowIncomeRatio = population > 0 ? (lowIncome / population) * 100 : 0;

  // Population exposure normalized
  const populationScore = Math.min(100, (population / 8000) * 100);

  // Vulnerable population score
  const vulnerableScore = Math.min(100, vulnerabilityRatio * 1.5 + lowIncomeRatio * 0.5);

  // Healthcare inaccessibility (inverse)
  const healthcareInaccessibility = 100 - healthcareAccess;

  // Road inaccessibility (inverse)
  const roadInaccessibility = 100 - roadAccessibility;

  // Evacuation difficulty = poor roads + poor healthcare + high infra risk
  const evacuationDifficulty = clamp(
    roadInaccessibility * 0.5 + infrastructureRisk * 0.3 + healthcareInaccessibility * 0.2
  );

  // Weighted priority score
  const priorityScore = clamp(Math.round(
    hazardScore * 0.30 +
    populationScore * 0.20 +
    vulnerableScore * 0.20 +
    healthcareInaccessibility * 0.10 +
    roadInaccessibility * 0.10 +
    evacuationDifficulty * 0.10
  ));

  const priorityLevel = getPriorityLevel(priorityScore);

  const recommendedAction = getRecommendedAction(priorityLevel, priorityScore);

  return {
    priorityScore,
    priorityLevel,
    recommendedAction,
    breakdown: {
      hazardContribution: Math.round(hazardScore * 0.30),
      populationContribution: Math.round(populationScore * 0.20),
      vulnerabilityContribution: Math.round(vulnerableScore * 0.20),
      accessibilityContribution: Math.round((healthcareInaccessibility * 0.10 + roadInaccessibility * 0.10)),
      evacuationContribution: Math.round(evacuationDifficulty * 0.10),
    },
    totalVulnerable,
    vulnerabilityRatio: Math.round(vulnerabilityRatio),
  };
};

const getRecommendedAction = (level, score) => {
  if (level === 'URGENT') {
    if (score >= 90) return 'Immediate evacuation — life-threatening risk. Deploy emergency teams now.';
    return 'Urgent relocation required. Initiate within 48 hours. Pre-position transport assets.';
  }
  if (level === 'HIGH') return 'Planned relocation required. Begin site preparation and resident engagement within 2 weeks.';
  if (level === 'MEDIUM') return 'Relocation planning recommended. Assess safe sites and begin community consultation.';
  return 'Monitor and prepare contingency plans. Current risk manageable with mitigation.';
};
