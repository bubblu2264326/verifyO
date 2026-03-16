import { DocumentRepository } from '../repositories/DocumentRepository.js';
import { env } from '../config/env.js';
import { supabase } from '../config/supabase.js';
import { ApiError } from '../utils/apiError.js';
import { detectAllowedUploadType, sanitizeOriginalFileName } from '../utils/fileType.js';
import { generateSha256FromBuffer, maskEmail } from '../utils/hash.js';
export class DocumentService {
    documentRepository;
    constructor(documentRepository = new DocumentRepository()) {
        this.documentRepository = documentRepository;
    }
    async checkDuplicateHash(userId, fileHash, isAdmin) {
        const existingMatches = await this.documentRepository.findByHash(fileHash);
        if (existingMatches.length > 0) {
            const ownedByUser = existingMatches.some((match) => match.userId === userId);
            if (ownedByUser) {
                throw new ApiError(400, 'you already uploaded that file', 'DUPLICATE_FILE');
            }
            else {
                const firstMatch = existingMatches[0];
                const uploaderEmail = firstMatch.user.email;
                const displayedEmail = isAdmin ? uploaderEmail : maskEmail(uploaderEmail);
                throw new ApiError(400, `The duplicate file is already found uploaded by ${displayedEmail}`, 'DUPLICATE_FILE');
            }
        }
    }
    async uploadDocument({ userId, isAdmin, file, clientHash }) {
        if (!file) {
            throw new ApiError(400, 'Document file is required', 'FILE_REQUIRED');
        }
        const detectedType = await detectAllowedUploadType(file.buffer);
        if (!detectedType) {
            throw new ApiError(400, 'Only PDF, PNG, and JPG uploads are allowed', 'INVALID_FILE_SIGNATURE');
        }
        const serverHash = await generateSha256FromBuffer(file.buffer);
        if (clientHash && clientHash !== serverHash) {
            throw new ApiError(400, 'Client hash does not match uploaded file', 'HASH_MISMATCH');
        }
        await this.checkDuplicateHash(userId, serverHash, isAdmin);
        const sanitizedOriginalName = sanitizeOriginalFileName(file.originalname);
        // We use the hash as the unique filename in storage to avoid duplicates
        const storagePath = `${serverHash}`;
        // Check if file already exists in cloud storage (optional optimization, check DB first)
        const { data: uploadData, error: uploadError } = await supabase.storage
            .from(env.supabase.bucket)
            .upload(storagePath, file.buffer, {
            contentType: file.mimetype,
            upsert: true, // If multiple users upload the same file, it's fine to overwrite with same content
        });
        if (uploadError) {
            throw new ApiError(500, `Cloud upload failed: ${uploadError.message}`, 'STORAGE_ERROR');
        }
        let document;
        try {
            document = await this.documentRepository.create({
                fileName: sanitizedOriginalName,
                fileHash: serverHash,
                storagePath: storagePath,
                userId,
            });
        }
        catch (error) {
            // If DB creation fails, we could potentially delete the cloud file, 
            // but since it's content-addressed, we can keep it for future use.
            throw error;
        }
        return {
            id: document.id,
            fileName: document.fileName,
            fileHash: document.fileHash,
            storagePath: document.storagePath,
            createdAt: document.createdAt,
        };
    }
    async verifyDocument({ file }) {
        if (!file) {
            throw new ApiError(400, 'Document file is required', 'FILE_REQUIRED');
        }
        const detectedType = await detectAllowedUploadType(file.buffer);
        if (!detectedType) {
            throw new ApiError(400, 'Only PDF, PNG, and JPG uploads are allowed', 'INVALID_FILE_SIGNATURE');
        }
        const fileHash = await generateSha256FromBuffer(file.buffer);
        const matches = await this.documentRepository.findByHash(fileHash);
        if (matches.length === 0) {
            return {
                status: 'modified_or_unknown',
                fileHash,
                matches: [],
            };
        }
        return {
            status: 'valid',
            fileHash,
            matches: matches.map((match) => ({
                documentId: match.id,
                fileName: match.fileName,
                uploadedAt: match.createdAt.toISOString(),
                uploaderEmailMasked: maskEmail(match.user.email),
            })),
        };
    }
    async getUserDocuments(userId) {
        const documents = await this.documentRepository.findByUserId(userId);
        return documents.map((document) => ({
            id: document.id,
            fileName: document.fileName,
            fileHash: document.fileHash,
            createdAt: document.createdAt.toISOString(),
        }));
    }
    async deleteDocument(documentId) {
        const document = await this.documentRepository.findById(documentId);
        if (!document) {
            throw new ApiError(404, 'Document not found', 'DOCUMENT_NOT_FOUND');
        }
        await this.documentRepository.delete(documentId);
        // Check if anyone else is using this same file content (path)
        const remaining = await this.documentRepository.countByStoragePath(document.storagePath);
        if (remaining === 0) {
            const { error: deleteError } = await supabase.storage
                .from(env.supabase.bucket)
                .remove([document.storagePath]);
            if (deleteError) {
                console.error(`Failed to delete cloud file: ${deleteError.message}`);
                // We don't throw here as the DB record is already gone
            }
        }
        return {
            id: document.id,
            fileName: document.fileName,
        };
    }
}
