import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
import { parseCookies } from '../utils/cookies.js';
export function requireAuth(req, _res, next) {
    try {
        const cookies = parseCookies(req.headers.cookie);
        const token = cookies[env.cookieName];
        if (!token) {
            throw new ApiError(401, 'Authentication required', 'AUTH_REQUIRED');
        }
        const payload = jwt.verify(token, env.jwtSecret);
        req.auth = {
            userId: payload.userId,
            role: payload.role,
        };
        next();
    }
    catch (error) {
        next(error);
    }
}
export function requireAdmin(req, _res, next) {
    if (!req.auth) {
        next(new ApiError(401, 'Authentication required', 'AUTH_REQUIRED'));
        return;
    }
    if (req.auth.role !== 'ADMIN') {
        next(new ApiError(403, 'Admin access required', 'ADMIN_REQUIRED'));
        return;
    }
    next();
}
