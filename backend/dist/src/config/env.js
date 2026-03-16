import dotenv from 'dotenv';
import { z } from 'zod';
dotenv.config();
const envSchema = z.object({
    DATABASE_URL: z.string().min(1),
    JWT_SECRET: z.string().min(16),
    PORT: z.coerce.number().int().positive().default(5000),
    NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
    FRONTEND_ORIGIN: z.string().url().default('http://localhost:3000'),
    JWT_EXPIRES_IN: z.string().default('1d'),
    COOKIE_NAME: z.string().default('verifyo_token'),
    BCRYPT_SALT_ROUNDS: z.coerce.number().int().min(8).max(14).default(12),
    MAX_UPLOAD_SIZE_MB: z.coerce.number().int().positive().max(100).default(100),
    SUPABASE_URL: z.string().url(),
    SUPABASE_SERVICE_KEY: z.string().min(1),
    SUPABASE_BUCKET: z.string().default('documents'),
});
export function getEnv() {
    const parsed = envSchema.safeParse(process.env);
    if (!parsed.success) {
        throw new Error(`Invalid environment configuration: ${parsed.error.message}`);
    }
    const data = parsed.data;
    return {
        databaseUrl: data.DATABASE_URL,
        jwtSecret: data.JWT_SECRET,
        port: data.PORT,
        nodeEnv: data.NODE_ENV,
        frontendOrigin: data.FRONTEND_ORIGIN,
        jwtExpiresIn: data.JWT_EXPIRES_IN,
        cookieName: data.COOKIE_NAME,
        bcryptSaltRounds: data.BCRYPT_SALT_ROUNDS,
        maxUploadSizeBytes: data.MAX_UPLOAD_SIZE_MB * 1024 * 1024,
        supabase: {
            url: data.SUPABASE_URL,
            serviceKey: data.SUPABASE_SERVICE_KEY,
            bucket: data.SUPABASE_BUCKET,
        },
    };
}
export const env = getEnv();
