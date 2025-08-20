import dotenv from 'dotenv';
dotenv.config();

const requiredEnvVars = ['JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET', 'MONGO_URI'];

// Only require SMTP vars if not in development mode with disabled email
const isDevelopmentWithoutEmail = process.env.NODE_ENV === 'development' && process.env.DISABLE_EMAIL === 'true';

if (!isDevelopmentWithoutEmail) {
    requiredEnvVars.push('SMTP_HOST', 'SMTP_USER', 'SMTP_PASS');
}

for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required environment variable: ${envVar}`);
    }
}

export const env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
    MONGO_URI: process.env.MONGO_URI!,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET!,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET!,
    ACCESS_TOKEN_TTL: process.env.ACCESS_TOKEN_TTL || '15m',
    REFRESH_TOKEN_TTL: process.env.REFRESH_TOKEN_TTL || '7d',
    CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
    COOKIE_SECURE: process.env.COOKIE_SECURE === 'true',
    // Email settings
    SMTP_HOST: process.env.SMTP_HOST!,
    SMTP_PORT: process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587,
    SMTP_SECURE: process.env.SMTP_SECURE === 'true',
    SMTP_USER: process.env.SMTP_USER!,
    SMTP_PASS: process.env.SMTP_PASS!,
    EMAIL_FROM: process.env.EMAIL_FROM || process.env.SMTP_USER!,
    EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || 'Campus Syllabus Hub',
    FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
};
