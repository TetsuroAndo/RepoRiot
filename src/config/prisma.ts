import { PrismaClient } from '@prisma/client'
import { env } from './env';

// PrismaClient のインスタンスをグローバルに保持
declare global {
  var prisma: PrismaClient | undefined;
}

// 開発環境での hot reload 対策として globalThis を使用
const prisma = globalThis.prisma || new PrismaClient({
  datasources: {
    db: {
      url: env.DATABASE_URL
    }
  },
  log: ['query', 'error', 'warn']
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
