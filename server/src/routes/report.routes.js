import { Router } from 'express';
import { getReports, getReportById } from '../controllers/report.controller.js';

const router = Router();
router.get('/', getReports);
router.get('/:id', getReportById);
export default router;
