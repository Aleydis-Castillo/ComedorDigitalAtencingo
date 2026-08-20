import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaClient } from '../../generated/prisma/client';

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    'La variable DATABASE_URL no está configurada en el archivo .env.',
  );
}

const adapter = new PrismaPg({
  connectionString: databaseUrl,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ['warn', 'error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;