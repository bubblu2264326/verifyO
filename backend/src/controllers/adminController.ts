import type { NextFunction, Request, Response } from 'express'

import { AdminService } from '../services/adminService.js'
import { DocumentService } from '../services/documentService.js'
import { BaseController } from './BaseController.js'

export class AdminController extends BaseController {
  constructor(
    private readonly adminService = new AdminService(),
    private readonly documentService = new DocumentService(),
  ) {
    super()
  }

  listDocuments = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.adminService.listDocuments({
        hash: typeof req.query.hash === 'string' ? req.query.hash : undefined,
        user: typeof req.query.user === 'string' ? req.query.user : undefined,
      })

      this.ok(res, result)
    } catch (error) {
      this.fail(next, error)
    }
  }

  deleteDocument = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const documentId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id
      const deletedDocument = await this.documentService.deleteDocument(documentId)
      this.ok(res, {
        message: 'Document deleted successfully',
        document: deletedDocument,
      })
    } catch (error) {
      this.fail(next, error)
    }
  }
}
