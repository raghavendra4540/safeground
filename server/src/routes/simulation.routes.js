import { Router } from 'express';
import { runSimulationController, getSimulationById } from '../controllers/simulation.controller.js';

const router = Router();
router.post('/run', runSimulationController);
router.get('/:id', getSimulationById);
export default router;
