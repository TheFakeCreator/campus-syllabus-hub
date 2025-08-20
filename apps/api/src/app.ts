import { errorHandler } from './middleware/error.js';
import express from 'express';
import { applySecurityMiddleware, authRateLimiter, searchRateLimiter } from './middleware/security.js';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import xssClean from 'xss-clean';
import mongoSanitize from 'express-mongo-sanitize';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import pino from 'pino-http';
import dotenv from 'dotenv';
import authRoutes from './features/auth/auth.routes.js';
import userRoutes from './features/users/user.routes.js';
import catalogRoutes from './features/catalog/catalog.routes.js';
import subjectRouter from './features/catalog/subject.routes.js';
import resourceRoutes from './features/resources/resource.routes.js';
import searchRoutes from './features/search/search.routes.js';
import roadmapRoutes from './features/roadmaps/roadmap.routes.js';
import ratingRoutes from './features/ratings/rating.routes.js';
import adminRoutes from './features/admin/admin.routes.js';

dotenv.config();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
applySecurityMiddleware(app);
app.use(pino.default());

const apiV1 = express.Router();

// Apply rate limiters to specific routes
apiV1.use('/auth', authRateLimiter);
apiV1.use('/search', searchRateLimiter);

// Mount routes
apiV1.use('/auth', authRoutes);
apiV1.use('/users', userRoutes);
apiV1.use('/catalog', catalogRoutes);
apiV1.use('/subjects', subjectRouter);
apiV1.use('/resources', resourceRoutes);
apiV1.use('/search', searchRoutes);
apiV1.use('/roadmaps', roadmapRoutes);
apiV1.use('/ratings', ratingRoutes);
apiV1.use('/admin', adminRoutes);

// Health check endpoint
app.get('/healthz', (req, res) => {
    res.json({
        status: 'ok',
        time: new Date().toISOString()
    });
});

app.use('/api/v1', apiV1);

// Centralized error handler
app.use(errorHandler);

export default app;
