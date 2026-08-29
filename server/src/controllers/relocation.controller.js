import Settlement from '../models/Settlement.js';
import SafeSite from '../models/SafeSite.js';
import RelocationPlan from '../models/RelocationPlan.js';
import { analyzeRelocation } from '../services/relocation.service.js';
import { estimateTransportFromCoords } from '../services/transport.service.js';

export const analyzeRelocationRoute = async (req, res, next) => {
  try {
    const { settlementId, priorities } = req.body;
    const settlement = await Settlement.findById(settlementId);
    if (!settlement) return res.status(404).json({ success: false, message: 'Settlement not found' });

    const safeSites = await SafeSite.find({});
    const result = analyzeRelocation(settlement, safeSites, priorities || {});
    res.json({ success: true, data: result });
  } catch (err) { next(err); }
};

export const recommendRelocationSite = async (req, res, next) => {
  try {
    const { settlementId, siteId } = req.body;
    const [settlement, site] = await Promise.all([
      Settlement.findById(settlementId),
      SafeSite.findById(siteId),
    ]);
    if (!settlement || !site) return res.status(404).json({ success: false, message: 'Settlement or site not found' });

    const [srcLng, srcLat] = settlement.location.coordinates;
    const [dstLng, dstLat] = site.location.coordinates;
    const transport = estimateTransportFromCoords(settlement.population, srcLat, srcLng, dstLat, dstLng);

    res.json({ success: true, data: { settlement, site, transport } });
  } catch (err) { next(err); }
};

export const createRelocationPlan = async (req, res, next) => {
  try {
    const { settlementId, siteId, population, priorities } = req.body;
    const [settlement, site] = await Promise.all([
      Settlement.findById(settlementId),
      SafeSite.findById(siteId),
    ]);
    if (!settlement || !site) return res.status(404).json({ success: false, message: 'Not found' });

    const [srcLng, srcLat] = settlement.location.coordinates;
    const [dstLng, dstLat] = site.location.coordinates;
    const transport = estimateTransportFromCoords(population || settlement.population, srcLat, srcLng, dstLat, dstLng);
    const safetyImprovement = Math.round(site.safetyScore - (100 - settlement.hazardScore));

    const plan = await RelocationPlan.create({
      settlement: settlement._id,
      settlementName: settlement.name,
      destinationSite: site._id,
      destinationSiteName: site.name,
      population: population || settlement.population,
      sourceLocation: { lat: srcLat, lng: srcLng },
      destinationLocation: { lat: dstLat, lng: dstLng },
      distance: transport.distance,
      transportCost: transport.totalCost,
      vehiclesRequired: transport.vehiclesRequired,
      tripsRequired: transport.tripsRequired,
      estimatedDuration: transport.totalOperationHours,
      safetyImprovement,
      capacityRemaining: site.totalCapacity - site.occupiedCapacity - (population || settlement.population),
      priority: settlement.priorityLevel,
      createdBy: req.user?._id,
    });

    res.status(201).json({ success: true, data: plan });
  } catch (err) { next(err); }
};

export const getRelocationPlans = async (req, res, next) => {
  try {
    const plans = await RelocationPlan.find({})
      .populate('settlement', 'name location riskLevel')
      .populate('destinationSite', 'name safetyScore')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: plans });
  } catch (err) { next(err); }
};

export const getRelocationPlanById = async (req, res, next) => {
  try {
    const plan = await RelocationPlan.findById(req.params.id)
      .populate('settlement')
      .populate('destinationSite');
    if (!plan) return res.status(404).json({ success: false, message: 'Plan not found' });
    res.json({ success: true, data: plan });
  } catch (err) { next(err); }
};
