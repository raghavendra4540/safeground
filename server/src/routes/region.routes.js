import { Router } from 'express';
import { getRegions, getRegionByName } from '../controllers/region.controller.js';

const router = Router();

router.get('/', getRegions);
router.get('/:name', getRegionByName);

export default router;
