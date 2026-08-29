import Simulation from '../models/Simulation.js';
import Settlement from '../models/Settlement.js';
import SafeSite from '../models/SafeSite.js';
import { runSimulation } from '../services/simulation.service.js';
import { generateEmergencyPlan } from '../services/ai/ai.service.js';

export const runSimulationController = async (req, res, next) => {
  try {
    const { type, severity } = req.body;

    const [settlements, safeSites] = await Promise.all([
      Settlement.find({}),
      SafeSite.find({}),
    ]);

    const basePopulationAtRisk = settlements
      .filter(s => s.riskLevel === 'HIGH' || s.riskLevel === 'CRITICAL')
      .reduce((sum, s) => sum + s.population, 0);

    const baseCriticalZones = settlements.filter(s => s.riskLevel === 'CRITICAL').length;
    const totalSafeCapacity = safeSites.reduce((sum, s) => sum + (s.totalCapacity - s.occupiedCapacity), 0);
    const totalPopulation = settlements.reduce((sum, s) => sum + s.population, 0);

    const result = runSimulation(type, severity, {
      basePopulationAtRisk,
      baseCriticalZones,
      baseSafeCapacity: totalSafeCapacity,
      totalPopulation,
    });

    // Get AI emergency plan
    const aiPlan = await generateEmergencyPlan({ simulationResult: result });

    const simulation = await Simulation.create({
      name: `${type.toUpperCase()} - ${severity.toUpperCase()} scenario`,
      type,
      severity,
      baselinePopulationAtRisk: basePopulationAtRisk,
      baselineCriticalZones: baseCriticalZones,
      affectedPopulation: result.simulated.affectedPopulation,
      criticalZones: result.simulated.criticalZones,
      relocationDemand: result.simulated.relocationDemand,
      safeCapacity: result.simulated.safeCapacity,
      capacityGap: result.simulated.capacityGap,
      infrastructureStress: result.simulated.infrastructureStress,
      results: result,
      aiRecommendation: aiPlan.plan,
      createdBy: req.user?._id,
    });

    res.json({ success: true, data: { simulation, result, aiPlan } });
  } catch (err) { next(err); }
};

export const getSimulationById = async (req, res, next) => {
  try {
    const sim = await Simulation.findById(req.params.id);
    if (!sim) return res.status(404).json({ success: false, message: 'Simulation not found' });
    res.json({ success: true, data: sim });
  } catch (err) { next(err); }
};
