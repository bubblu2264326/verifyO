import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import { env } from './env.js';
const globalForPrisma = globalThis;
const pool = globalForPrisma.pgPool ??
    new pg.Pool({
        connectionString: env.databaseUrl,
    });
const adapter = new PrismaPg(pool);
const prisma = globalForPrisma.prisma ??
    new PrismaClient({
        adapter,
        log: env.nodeEnv === 'development' ? ['warn', 'error'] : ['error'],
    });
if (env.nodeEnv !== 'production') {
    globalForPrisma.pgPool = pool;
    globalForPrisma.prisma = prisma;
}
export default prisma;
