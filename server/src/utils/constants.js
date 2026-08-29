export const RISK_LEVELS = {
  SAFE: { label: 'SAFE', min: 0, max: 25, color: '#22c55e' },
  MODERATE: { label: 'MODERATE', min: 26, max: 50, color: '#eab308' },
  HIGH: { label: 'HIGH', min: 51, max: 75, color: '#f97316' },
  CRITICAL: { label: 'CRITICAL', min: 76, max: 100, color: '#ef4444' },
};

export const RISK_WEIGHTS = {
  flood: 0.30,
  landslide: 0.20,
  cyclone: 0.15,
  heat: 0.10,
  populationExposure: 0.10,
  infrastructureVulnerability: 0.10,
  accessibilityRisk: 0.05,
};

export const PRIORITY_WEIGHTS = {
  hazardScore: 0.30,
  populationExposed: 0.20,
  vulnerablePopulation: 0.20,
  healthcareAccessibility: 0.10,
  roadAccessibility: 0.10,
  evacuationDifficulty: 0.10,
};

export const SITE_RANKING_WEIGHTS = {
  safetyScore: 0.35,
  availableCapacity: 0.20,
  healthcare: 0.10,
  roadAccessibility: 0.10,
  education: 0.05,
  waterAvailability: 0.10,
  distance: 0.05,
  transportCost: 0.05,
};

export const TRANSPORT = {
  vehicleCapacity: 50,
  fuelRatePerKm: 8,        // ₹ per km per vehicle
  laborCostPerVehicle: 500, // ₹ per vehicle per trip
  avgSpeedKmh: 40,
};

export const PRIORITY_LEVELS = {
  URGENT: { label: 'URGENT RELOCATION', min: 76, max: 100 },
  HIGH: { label: 'HIGH PRIORITY', min: 51, max: 75 },
  MEDIUM: { label: 'MEDIUM PRIORITY', min: 26, max: 50 },
  LOW: { label: 'LOW PRIORITY', min: 0, max: 25 },
};

export const HAZARD_TYPES = ['flood', 'landslide', 'cyclone', 'heat', 'composite'];

export const SIMULATION_MULTIPLIERS = {
  flood:   { low: 1.3, medium: 1.8, high: 2.5, extreme: 3.5 },
  cyclone: { low: 1.2, medium: 1.6, high: 2.2, extreme: 3.0 },
  heat:    { low: 1.1, medium: 1.4, high: 1.9, extreme: 2.6 },
  landslide: { low: 1.1, medium: 1.5, high: 2.0, extreme: 2.8 },
  combined:  { low: 1.5, medium: 2.2, high: 3.2, extreme: 4.5 },
};
