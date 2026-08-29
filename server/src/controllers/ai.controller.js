import Settlement from '../models/Settlement.js';
import SafeSite from '../models/SafeSite.js';
import { calculateRiskScore } from '../services/risk.service.js';
import { calculatePriorityScore } from '../services/priority.service.js';
import { analyzeRelocation } from '../services/relocation.service.js';
import * as aiService from '../services/ai/ai.service.js';

export const analyzeRisk = async (req, res, next) => {
  try {
    const { settlementId } = req.body;
    const settlement = await Settlement.findById(settlementId);
    if (!settlement) return res.status(404).json({ success: false, message: 'Settlement not found' });

    const riskResult = calculateRiskScore(settlement);
    const priorityResult = calculatePriorityScore(settlement);

    const nearestSafeSites = await SafeSite.find({}).sort({ safetyScore: -1 }).limit(5);

    const aiResult = await aiService.analyzeRisk({
      settlement,
      riskResult,
      priorityResult,
      nearestSafeSites,
    });

    res.json({
      success: true,
      data: {
        settlement,
        riskResult,
        priorityResult,
        aiExplanation: aiResult,
      },
    });
  } catch (err) { next(err); }
};

export const recommendSite = async (req, res, next) => {
  try {
    const { settlementId, priorities } = req.body;
    const settlement = await Settlement.findById(settlementId);
    if (!settlement) return res.status(404).json({ success: false, message: 'Settlement not found' });

    const safeSites = await SafeSite.find({});
    const relocationAnalysis = analyzeRelocation(settlement, safeSites, priorities || {});
    const aiResult = await aiService.recommendRelocation(relocationAnalysis);

    res.json({
      success: true,
      data: {
        ...relocationAnalysis,
        aiRecommendation: aiResult,
      },
    });
  } catch (err) { next(err); }
};

export const relocationPlan = async (req, res, next) => {
  try {
    const { settlementId, siteId } = req.body;
    const [settlement, site] = await Promise.all([
      Settlement.findById(settlementId),
      SafeSite.findById(siteId),
    ]);
    if (!settlement || !site) return res.status(404).json({ success: false, message: 'Not found' });

    const riskResult = calculateRiskScore(settlement);
    const aiResult = await aiService.generateEmergencyPlan({
      settlement,
      riskResult,
      destinationSite: site,
    });

    res.json({ success: true, data: { settlement, site, aiPlan: aiResult } });
  } catch (err) { next(err); }
};

export const emergencyPlan = async (req, res, next) => {
  try {
    const { settlementId, simulationResult } = req.body;
    let settlement = null;
    let riskResult = null;

    if (settlementId) {
      settlement = await Settlement.findById(settlementId);
      if (settlement) riskResult = calculateRiskScore(settlement);
    }

    const aiResult = await aiService.generateEmergencyPlan({ settlement, riskResult, simulationResult });
    res.json({ success: true, data: aiResult });
  } catch (err) { next(err); }
};

export const generateReport = async (req, res, next) => {
  try {
    const { region = 'Telangana' } = req.body;

    const [settlements, safeSites] = await Promise.all([
      Settlement.find({}).sort({ hazardScore: -1 }),
      SafeSite.find({}).sort({ safetyScore: -1 }),
    ]);

    const stats = {
      populationAtRisk: settlements.filter(s => ['HIGH', 'CRITICAL'].includes(s.riskLevel)).reduce((sum, s) => sum + s.population, 0),
      criticalZones: settlements.filter(s => s.riskLevel === 'CRITICAL').length,
      highRiskSettlements: settlements.filter(s => ['HIGH', 'CRITICAL'].includes(s.riskLevel)).length,
      safeSitesCount: safeSites.length,
      totalSafeCapacity: safeSites.reduce((sum, s) => sum + (s.totalCapacity - s.occupiedCapacity), 0),
    };

    const aiResult = await aiService.generateReport({
      region,
      stats,
      topSettlements: settlements.slice(0, 8),
      topSafeSites: safeSites.slice(0, 5),
    });

    res.json({ success: true, data: { region, stats, content: aiResult.content, aiMeta: { confidence: aiResult.confidence, source: aiResult.source } } });
  } catch (err) { next(err); }
};

export const getAIStatus = (req, res) => {
  res.json({ success: true, data: aiService.getAIStatus() });
};
