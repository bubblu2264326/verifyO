import type { Prisma, Role, User } from '@prisma/client'

import prisma from '../config/db.js'

export class UserRepository {
  findByEmail(email: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { email } })
  }

  findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } })
  }

  create(data: Prisma.UserCreateInput): Promise<User> {
    return prisma.user.create({ data })
  }

  upsertAdmin(email: string, password: string, role: Role = 'ADMIN'): Promise<User> {
    return prisma.user.upsert({
      where: { email },
      update: { password, role },
      create: { email, password, role },
    })
  }
}
