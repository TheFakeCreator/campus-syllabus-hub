import app from './app.js';
import { connectDB } from './db/connect.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';

async function bootstrap() {
    try {
        await connectDB();

        const server = app.listen(env.PORT, () => {
            logger.info(`Server running on port ${env.PORT}`);
        });

        // Graceful shutdown
        process.on('SIGTERM', () => {
            logger.info('SIGTERM received, shutting down gracefully');
            server.close(() => {
                logger.info('Process terminated');
                process.exit(0);
            });
        });

        process.on('SIGINT', () => {
            logger.info('SIGINT received, shutting down gracefully');
            server.close(() => {
                logger.info('Process terminated');
                process.exit(0);
            });
        });

    } catch (error) {
        logger.error({ error }, 'Failed to start server');
        process.exit(1);
    }
}

bootstrap();
