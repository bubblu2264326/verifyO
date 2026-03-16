import multer from 'multer'
import { env } from '../config/env.js'
import { ApiError } from '../utils/apiError.js'

const allowedMimeTypes = new Set(['application/pdf', 'image/png', 'image/jpeg'])

// Use memory storage for cloud-native handling (no local disk writes)
const storage = multer.memoryStorage()

export const uploadDocumentMiddleware = multer({
  storage,
  limits: { fileSize: env.maxUploadSizeBytes },
  fileFilter: (_req, file, callback) => {
    if (!allowedMimeTypes.has(file.mimetype)) {
      callback(new ApiError(400, 'Only PDF, PNG, and JPG uploads are allowed', 'INVALID_FILE_TYPE'))
      return
    }

    callback(null, true)
  },
}).single('document')
