declare module 'passport-gitlab2' {
  import { Strategy as PassportStrategy } from 'passport';
  import { Request } from 'express';

  export interface StrategyOptions {
    clientID: string;
    clientSecret: string;
    callbackURL: string;
    baseURL?: string;
    scope?: string[];
  }

  export interface StrategyOptionsWithRequest extends StrategyOptions {
    passReqToCallback: true;
  }

  export interface Profile {
    provider: string;
    id: string;
    username: string;
    displayName: string;
    name: {
      familyName: string;
      givenName: string;
      middleName?: string;
    };
    emails: Array<{
      value: string;
      type?: string;
    }>;
    photos: Array<{
      value: string;
    }>;
    _raw: string;
    _json: any;
  }

  export type VerifyFunction = (
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void
  ) => void;

  export type VerifyFunctionWithRequest = (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (error: any, user?: any, info?: any) => void
  ) => void;

  export class Strategy extends PassportStrategy {
    constructor(options: StrategyOptions, verify: VerifyFunction);
    constructor(options: StrategyOptionsWithRequest, verify: VerifyFunctionWithRequest);
    name: string;
    authenticate(req: Request, options?: any): void;
  }
}
