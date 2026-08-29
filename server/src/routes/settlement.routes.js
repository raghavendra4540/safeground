import { Router } from 'express';
import { getSettlements, getSettlementById, getSettlementRisk, getSettlementVulnerability } from '../controllers/settlement.controller.js';

const router = Router();
router.get('/', getSettlements);
router.get('/:id', getSettlementById);
router.get('/:id/risk', getSettlementRisk);
router.get('/:id/vulnerability', getSettlementVulnerability);
export default router;
