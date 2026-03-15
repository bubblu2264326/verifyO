import { AdminService } from '../services/adminService.js';
import { DocumentService } from '../services/documentService.js';
import { BaseController } from './BaseController.js';
export class AdminController extends BaseController {
    adminService;
    documentService;
    constructor(adminService = new AdminService(), documentService = new DocumentService()) {
        super();
        this.adminService = adminService;
        this.documentService = documentService;
    }
    listDocuments = async (req, res, next) => {
        try {
            const result = await this.adminService.listDocuments({
                hash: typeof req.query.hash === 'string' ? req.query.hash : undefined,
                user: typeof req.query.user === 'string' ? req.query.user : undefined,
            });
            this.ok(res, result);
        }
        catch (error) {
            this.fail(next, error);
        }
    };
    deleteDocument = async (req, res, next) => {
        try {
            const documentId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
            const deletedDocument = await this.documentService.deleteDocument(documentId);
            this.ok(res, {
                message: 'Document deleted successfully',
                document: deletedDocument,
            });
        }
        catch (error) {
            this.fail(next, error);
        }
    };
}
