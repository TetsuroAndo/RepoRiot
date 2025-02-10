import prisma from '../config/prisma';
import { User } from '@prisma/client';

export const createUser = async (data: {
  email: string;
  name?: string;
  password: string;
}): Promise<User> => {
  return prisma.user.create({
    data
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
  data: {
    email?: string;
    name?: string;
    password?: string;
  }
): Promise<User> => {
  return prisma.user.update({
    where: { id },
    data
  });
};
