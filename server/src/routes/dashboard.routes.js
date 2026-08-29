import { Router } from 'express';
import { getOverview, getRiskSummary } from '../controllers/dashboard.controller.js';

const router = Router();
router.get('/overview', getOverview);
router.get('/risk-summary', getRiskSummary);
export default router;
