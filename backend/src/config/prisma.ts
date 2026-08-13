import dotenv from 'dotenv';
import path from 'path';

// Carrega variáveis de ambiente garantindo que funcione tanto localmente quanto no deploy
dotenv.config();
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

import { PrismaClient } from '@prisma/client';

const getDatabaseUrl = (): string | undefined => {
  return process.env.DATABASE_URL;
};

// Singleton para garantir apenas uma instância do Prisma Client
const prismaClientSingleton = () => {
  const dbUrl = getDatabaseUrl();

  if (!dbUrl) {
    console.warn(
      '⚠️ [Prisma Warning]: DATABASE_URL não foi encontrada em process.env. Verifique o arquivo .env ou as variáveis de ambiente na Vercel.'
    );
  }

  return new PrismaClient({
    datasources: dbUrl
      ? {
          db: {
            url: dbUrl,
          },
        }
      : undefined,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  });
};

declare global {
  // eslint-disable-next-line no-var
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton>;
}

export const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prismaGlobal = prisma;
}
