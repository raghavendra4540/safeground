import mongoose from 'mongoose';

const regionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  state: { type: String, default: 'Telangana' },
  country: { type: String, default: 'India' },
  population: { type: Number, default: 0 },
  area: { type: Number, default: 0 }, // sq km
  center: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  bounds: {
    north: Number,
    south: Number,
    east: Number,
    west: Number,
  },
  isDemo: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.model('Region', regionSchema);
