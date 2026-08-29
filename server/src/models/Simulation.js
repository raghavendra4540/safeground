import mongoose from 'mongoose';

const simulationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['flood', 'cyclone', 'heat', 'landslide', 'combined'], required: true },
  severity: { type: String, enum: ['low', 'medium', 'high', 'extreme'], required: true },
  region: { type: String, default: 'Telangana' },

  // Baseline
  baselinePopulationAtRisk: { type: Number, default: 0 },
  baselineCriticalZones: { type: Number, default: 0 },

  // Simulated results
  affectedPopulation: { type: Number, default: 0 },
  criticalZones: { type: Number, default: 0 },
  relocationDemand: { type: Number, default: 0 },
  safeCapacity: { type: Number, default: 0 },
  capacityGap: { type: Number, default: 0 },
  infrastructureStress: { type: Number, default: 0 }, // %

  results: { type: mongoose.Schema.Types.Mixed, default: {} },
  aiRecommendation: { type: String, default: '' },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Simulation', simulationSchema);
