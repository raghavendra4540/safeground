import { Router } from 'express';
import { getSafeSites, getSafeSiteById, getRecommendedSites } from '../controllers/safeSite.controller.js';

const router = Router();
router.get('/', getSafeSites);
router.get('/recommended/:settlementId', getRecommendedSites);
router.get('/:id', getSafeSiteById);
export default router;
