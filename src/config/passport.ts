import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { env } from './env';
import prisma from './prisma';
import { isDeepStrictEqual } from 'util';

interface GitHubProfile {
  id: string;
  username: string;
  emails?: Array<{ value: string }>;
}

interface User {
  id: number;
  githubId: string;
  username: string;
  email: string;
  accessToken?: string;
}

passport.serializeUser((user: Express.User, done) => {
  done(null, (user as User).id);
});

passport.deserializeUser(async (id: number, done: (err: any, user?: Express.User | false | null) => void) => {
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
    clientID: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    callbackURL: env.GITHUB_CALLBACK_URL
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
