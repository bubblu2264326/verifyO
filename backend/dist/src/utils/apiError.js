export class ApiError extends Error {
    statusCode;
    code;
    details;
    constructor(statusCode, message, code = 'API_ERROR', details) {
        super(message);
        this.statusCode = statusCode;
        this.code = code;
        this.details = details;
        this.name = 'ApiError';
    }
}
