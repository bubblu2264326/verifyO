import bcrypt from 'bcrypt'
import jwt, { type SignOptions } from 'jsonwebtoken'

import { env, getEnv } from '../config/env.js'
import { UserRepository } from '../repositories/UserRepository.js'
import { ApiError } from '../utils/apiError.js'

type SafeUser = {
  id: string
  email: string
  role: 'USER' | 'ADMIN'
}

export class AuthService {
  constructor(private readonly userRepository = new UserRepository()) {}

  async register(email: string, password: string): Promise<SafeUser> {
    const existingUser = await this.userRepository.findByEmail(email)
    if (existingUser) {
      throw new ApiError(409, 'User already exists', 'USER_EXISTS')
    }

    const hashedPassword = await bcrypt.hash(password, env.bcryptSaltRounds)
    const user = await this.userRepository.create({
      email,
      password: hashedPassword,
    })

    return this.toSafeUser(user)
  }

  async authenticate(email: string, password: string): Promise<{ user: SafeUser; token: string }> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS')
    }

    const passwordMatches = await bcrypt.compare(password, user.password)
    if (!passwordMatches) {
      throw new ApiError(401, 'Invalid credentials', 'INVALID_CREDENTIALS')
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, env.jwtSecret, {
      expiresIn: env.jwtExpiresIn as SignOptions['expiresIn'],
    })

    return {
      user: this.toSafeUser(user),
      token,
    }
  }

  async getCurrentUser(userId: string): Promise<SafeUser> {
    const user = await this.userRepository.findById(userId)
    if (!user) {
      throw new ApiError(401, 'Authentication required', 'AUTH_REQUIRED')
    }

    return this.toSafeUser(user)
  }

  private toSafeUser(user: { id: string; email: string; role: 'USER' | 'ADMIN' }): SafeUser {
    return {
      id: user.id,
      email: user.email,
      role: user.role,
    }
  }
}
