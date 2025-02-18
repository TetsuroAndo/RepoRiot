import { PrismaClient } from '@prisma/client';
import { DashboardResponse } from '../types/dashboard';

export class DashboardService {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async getDashboardData(userId: number): Promise<DashboardResponse> {
    const [
      user,
      repositories,
      articles,
      subscription,
      statistics
    ] = await Promise.all([
      this.getUserProfile(userId),
      this.getRepositories(userId),
      this.getArticles(userId),
      this.getSubscription(userId),
      this.getStatistics(userId)
    ]);

    return {
      user,
      repositories,
      articles,
      subscription,
      statistics
    };
  }

  private async getUserProfile(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        avatarUrl: true,
        name: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  private async getRepositories(userId: number) {
    const [total, recent] = await Promise.all([
      this.prisma.repo.count({
        where: { userId }
      }),
      this.prisma.repo.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          description: true,
          url: true,
          stars: true,
          forks: true,
          language: true,
          updatedAt: true
        },
        orderBy: { updatedAt: 'desc' },
        take: 5
      })
    ]);

    return { total, recent };
  }

  private async getArticles(userId: number) {
    const [total, recent] = await Promise.all([
      this.prisma.article.count({
        where: {
          repository: {
            userId
          }
        }
      }),
      this.prisma.article.findMany({
        where: {
          repository: {
            userId
          }
        },
        select: {
          id: true,
          title: true,
          repoId: true,
          repository: {
            select: {
              name: true
            }
          },
          createdAt: true,
          updatedAt: true,
          statistics: {
            select: {
              views: true,
              likes: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        take: 5
      })
    ]);

    const recentArticles = recent.map(article => ({
      ...article,
      repoName: article.repository.name,
      statistics: article.statistics || { views: 0, likes: 0 }
    }));

    return { total, recent: recentArticles };
  }

  private async getSubscription(userId: number) {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
        status: 'Active'
      },
      orderBy: {
        startDate: 'desc'
      },
      select: {
        plan: true,
        status: true,
        startDate: true,
        endDate: true
      }
    });

    return subscription || {
      plan: 'Free',
      status: 'Active',
      startDate: new Date(),
      endDate: null
    };
  }

  private async getStatistics(userId: number) {
    const [articleStats, repoStats] = await Promise.all([
      this.prisma.statistics.aggregate({
        where: {
          article: {
            repository: {
              userId
            }
          }
        },
        _sum: {
          views: true,
          likes: true
        }
      }),
      this.prisma.repo.aggregate({
        where: { userId },
        _sum: {
          stars: true
        }
      })
    ]);

    return {
      totalArticleViews: articleStats._sum.views || 0,
      totalArticleLikes: articleStats._sum.likes || 0,
      totalRepoStars: repoStats._sum.stars || 0
    };
  }
}
