import { User } from '../types/user';

export function transformUser(user: User): User {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    githubId: user.githubId || null,
    gitlabId: user.gitlabId || null,
    accessToken: user.accessToken || null,
    name: user.name || null,
    avatarUrl: user.avatarUrl || null,
    password: user.password || null,
    provider: user.provider || null,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt
  };
}
