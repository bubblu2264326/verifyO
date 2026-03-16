import bcrypt from 'bcrypt'

import { env } from '../config/env.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { logger } from '../utils/logger.js'

const userRepository = new UserRepository()

export async function bootstrapAdminUser() {
  const email = process.env.ADMIN_EMAIL
  const password = process.env.ADMIN_PASSWORD

  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set')
  }

  const hashedPassword = await bcrypt.hash(password, env.bcryptSaltRounds)
  const user = await userRepository.upsertAdmin(email, hashedPassword, 'ADMIN')

  logger.info(`Admin bootstrap complete for ${user.email}`)
  return user
}

if (import.meta.url === `file://${process.argv[1]}`) {
  bootstrapAdminUser()
    .then(() => {
      process.exitCode = 0
    })
    .catch((error) => {
      logger.error('Admin bootstrap failed', error)
      process.exitCode = 1
    })
}

