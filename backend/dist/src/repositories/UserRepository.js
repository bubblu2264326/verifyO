import prisma from '../config/db.js';
export class UserRepository {
    findByEmail(email) {
        return prisma.user.findUnique({ where: { email } });
    }
    findById(id) {
        return prisma.user.findUnique({ where: { id } });
    }
    create(data) {
        return prisma.user.create({ data });
    }
    upsertAdmin(email, password, role = 'ADMIN') {
        return prisma.user.upsert({
            where: { email },
            update: { password, role },
            create: { email, password, role },
        });
    }
}
