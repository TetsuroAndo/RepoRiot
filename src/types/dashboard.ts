export interface DashboardUserProfile {
  id: number;
  username: string;
  email: string;
  avatarUrl: string | null;
  name: string | null;
}

export interface DashboardRepository {
  id: number;
  name: string;
  description: string | null;
  url: string;
  stars: number;
  forks: number;
  language: string | null;
  updatedAt: Date;
}

export interface DashboardArticle {
  id: number;
  title: string;
  repoId: number;
  repoName: string;
  createdAt: Date;
  updatedAt: Date;
  statistics: {
    views: number;
    likes: number;
  };
}

export interface DashboardSubscription {
  plan: string;
  status: string;
  startDate: Date;
  endDate: Date | null;
}

export interface DashboardStatistics {
  totalArticleViews: number;
  totalArticleLikes: number;
  totalRepoStars: number;
}

export interface DashboardResponse {
  user: DashboardUserProfile;
  repositories: {
    total: number;
    recent: DashboardRepository[];
  };
  articles: {
    total: number;
    recent: DashboardArticle[];
  };
  subscription: DashboardSubscription;
  statistics: DashboardStatistics;
}
