import { DocumentRepository } from '../repositories/DocumentRepository.js';
import { maskEmail } from '../utils/hash.js';
export class AdminService {
    documentRepository;
    constructor(documentRepository = new DocumentRepository()) {
        this.documentRepository = documentRepository;
    }
    async listDocuments(filters) {
        const documents = await this.documentRepository.findForAdmin(filters);
        return {
            total: documents.length,
            documents: documents.map((document) => ({
                id: document.id,
                fileName: document.fileName,
                fileHash: document.fileHash,
                storagePath: document.storagePath,
                createdAt: document.createdAt.toISOString(),
                uploader: {
                    id: document.user.id,
                    email: document.user.email,
                    emailMasked: maskEmail(document.user.email),
                    role: document.user.role,
                },
            })),
        };
    }
}
