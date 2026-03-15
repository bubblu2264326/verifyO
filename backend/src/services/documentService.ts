import { resolve } from 'node:path'

import { DocumentRepository } from '../repositories/DocumentRepository.js'
import { ApiError } from '../utils/apiError.js'
import { safeUnlink } from '../utils/fileSystem.js'
import { generateSha256FromFile, maskEmail } from '../utils/hash.js'

type UploadInput = {
  userId: string
  file?: Express.Multer.File
  clientHash?: string
}

type VerifyInput = {
  file?: Express.Multer.File
}

export class DocumentService {
  constructor(private readonly documentRepository = new DocumentRepository()) {}

  async uploadDocument({ userId, file, clientHash }: UploadInput) {
    if (!file) {
      throw new ApiError(400, 'Document file is required', 'FILE_REQUIRED')
    }

    const serverHash = await generateSha256FromFile(file.path)
    if (clientHash && clientHash !== serverHash) {
      await safeUnlink(file.path)
      throw new ApiError(400, 'Client hash does not match uploaded file', 'HASH_MISMATCH')
    }

    const document = await this.documentRepository.create({
      fileName: file.originalname,
      fileHash: serverHash,
      storagePath: file.path,
      userId,
    })

    return {
      id: document.id,
      fileName: document.fileName,
      fileHash: document.fileHash,
      storagePath: document.storagePath,
      createdAt: document.createdAt,
    }
  }

  async verifyDocument({ file }: VerifyInput) {
    if (!file) {
      throw new ApiError(400, 'Document file is required', 'FILE_REQUIRED')
    }

    const fileHash = await generateSha256FromFile(file.path)
    await safeUnlink(file.path)

    const matches = await this.documentRepository.findByHash(fileHash)
    if (matches.length === 0) {
      return {
        status: 'modified_or_unknown' as const,
        fileHash,
        matches: [],
      }
    }

    return {
      status: 'valid' as const,
      fileHash,
      matches: matches.map((match) => ({
        documentId: match.id,
        fileName: match.fileName,
        uploadedAt: match.createdAt.toISOString(),
        uploaderEmailMasked: maskEmail(match.user.email),
      })),
    }
  }

  async getUserDocuments(userId: string) {
    const documents = await this.documentRepository.findByUserId(userId)
    return documents.map((document) => ({
      id: document.id,
      fileName: document.fileName,
      fileHash: document.fileHash,
      createdAt: document.createdAt.toISOString(),
    }))
  }

  async deleteDocument(documentId: string) {
    const document = await this.documentRepository.findById(documentId)
    if (!document) {
      throw new ApiError(404, 'Document not found', 'DOCUMENT_NOT_FOUND')
    }

    await this.documentRepository.delete(documentId)
    await safeUnlink(resolve(document.storagePath))

    return {
      id: document.id,
      fileName: document.fileName,
    }
  }
}
