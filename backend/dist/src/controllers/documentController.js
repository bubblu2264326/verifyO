import { ApiError } from '../utils/apiError.js';
import { DocumentService } from '../services/documentService.js';
import { BaseController } from './BaseController.js';
export class DocumentController extends BaseController {
    documentService;
    constructor(documentService = new DocumentService()) {
        super();
        this.documentService = documentService;
    }
    upload = async (req, res, next) => {
        try {
            const userId = req.auth?.userId;
            if (!userId) {
                throw new ApiError(401, 'Authentication required', 'AUTH_REQUIRED');
            }
            const document = await this.documentService.uploadDocument({
                userId,
                isAdmin: req.auth?.role === 'ADMIN',
                file: req.file,
                clientHash: req.body.clientHash,
            });
            this.created(res, {
                message: 'Document uploaded successfully',
                document,
            });
        }
        catch (error) {
            this.fail(next, error);
        }
    };
    verify = async (req, res, next) => {
        try {
            const verification = await this.documentService.verifyDocument({
                file: req.file,
            });
            this.ok(res, verification);
        }
        catch (error) {
            this.fail(next, error);
        }
    };
    checkHash = async (req, res, next) => {
        try {
            const userId = req.auth?.userId;
            if (!userId) {
                throw new ApiError(401, 'Authentication required', 'AUTH_REQUIRED');
            }
            await this.documentService.checkDuplicateHash(userId, req.body.clientHash, req.auth?.role === 'ADMIN');
            this.ok(res, { message: 'Hash is clean' });
        }
        catch (error) {
            this.fail(next, error);
        }
    };
    myDocuments = async (req, res, next) => {
        try {
            const userId = req.auth?.userId;
            if (!userId) {
                throw new ApiError(401, 'Authentication required', 'AUTH_REQUIRED');
            }
            const documents = await this.documentService.getUserDocuments(userId);
            this.ok(res, { documents });
        }
        catch (error) {
            this.fail(next, error);
        }
    };
}
