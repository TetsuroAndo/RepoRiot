import { PrismaClient } from '@prisma/client';
import { DashboardService } from '../dashboard.service';
import { mockDeep, mockReset } from 'jest-mock-extended';

jest.mock('@prisma/client');

describe('DashboardService', () => {
  const mockPrisma = mockDeep<PrismaClient>();
  let dashboardService: DashboardService;

  beforeEach(() => {
    mockReset(mockPrisma);
    dashboardService = new DashboardService();
    // @ts-ignore
    dashboardService['prisma'] = mockPrisma;
  });

  describe('getDashboardData', () => {
    const userId = 1;
    const mockUser = {
      id: userId,
      username: 'testuser',
      email: 'test@example.com',
      avatarUrl: 'https://example.com/avatar.jpg',
      name: 'Test User'
    };

    const mockRepos = {
      total: 2,
      recent: [
        {
          id: 1,
          name: 'repo1',
          description: 'description1',
          url: 'https://github.com/repo1',
          stars: 10,
          forks: 5,
          language: 'TypeScript',
          updatedAt: new Date()
        }
      ]
    };

    const mockArticles = {
      total: 1,
      recent: [
        {
          id: 1,
          title: 'Article 1',
          repoId: 1,
          repoName: 'repo1',
          createdAt: new Date(),
          updatedAt: new Date(),
          statistics: {
            views: 100,
            likes: 50
          }
        }
      ]
    };

    it('should return dashboard data successfully', async () => {
      // Mock user
      mockPrisma.user.findUnique.mockResolvedValue(mockUser);

      // Mock repos
      mockPrisma.repo.count.mockResolvedValue(mockRepos.total);
      mockPrisma.repo.findMany.mockResolvedValue(mockRepos.recent);

      // Mock articles
      mockPrisma.article.count.mockResolvedValue(mockArticles.total);
      mockPrisma.article.findMany.mockResolvedValue([{
        ...mockArticles.recent[0],
        repository: { name: 'repo1' },
        statistics: mockArticles.recent[0].statistics
      }]);

      // Mock subscription
      mockPrisma.subscription.findFirst.mockResolvedValue({
        plan: 'Premium',
        status: 'Active',
        startDate: new Date(),
        endDate: null
      });

      // Mock statistics
      mockPrisma.statistics.aggregate.mockResolvedValue({
        _sum: { views: 100, likes: 50 }
      });
      mockPrisma.repo.aggregate.mockResolvedValue({
        _sum: { stars: 10 }
      });

      const result = await dashboardService.getDashboardData(userId);

      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('repositories');
      expect(result).toHaveProperty('articles');
      expect(result).toHaveProperty('subscription');
      expect(result).toHaveProperty('statistics');
    });

    it('should throw error when user not found', async () => {
      mockPrisma.user.findUnique.mockResolvedValue(null);

      await expect(dashboardService.getDashboardData(userId))
        .rejects
        .toThrow('User not found');
    });
  });
});
