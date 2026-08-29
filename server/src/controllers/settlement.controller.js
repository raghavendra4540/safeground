import Settlement from '../models/Settlement.js';
import SafeSite from '../models/SafeSite.js';
import { calculateRiskScore } from '../services/risk.service.js';
import { calculatePriorityScore } from '../services/priority.service.js';

export const getSettlements = async (req, res, next) => {
  try {
    const { riskLevel, priorityLevel, search, region, limit = 100, page = 1 } = req.query;
    const filter = {};
    if (riskLevel) filter.riskLevel = riskLevel.toUpperCase();
    if (priorityLevel) filter.priorityLevel = priorityLevel.toUpperCase();
    if (search) filter.name = { $regex: search, $options: 'i' };
    if (region && region !== 'All India' && region !== 'all' && region !== 'India') {
      filter.regionName = { $regex: new RegExp(region.trim(), 'i') };
    }

    const skip = (page - 1) * limit;
    const [settlements, total] = await Promise.all([
      Settlement.find(filter).sort({ hazardScore: -1 }).skip(skip).limit(Number(limit)),
      Settlement.countDocuments(filter),
    ]);

    res.json({ success: true, data: settlements, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { next(err); }
};

export const getSettlementById = async (req, res, next) => {
  try {
    const settlement = await Settlement.findById(req.params.id);
    if (!settlement) return res.status(404).json({ success: false, message: 'Settlement not found' });
    res.json({ success: true, data: settlement });
  } catch (err) { next(err); }
};

export const getSettlementRisk = async (req, res, next) => {
  try {
    const settlement = await Settlement.findById(req.params.id);
    if (!settlement) return res.status(404).json({ success: false, message: 'Settlement not found' });
    const riskResult = calculateRiskScore(settlement);
    const priorityResult = calculatePriorityScore(settlement);
    res.json({ success: true, data: { settlement, riskResult, priorityResult } });
  } catch (err) { next(err); }
};

export const getSettlementVulnerability = async (req, res, next) => {
  try {
    const settlement = await Settlement.findById(req.params.id);
    if (!settlement) return res.status(404).json({ success: false, message: 'Settlement not found' });

    const groups = [
      { name: 'Children', value: settlement.children, color: '#60a5fa' },
      { name: 'Elderly', value: settlement.elderly, color: '#f59e0b' },
      { name: 'Disabled', value: settlement.disabled, color: '#8b5cf6' },
      { name: 'Low Income', value: settlement.lowIncome, color: '#ef4444' },
      { name: 'Pregnant Women', value: settlement.pregnantWomen || 0, color: '#ec4899' },
    ];

    const totalVulnerable = settlement.children + settlement.elderly + settlement.disabled + (settlement.pregnantWomen || 0);

    res.json({
      success: true,
      data: {
        settlement: { _id: settlement._id, name: settlement.name, population: settlement.population },
        groups,
        totalVulnerable,
        vulnerabilityPercent: Math.round((totalVulnerable / settlement.population) * 100),
        lowIncomePercent: Math.round((settlement.lowIncome / settlement.population) * 100),
      },
    });
  } catch (err) { next(err); }
};
