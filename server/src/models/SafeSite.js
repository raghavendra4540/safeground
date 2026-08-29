import mongoose from 'mongoose';

const safeSiteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  region: { type: mongoose.Schema.Types.ObjectId, ref: 'Region' },
  regionName: { type: String, default: 'Telangana' },

  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  elevation: { type: Number, default: 0 },

  // Capacity
  totalCapacity: { type: Number, required: true },
  occupiedCapacity: { type: Number, default: 0 },

  // Resource scores (0-100)
  waterCapacity: { type: Number, default: 50 },
  healthcareScore: { type: Number, default: 50 },
  educationScore: { type: Number, default: 50 },
  roadAccessibility: { type: Number, default: 50 },
  infrastructureScore: { type: Number, default: 50 },
  landAvailability: { type: Number, default: 50 },

  // Hazard (lower = safer)
  hazardScore: { type: Number, default: 10 },

  // Transport
  transportDistance: { type: Number, default: 0 }, // km from centroid
  transportCost: { type: Number, default: 0 },      // ₹ estimate per person

  // Calculated scores
  safetyScore: { type: Number, default: 0 },
  carryingCapacityScore: { type: Number, default: 0 },
  overallSafetyScore: { type: Number, default: 0 },

  description: { type: String, default: '' },
  amenities: [{ type: String }],
  isDemo: { type: Boolean, default: true },
}, {
  timestamps: true,
  virtuals: true,
});

safeSiteSchema.virtual('availableCapacity').get(function () {
  return Math.max(0, this.totalCapacity - this.occupiedCapacity);
});

safeSiteSchema.virtual('occupancyPercent').get(function () {
  return Math.round((this.occupiedCapacity / this.totalCapacity) * 100);
});

safeSiteSchema.set('toJSON', { virtuals: true });
safeSiteSchema.set('toObject', { virtuals: true });

safeSiteSchema.index({ location: '2dsphere' });

export default mongoose.model('SafeSite', safeSiteSchema);
