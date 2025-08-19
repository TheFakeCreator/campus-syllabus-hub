import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import xssClean from 'xss-clean';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { env } from '../config/env.js';

export function applySecurityMiddleware(app: any) {
    app.use(helmet());
    app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
    app.use(mongoSanitize());
    app.use(xssClean());
    app.use(compression());
    app.use(cookieParser());
    if (env.NODE_ENV === 'production') {
        app.set('trust proxy', 1);
    }
}

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many requests, please try again later.'
});

export const searchRateLimiter = rateLimit({
    windowMs: 5 * 60 * 1000,
    max: 50,
    message: 'Too many search requests, please try again later.'
});
