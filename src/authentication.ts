import { Request, Response } from 'express';
import { User } from './types/user';
import { ExpressAuthenticationFunction } from './types/authentication';

export function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[],
  response?: Response
): Promise<User> {
  if (securityName === 'jwt') {
    return new Promise((resolve, reject) => {
      if (!request.user) {
        return reject(new Error('Not authenticated'));
      }
      return resolve(request.user as User);
    });
  }
  return Promise.reject(new Error('Invalid security name'));
}

export const expressAuthenticationRecasted: ExpressAuthenticationFunction = (
  request: Request,
  name: string,
  scopes: string[],
  response?: Response
) => expressAuthentication(request, name, scopes, response);
