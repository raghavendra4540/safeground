import { Router } from 'express';
import { getHazards, getHazardsByType } from '../controllers/hazard.controller.js';

const router = Router();
router.get('/', getHazards);
router.get('/:type', getHazardsByType);
export default router;
