import { Request, Response } from 'express';
import { User } from './user';

export type AuthenticationResponse = Response | void;

export type ExpressAuthenticationFunction = (
  request: Request,
  name: string,
  scopes: string[],
  response?: Response
) => Promise<User>;

declare global {
  namespace Express {
    interface User {
      id: number;
      email: string;
      username: string;
      githubId: string | null;
      accessToken: string | null;
      name: string | null;
      password: string | null;
      createdAt: Date;
      updatedAt: Date;
    }
  }
}
