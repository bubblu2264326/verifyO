import { mkdirSync } from 'node:fs';
import multer from 'multer';
import { env } from '../config/env.js';
import { ApiError } from '../utils/apiError.js';
mkdirSync(env.uploadsDirectory, { recursive: true });
const allowedMimeTypes = new Set(['application/pdf', 'image/png', 'image/jpeg']);
const storage = multer.diskStorage({
    destination: (_req, _file, callback) => {
        callback(null, env.uploadsDirectory);
    },
    filename: (_req, file, callback) => {
        const timestamp = Date.now();
        const safeFileName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
        callback(null, `${timestamp}-${safeFileName}`);
    },
});
export const uploadDocumentMiddleware = multer({
    storage,
    limits: { fileSize: env.maxUploadSizeBytes },
    fileFilter: (_req, file, callback) => {
        if (!allowedMimeTypes.has(file.mimetype)) {
            callback(new ApiError(400, 'Only PDF, PNG, and JPG uploads are allowed', 'INVALID_FILE_TYPE'));
            return;
        }
        callback(null, true);
    },
}).single('document');
