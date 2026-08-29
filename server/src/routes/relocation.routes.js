import { Router } from 'express';
import {
  analyzeRelocationRoute,
  recommendRelocationSite,
  createRelocationPlan,
  getRelocationPlans,
  getRelocationPlanById,
} from '../controllers/relocation.controller.js';

const router = Router();
router.post('/analyze', analyzeRelocationRoute);
router.post('/recommend', recommendRelocationSite);
router.post('/create', createRelocationPlan);
router.get('/', getRelocationPlans);
router.get('/:id', getRelocationPlanById);
export default router;
