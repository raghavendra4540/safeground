import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['risk_assessment', 'relocation_strategy', 'flood_preparedness', 'emergency_shelter', 'general'],
    default: 'general',
  },
  region: { type: String, default: 'Telangana' },
  riskLevel: { type: String, enum: ['SAFE', 'MODERATE', 'HIGH', 'CRITICAL'], default: 'HIGH' },
  status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },

  content: {
    executiveSummary: { type: String, default: '' },
    riskAssessment: { type: String, default: '' },
    criticalSettlements: [{ type: String }],
    recommendedRelocations: [{ type: String }],
    safeSites: [{ type: String }],
    infrastructureGaps: [{ type: String }],
    immediateActions: [{ type: String }],
    longTermRecommendations: [{ type: String }],
  },

  metadata: {
    populationAtRisk: { type: Number, default: 0 },
    criticalZones: { type: Number, default: 0 },
    safeCapacity: { type: Number, default: 0 },
    confidence: { type: Number, default: 85 },
  },

  generatedBy: { type: String, default: 'AI + Risk Engine' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Report', reportSchema);
