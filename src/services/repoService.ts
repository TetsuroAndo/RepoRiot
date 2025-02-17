import prisma from '../config/prisma';
import { Repo } from '@prisma/client';

export const createRepo = async (data: {
  name: string;
  description?: string;
  url: string;
  userId: number;
  stars?: number;
  forks?: number;
  language?: string;
}): Promise<Repo> => {
  return prisma.repo.create({
    data
  });
};

export const getRepoById = async (id: number): Promise<Repo | null> => {
  return prisma.repo.findUnique({
    where: { id },
    include: {
      user: true,
      tags: true
    }
  });
};

export const getUserRepos = async (userId: number): Promise<Repo[]> => {
  return prisma.repo.findMany({
    where: { userId },
    include: {
      tags: true
    }
  });
};

export const updateRepo = async (id: number, data: Partial<Repo>): Promise<Repo> => {
  return prisma.repo.update({
    where: { id },
    data
  });
};

export const deleteRepo = async (id: number): Promise<void> => {
  await prisma.repo.delete({
    where: { id }
  });
};
