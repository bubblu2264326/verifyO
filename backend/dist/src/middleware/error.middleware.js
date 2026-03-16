import { MulterError } from 'multer';
import { ZodError } from 'zod';
import { ApiError } from '../utils/apiError.js';
import { logger } from '../utils/logger.js';
export function notFoundHandler(_req, _res, next) {
    next(new ApiError(404, 'Route not found', 'NOT_FOUND'));
}
export function errorHandler(error, _req, res, _next) {
    if (error instanceof ApiError) {
        res.status(error.statusCode).json({
            message: error.message,
            error: error.message,
            code: error.code,
            details: error.details,
        });
        return;
    }
    if (error instanceof ZodError) {
        const details = error.flatten();
        const message = Object.entries(details.fieldErrors)
            .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : ''}`)
            .join(' | ') || 'Validation failed';
        res.status(400).json({
            message,
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details,
        });
        return;
    }
    if (error instanceof MulterError) {
        res.status(400).json({
            message: error.message,
            error: error.message,
            code: 'UPLOAD_ERROR',
        });
        return;
    }
    if (error instanceof Error && error.name === 'JsonWebTokenError') {
        res.status(401).json({
            message: 'Invalid authentication token',
            error: 'Invalid authentication token',
            code: 'INVALID_TOKEN',
        });
        return;
    }
    if (error instanceof Error && error.name === 'TokenExpiredError') {
        res.status(401).json({
            message: 'Authentication token expired',
            error: 'Authentication token expired',
            code: 'TOKEN_EXPIRED',
        });
        return;
    }
    logger.error('Unhandled application error', error);
    res.status(500).json({
        message: 'Internal server error',
        error: 'Internal server error',
        code: 'INTERNAL_SERVER_ERROR',
    });
}
