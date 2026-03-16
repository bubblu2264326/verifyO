import prisma from '../config/db.js';
const documentWithUserInclude = {
    user: true,
};
export class DocumentRepository {
    create(data) {
        return prisma.document.create({ data });
    }
    findExistingStoragePathByHash(fileHash) {
        return prisma.document.findFirst({
            where: { fileHash },
            select: { storagePath: true },
            orderBy: { createdAt: 'asc' },
        });
    }
    findByHash(fileHash) {
        return prisma.document.findMany({
            where: { fileHash },
            include: documentWithUserInclude,
            orderBy: { createdAt: 'desc' },
        });
    }
    countByStoragePath(storagePath) {
        return prisma.document.count({ where: { storagePath } });
    }
    findById(id) {
        return prisma.document.findUnique({
            where: { id },
            include: documentWithUserInclude,
        });
    }
    findByUserId(userId) {
        return prisma.document.findMany({
            where: { userId },
            include: documentWithUserInclude,
            orderBy: { createdAt: 'desc' },
        });
    }
    findForAdmin(filters) {
        const { hash, user } = filters;
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
        });
    }
    delete(id) {
        return prisma.document.delete({ where: { id } });
    }
}
