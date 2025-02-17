import { z } from 'zod';

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string(),
  DB_USER: z.string(),
  DB_PASSWORD: z.string(),
  DB_NAME: z.string(),
  DB_PORT: z.string(),

  // Server
  PORT: z.string(),
  NODE_ENV: z.enum(['development', 'production', 'test']),

  // GitHub OAuth
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GITHUB_CALLBACK_URL: z.string(),

  // Session
  SESSION_SECRET: z.string(),
});

function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => err.path.join('.'));
      throw new Error(`Missing or invalid environment variables: ${missingVars.join(', ')}`);
    }
    throw error;
  }
}

export const env = validateEnv();
