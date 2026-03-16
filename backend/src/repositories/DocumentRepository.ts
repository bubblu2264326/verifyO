import type { Prisma } from '@prisma/client'

import prisma from '../config/db.js'

const documentWithUserInclude = {
  user: true,
} satisfies Prisma.DocumentInclude

export type DocumentWithUser = Prisma.DocumentGetPayload<{
  include: typeof documentWithUserInclude
}>

export class DocumentRepository {
  create(data: Prisma.DocumentUncheckedCreateInput) {
    return prisma.document.create({ data })
  }

  findExistingStoragePathByHash(fileHash: string): Promise<{ storagePath: string } | null> {
    return prisma.document.findFirst({
      where: { fileHash },
      select: { storagePath: true },
      orderBy: { createdAt: 'asc' },
    })
  }

  findByHash(fileHash: string): Promise<DocumentWithUser[]> {
    return prisma.document.findMany({
      where: { fileHash },
      include: documentWithUserInclude,
      orderBy: { createdAt: 'desc' },
    })
  }

  countByStoragePath(storagePath: string): Promise<number> {
    return prisma.document.count({ where: { storagePath } })
  }

  findById(id: string): Promise<DocumentWithUser | null> {
    return prisma.document.findUnique({
      where: { id },
      include: documentWithUserInclude,
    })
  }

  findByUserId(userId: string): Promise<DocumentWithUser[]> {
    return prisma.document.findMany({
      where: { userId },
      include: documentWithUserInclude,
      orderBy: { createdAt: 'desc' },
    })
  }

  findForAdmin(filters: { hash?: string; user?: string }): Promise<DocumentWithUser[]> {
    const { hash, user } = filters

    return prisma.document.findMany({
      where: {
        ...(hash ? { fileHash: hash } : {}),
        ...(user
          ? {
              user: {
                email: {
                  contains: user,
                  mode: 'insensitive',
                },
              },
            }
          : {}),
      },
      include: documentWithUserInclude,
      orderBy: { createdAt: 'desc' },
    })
  }

  delete(id: string) {
    return prisma.document.delete({ where: { id } })
  }
}
