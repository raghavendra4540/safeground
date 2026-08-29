import { Router } from 'express';
import {
  analyzeRisk,
  recommendSite,
  relocationPlan,
  emergencyPlan,
  generateReport,
  getAIStatus,
} from '../controllers/ai.controller.js';

const router = Router();
router.get('/status', getAIStatus);
router.post('/analyze-risk', analyzeRisk);
router.post('/recommend-site', recommendSite);
router.post('/relocation-plan', relocationPlan);
router.post('/emergency-plan', emergencyPlan);
router.post('/report', generateReport);
export default router;
