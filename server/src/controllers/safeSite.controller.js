import SafeSite from '../models/SafeSite.js';
import Settlement from '../models/Settlement.js';
import { calculateCarryingCapacity } from '../services/capacity.service.js';
import { rankSafeSites } from '../services/site-ranking.service.js';

export const getSafeSites = async (req, res, next) => {
  try {
    const { sortBy = 'safetyScore', region } = req.query;
    const filter = {};
    if (region && region !== 'All India' && region !== 'all' && region !== 'India') {
      filter.regionName = { $regex: new RegExp(region.trim(), 'i') };
    }
    const sites = await SafeSite.find(filter).sort({ [sortBy]: -1 });
    const withCapacity = sites.map(site => ({
      ...site.toJSON(),
      capacity: calculateCarryingCapacity(site),
    }));
    res.json({ success: true, data: withCapacity });
  } catch (err) { next(err); }
};

export const getSafeSiteById = async (req, res, next) => {
  try {
    const site = await SafeSite.findById(req.params.id);
    if (!site) return res.status(404).json({ success: false, message: 'Safe site not found' });
    const capacity = calculateCarryingCapacity(site);
    res.json({ success: true, data: { ...site.toJSON(), capacity } });
  } catch (err) { next(err); }
};

export const getRecommendedSites = async (req, res, next) => {
  try {
    const settlement = await Settlement.findById(req.params.settlementId);
    if (!settlement) return res.status(404).json({ success: false, message: 'Settlement not found' });

    const allSites = await SafeSite.find({});
    const [srcLng, srcLat] = settlement.location.coordinates;

    const ranked = rankSafeSites(
      allSites,
      { lat: srcLat, lng: srcLng },
      settlement.population
    );

    res.json({ success: true, data: ranked, settlement: { _id: settlement._id, name: settlement.name, population: settlement.population } });
  } catch (err) { next(err); }
};
