import prisma from '../config/db.js';
const documentWithUserInclude = {
    user: true,
};
export class DocumentRepository {
    create(data) {
        return prisma.document.create({ data });
    }
    findByHash(fileHash) {
        return prisma.document.findMany({
            where: { fileHash },
            include: documentWithUserInclude,
            orderBy: { createdAt: 'desc' },
        });
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
