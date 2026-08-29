import mongoose from 'mongoose';

const relocationPlanSchema = new mongoose.Schema({
  settlement: { type: mongoose.Schema.Types.ObjectId, ref: 'Settlement' },
  settlementName: { type: String },
  destinationSite: { type: mongoose.Schema.Types.ObjectId, ref: 'SafeSite' },
  destinationSiteName: { type: String },

  population: { type: Number, required: true },
  sourceLocation: {
    lat: Number,
    lng: Number,
  },
  destinationLocation: {
    lat: Number,
    lng: Number,
  },

  distance: { type: Number, default: 0 },        // km
  transportCost: { type: Number, default: 0 },   // ₹
  vehiclesRequired: { type: Number, default: 0 },
  tripsRequired: { type: Number, default: 0 },
  estimatedDuration: { type: Number, default: 0 }, // hours

  safetyImprovement: { type: Number, default: 0 }, // %
  capacityRemaining: { type: Number, default: 0 },

  status: {
    type: String,
    enum: ['draft', 'approved', 'in_progress', 'completed', 'cancelled'],
    default: 'draft',
  },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'], default: 'MEDIUM' },

  aiRecommendation: { type: String, default: '' },
  actionPlan: {
    immediate: [String],
    hours24: [String],
    days7: [String],
    longTerm: [String],
  },

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('RelocationPlan', relocationPlanSchema);
