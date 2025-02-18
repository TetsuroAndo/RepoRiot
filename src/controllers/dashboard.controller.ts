import { Request, Response } from 'express';
import { DashboardService } from '../services/dashboard.service';
import { User } from '../types/user';

export class DashboardController {
  private dashboardService: DashboardService;

  constructor() {
    this.dashboardService = new DashboardService();
  }

  async getDashboard(req: Request, res: Response): Promise<void> {
    try {
      const user = req.user as User;
      const dashboardData = await this.dashboardService.getDashboardData(user.id);
      res.json(dashboardData);
    } catch (error) {
      console.error('Error in getDashboard:', error);
      res.status(500).json({
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'An unexpected error occurred'
        }
      });
    }
  }
}
