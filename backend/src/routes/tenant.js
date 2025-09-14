import express from 'express';
import { upgradeTenant, getTenantStats } from '../controllers/tenantController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticateToken);

router.get('/stats', getTenantStats);
router.post('/:slug/upgrade', requireAdmin, upgradeTenant);

export default router;