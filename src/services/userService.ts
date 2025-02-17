import prisma from '../config/prisma';
import { User } from '@prisma/client';
import { CreateUserRequest } from '../types/user';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const createUser = async (data: CreateUserRequest): Promise<User> => {
  // バリデーション
  if (!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    throw new Error('Invalid email format');
  }
  if (data.username.length < 3) {
    throw new Error('Username must be at least 3 characters long');
  }

  // プロバイダーの確認
  if (!['github', 'gitlab'].includes(data.provider)) {
    throw new Error('Invalid provider');
  }

  return prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      name: data.name,
      [data.provider === 'github' ? 'githubId' : 'gitlabId']: data.providerId,
      accessToken: data.accessToken
    }
  });
};

export const getUserByEmail = async (email: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { email }
  });
};

export const getUserById = async (id: number): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { id }
  });
};

export const updateUser = async (
  id: number,
  data: Partial<CreateUserRequest>
): Promise<User> => {
  return prisma.user.update({
    where: { id },
    data
  });
};

export const getUserByGithubId = async (githubId: string): Promise<User | null> => {
  return prisma.user.findUnique({
    where: { githubId }
  });
};

export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, env.SESSION_SECRET, { expiresIn: '1h' });
};

export const verifyToken = (token: string): { userId: number } => {
  return jwt.verify(token, env.SESSION_SECRET) as { userId: number };
};
