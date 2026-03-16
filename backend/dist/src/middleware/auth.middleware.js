import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
import { parseCookies } from '../utils/cookies.js';
function isTokenPayload(payload) {
    if (!payload || typeof payload !== 'object')
        return false;
    const record = payload;
    if (typeof record.userId !== 'string')
        return false;
    return record.role === 'USER' || record.role === 'ADMIN';
}
export function requireAuth(req, _res, next) {
    try {
        const cookies = parseCookies(req.headers.cookie);
        const token = cookies[env.cookieName];
        if (!token) {
            throw new ApiError(401, 'Authentication required', 'AUTH_REQUIRED');
        }
        const payload = jwt.verify(token, env.jwtSecret, { algorithms: ['HS256'] });
        if (!isTokenPayload(payload)) {
            throw new ApiError(401, 'Invalid authentication token', 'INVALID_TOKEN');
        }
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
