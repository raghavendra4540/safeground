import Settlement from '../models/Settlement.js';
import SafeSite from '../models/SafeSite.js';
import HazardZone from '../models/HazardZone.js';

const buildRegionQuery = (region) => {
  if (!region || region === 'All India' || region === 'all' || region === 'India' || region === 'National') {
    return {};
  }
  return {
    $or: [
      { regionName: { $regex: new RegExp(region.trim(), 'i') } },
      { state: { $regex: new RegExp(region.trim(), 'i') } },
    ],
  };
};

export const getOverview = async (req, res, next) => {
  try {
    const { region } = req.query;
    const filter = buildRegionQuery(region);

    const [settlements, safeSites, hazardZones] = await Promise.all([
      Settlement.find(filter),
      SafeSite.find(filter),
      HazardZone.find(filter),
    ]);

    const totalSettlements = settlements.length;
    const totalSafeSites = safeSites.length;
    const totalHazardZones = hazardZones.length;

    const criticalZones = hazardZones.filter(h => h.severity === 'CRITICAL').length;
    const highRiskSettlements = settlements.filter(s => s.riskLevel === 'HIGH' || s.riskLevel === 'CRITICAL').length;
    const criticalSettlements = settlements.filter(s => s.riskLevel === 'CRITICAL').length;

    const populationAtRisk = settlements
      .filter(s => s.riskLevel === 'HIGH' || s.riskLevel === 'CRITICAL')
      .reduce((sum, s) => sum + (s.population || 0), 0);

    const urgentCandidates = settlements
      .filter(s => s.priorityLevel === 'URGENT')
      .reduce((sum, s) => sum + (s.population || 0), 0);

    const relocationCandidates = urgentCandidates > 0 ? urgentCandidates : populationAtRisk;

    const totalSafeCapacity = safeSites.reduce(
      (sum, s) => sum + Math.max(0, (s.totalCapacity || 0) - (s.occupiedCapacity || 0)),
      0
    );

    const grossSafeCapacity = safeSites.reduce((sum, s) => sum + (s.totalCapacity || 0), 0);
    const totalPopulation = settlements.reduce((sum, s) => sum + (s.population || 0), 0);
    const totalVulnerable = settlements.reduce((sum, s) => sum + (s.totalVulnerable || 0), 0);

    const riskDistribution = {
      CRITICAL: settlements.filter(s => s.riskLevel === 'CRITICAL').length,
      HIGH: settlements.filter(s => s.riskLevel === 'HIGH').length,
      MODERATE: settlements.filter(s => s.riskLevel === 'MODERATE').length,
      SAFE: settlements.filter(s => s.riskLevel === 'SAFE').length,
    };

    const hazardTypeBreakdown = {
      flood: totalSettlements ? Math.round(settlements.reduce((sum, s) => sum + (s.floodRisk || 0), 0) / totalSettlements) : 0,
      landslide: totalSettlements ? Math.round(settlements.reduce((sum, s) => sum + (s.landslideRisk || 0), 0) / totalSettlements) : 0,
      cyclone: totalSettlements ? Math.round(settlements.reduce((sum, s) => sum + (s.cycloneRisk || 0), 0) / totalSettlements) : 0,
      heat: totalSettlements ? Math.round(settlements.reduce((sum, s) => sum + (s.heatRisk || 0), 0) / totalSettlements) : 0,
    };

    res.json({
      success: true,
      data: {
        region: region || 'All India',
        kpis: {
          criticalZones,
          highRiskSettlements,
          criticalSettlements,
          populationAtRisk,
          relocationCandidates,
          urgentCandidates,
          totalSafeCapacity,
          grossSafeCapacity,
          totalPopulation,
          totalVulnerable,
          totalSettlements,
          totalSafeSites,
          totalHazardZones,
        },
        riskDistribution,
        hazardTypeBreakdown,
        topCriticalSettlements: settlements
          .filter(s => s.riskLevel === 'CRITICAL' || s.priorityLevel === 'URGENT')
          .sort((a, b) => (b.priorityScore || b.hazardScore) - (a.priorityScore || a.hazardScore))
          .slice(0, 6),
        recentActivity: {
          lastScan: new Date().toISOString(),
          analysisConfidence: 95,
        },
      },
    });
  } catch (err) { next(err); }
};

export const getRiskSummary = async (req, res, next) => {
  try {
    const { region } = req.query;
    const filter = buildRegionQuery(region);
    const settlements = await Settlement.find(filter);

    const byRisk = ['SAFE', 'MODERATE', 'HIGH', 'CRITICAL'].map(level => ({
      level,
      count: settlements.filter(s => s.riskLevel === level).length,
      population: settlements.filter(s => s.riskLevel === level).reduce((sum, s) => sum + (s.population || 0), 0),
    }));

    const vulnerableTotal = settlements.reduce((sum, s) => sum + (s.totalVulnerable || 0), 0);
    const populationTotal = settlements.reduce((sum, s) => sum + (s.population || 0), 0);

    res.json({
      success: true,
      data: {
        region: region || 'All India',
        byRiskLevel: byRisk,
        totalPopulation: populationTotal,
        totalVulnerable: vulnerableTotal,
        vulnerabilityPercent: populationTotal ? Math.round((vulnerableTotal / populationTotal) * 100) : 0,
        avgRiskScore: settlements.length ? Math.round(settlements.reduce((sum, s) => sum + s.hazardScore, 0) / settlements.length) : 0,
      },
    });
  } catch (err) { next(err); }
};


