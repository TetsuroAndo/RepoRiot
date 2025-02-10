import prisma from '../config/prisma';
import { Repo } from '@prisma/client';

export const createRepo = async (data: {
  name: string;
  description?: string;
  url: string;
  userId: number;
  language?: string;
}): Promise<Repo> => {
  return prisma.repo.create({
    data
  });
};

export const getRepoById = async (id: number): Promise<Repo | null> => {
  return prisma.repo.findUnique({
    where: { id },
    include: { user: true }
  });
};

export const getUserRepos = async (userId: number): Promise<Repo[]> => {
  return prisma.repo.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
};

export const updateRepo = async (
  id: number,
  data: {
    name?: string;
    description?: string;
    url?: string;
    stars?: number;
    forks?: number;
    language?: string;
  }
): Promise<Repo> => {
  return prisma.repo.update({
    where: { id },
    data
  });
};
