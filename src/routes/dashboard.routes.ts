import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const dashboardController = new DashboardController();

router.get(
  '/',
  authenticateToken,
  (req, res) => dashboardController.getDashboard(req, res)
);

export default router;
