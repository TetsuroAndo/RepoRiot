import prisma from '../config/prisma';
import { User } from '@prisma/client';
import { CreateUserRequest } from '../types/user';

export const createUser = async (data: CreateUserRequest): Promise<User> => {
  return prisma.user.create({
    data: {
      email: data.email,
      username: data.username,
      password: data.password,
      name: data.name
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
