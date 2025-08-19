import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
    const isProd = process.env.NODE_ENV === 'production';
    const requestId = req.headers['x-request-id'] || (req as any).id;

    // Zod validation error
    if (err instanceof ZodError) {
        return res.status(400).json({
            message: 'Validation error',
            errors: err.errors,
            requestId,
        });
    }

    // Auth errors
    if (err.name === 'UnauthorizedError' || err.status === 401) {
        return res.status(401).json({ message: 'Unauthorized', requestId });
    }
    if (err.status === 403) {
        return res.status(403).json({ message: 'Forbidden', requestId });
    }

    // Fallback
    if (!isProd) {
        console.error(err);
    }
    res.status(err.status || 500).json({
        message: err.message || 'Internal Server Error',
        requestId,
        ...(isProd ? {} : { stack: err.stack }),
    });
}
