import mongoose from 'mongoose';

const hazardZoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['flood', 'landslide', 'cyclone', 'heat', 'composite'], required: true },
  severity: { type: String, enum: ['LOW', 'MODERATE', 'HIGH', 'CRITICAL'], default: 'MODERATE' },
  riskScore: { type: Number, default: 50 },
  region: { type: mongoose.Schema.Types.ObjectId, ref: 'Region' },
  regionName: { type: String, default: 'Telangana' },

  // GeoJSON geometry
  geometry: {
    type: { type: String, enum: ['Polygon', 'MultiPolygon'], default: 'Polygon' },
    coordinates: { type: Array, required: true },
  },

  // Metadata
  affectedPopulation: { type: Number, default: 0 },
  description: { type: String, default: '' },
  lastUpdated: { type: Date, default: Date.now },
  isDemo: { type: Boolean, default: true },
}, { timestamps: true });

hazardZoneSchema.index({ geometry: '2dsphere' });

export default mongoose.model('HazardZone', hazardZoneSchema);
