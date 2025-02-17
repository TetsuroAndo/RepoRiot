import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as GitLabStrategy } from 'passport-gitlab2';
import { env } from './env';
import prisma from './prisma';
import logger from '../utils/logger';
import { User as PrismaUser } from '@prisma/client';
import { Profile as GitHubProfile } from 'passport-github2';
import { Profile as GitLabProfile } from 'passport-gitlab2';

interface OAuthProfile {
  id: string;
  username?: string;
  displayName?: string;
  emails?: Array<{ value: string }>;
  photos?: Array<{ value: string }>;
  provider: 'github' | 'gitlab';
}

type User = PrismaUser;

passport.serializeUser((user, done) => {
  try {
    done(null, user.id);
  } catch (error) {
    logger.error('Error serializing user:', error);
    done(error, null);
  }
});

passport.deserializeUser(async (id: number, done: (err: any, user?: Express.User | false | null) => void) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        username: true,
        githubId: true,
        gitlabId: true,
        name: true,
        avatarUrl: true,
        accessToken: true,
        provider: true
      }
    });

    if (!user) {
      logger.warn(`User not found for id: ${id}`);
      return done(null, false);
    }

    done(null, user);
  } catch (error) {
    logger.error('Error deserializing user:', error);
    done(error, null);
  }
});

async function handleOAuthProfile(
  accessToken: string,
  refreshToken: string,
  profile: OAuthProfile,
  done: (error: any, user?: any) => void
) {
  try {
    const email = profile.emails?.[0]?.value;
    if (!email) {
      return done(new Error('No email found in profile'));
    }

    const avatarUrl = profile.photos?.[0]?.value;
    const username = profile.username || profile.displayName || email.split('@')[0];
    
    const updateData: any = {
      email,
      username,
      name: profile.displayName || username,
      avatarUrl,
      accessToken,
      provider: profile.provider,
    };

    if (profile.provider === 'github') {
      updateData.githubId = profile.id;
    } else if (profile.provider === 'gitlab') {
      updateData.gitlabId = profile.id;
    }

    const user = await prisma.user.upsert({
      where: {
        email,
      },
      update: updateData,
      create: updateData,
    });

    done(null, user);
  } catch (error) {
    logger.error('Error in OAuth callback:', error);
    done(error);
  }
}

passport.use(new GitHubStrategy(
  {
    clientID: env.GITHUB_CLIENT_ID,
    clientSecret: env.GITHUB_CLIENT_SECRET,
    callbackURL: env.GITHUB_CALLBACK_URL,
    scope: ['user:email', 'read:user']
  },
  async (accessToken: string, refreshToken: string, profile: GitHubProfile, done: (error: any, user?: any) => void) => {
    await handleOAuthProfile(accessToken, refreshToken, { ...profile, provider: 'github' }, done);
  }
));

passport.use(new GitLabStrategy(
  {
    clientID: env.GITLAB_CLIENT_ID,
    clientSecret: env.GITLAB_CLIENT_SECRET,
    callbackURL: env.GITLAB_CALLBACK_URL,
    scope: ['read_user']
  },
  async (accessToken: string, refreshToken: string, profile: GitLabProfile, done: (error: any, user?: any) => void) => {
    await handleOAuthProfile(accessToken, refreshToken, { ...profile, provider: 'gitlab' }, done);
  }
));
