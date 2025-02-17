import { Request, Response } from 'express';
import { User } from './user';

export type AuthenticationResponse = Response | void;

export type ExpressAuthenticationFunction = (
  request: Request,
  name: string,
  scopes: string[],
  response?: Response
) => Promise<User>;

import type { User as PrismaUser } from '@prisma/client';

declare global {
  namespace Express {
    // Prisma の User 型をベースにした Session User 型
    interface User extends Omit<PrismaUser, 'password'> {
      password?: string | null;
    }
  }
}
