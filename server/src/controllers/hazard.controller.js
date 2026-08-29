import HazardZone from '../models/HazardZone.js';

export const getHazards = async (req, res, next) => {
  try {
    const { type, severity, region } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (severity) filter.severity = severity.toUpperCase();
    if (region && region !== 'All India' && region !== 'all' && region !== 'India') {
      filter.regionName = { $regex: new RegExp(region.trim(), 'i') };
    }
    const hazards = await HazardZone.find(filter).sort({ riskScore: -1 });
    res.json({ success: true, data: hazards, total: hazards.length });
  } catch (err) { next(err); }
};

export const getHazardsByType = async (req, res, next) => {
  try {
    const hazards = await HazardZone.find({ type: req.params.type }).sort({ riskScore: -1 });
    res.json({ success: true, data: hazards });
  } catch (err) { next(err); }
};
