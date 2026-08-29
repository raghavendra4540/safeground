import mongoose from 'mongoose';

const settlementSchema = new mongoose.Schema({
  name: { type: String, required: true },
  region: { type: mongoose.Schema.Types.ObjectId, ref: 'Region' },
  regionName: { type: String, default: 'Telangana' },

  // Location
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  elevation: { type: Number, default: 0 }, // meters

  // Population
  population: { type: Number, required: true },
  children: { type: Number, default: 0 },
  elderly: { type: Number, default: 0 },
  disabled: { type: Number, default: 0 },
  lowIncome: { type: Number, default: 0 },
  pregnantWomen: { type: Number, default: 0 },

  // Hazard scores (0-100)
  floodRisk: { type: Number, default: 0 },
  landslideRisk: { type: Number, default: 0 },
  cycloneRisk: { type: Number, default: 0 },
  heatRisk: { type: Number, default: 0 },
  infrastructureRisk: { type: Number, default: 0 },

  // Accessibility (0-100, higher = better)
  roadAccessibility: { type: Number, default: 50 },
  healthcareAccess: { type: Number, default: 50 },
  educationAccess: { type: Number, default: 50 },
  waterAccess: { type: Number, default: 50 },

  // Calculated fields
  hazardScore: { type: Number, default: 0 },
  riskLevel: { type: String, enum: ['SAFE', 'MODERATE', 'HIGH', 'CRITICAL'], default: 'SAFE' },
  priorityScore: { type: Number, default: 0 },
  priorityLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'LOW' },
  totalVulnerable: { type: Number, default: 0 },

  // Status
  status: { type: String, enum: ['active', 'evacuating', 'relocated', 'monitoring'], default: 'active' },
  isDemo: { type: Boolean, default: true },
}, {
  timestamps: true,
  indexes: [{ location: '2dsphere' }],
});

settlementSchema.index({ location: '2dsphere' });

export default mongoose.model('Settlement', settlementSchema);
