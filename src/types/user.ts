import type { User as PrismaUser } from '@prisma/client';

// PrismaのUser型をベースにしたアプリケーションのUser型
export type User = PrismaUser;

export interface CreateUserRequest {
  provider: 'github' | 'gitlab';
  providerId: string;
  accessToken: string;
  email: string;  // format: email
  username: string;  // minLength: 3
  name?: string;
}

export interface AuthResponse {
  user: User;
  message: string;
  token: string;
}
