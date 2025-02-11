import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { PrismaClient } from '@prisma/client';
import { isDeepStrictEqual } from 'util';

interface GitHubProfile {
  id: string;
  username: string;
  emails: Array<{ value: string }>;
}

interface User {
  id: number;
  githubId: string;
  username: string;
  email: string;
  accessToken?: string;
}

const prisma = new PrismaClient();

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as User).id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID ?? '',
    clientSecret: process.env.GITHUB_CLIENT_SECRET ?? '',
    callbackURL: process.env.GITHUB_CALLBACK_URL ?? 'http://localhost:3000/auth/github/callback'
  },
  async (accessToken: string, refreshToken: string, profile: GitHubProfile, done: (error: any, user?: any) => void) => {
    try {
      const email = profile.emails?.[0]?.value;
      if (!email) {
        return done(new Error('Email not found in GitHub profile'));
      }

      let user = await prisma.user.findUnique({
        where: { githubId: profile.id }
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            githubId: profile.id,
            username: profile.username,
            email,
            accessToken
          }
        });
      } else {
        // Only update if access token has changed
        if (!isDeepStrictEqual(user.accessToken, accessToken)) {
          user = await prisma.user.update({
            where: { id: user.id },
            data: { accessToken }
          });
        }
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));
