import { Router } from 'express'

import { DocumentController } from '../controllers/documentController.js'
import { requireAuth } from '../middleware/auth.middleware.js'
import { uploadRateLimiter } from '../middleware/rateLimit.middleware.js'
import { uploadDocumentMiddleware } from '../middleware/upload.middleware.js'
import { validateRequest } from '../middleware/validate.middleware.js'
import { uploadDocumentSchema } from '../validators/document.validator.js'

const router = Router()
const documentController = new DocumentController()

router.post(
  '/upload',
  requireAuth,
  uploadRateLimiter,
  uploadDocumentMiddleware,
  validateRequest({ body: uploadDocumentSchema }),
  documentController.upload,
)

router.post('/verify', requireAuth, uploadRateLimiter, uploadDocumentMiddleware, documentController.verify)
router.get('/me', requireAuth, documentController.myDocuments)

export default router
