import type { CookieOptions, NextFunction, Request, Response } from 'express'

import { env } from '../config/env.js'
import { AuthService } from '../services/authService.js'
import { ApiError } from '../utils/apiError.js'
import { BaseController } from './BaseController.js'

export class AuthController extends BaseController {
  constructor(private readonly authService = new AuthService()) {
    super()
  }

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.authService.register(req.body.email, req.body.password)
      this.created(res, {
        message: 'User registered successfully',
        user,
      })
    } catch (error) {
      this.fail(next, error)
    }
  }

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { user, token } = await this.authService.authenticate(req.body.email, req.body.password)
      res.cookie(env.cookieName, token, authCookieOptions())
      this.ok(res, {
        message: 'Login successful',
        user,
      })
    } catch (error) {
      this.fail(next, error)
    }
  }

  logout = async (_req: Request, res: Response, next: NextFunction) => {
    try {
      res.clearCookie(env.cookieName, authCookieOptions())
      this.ok(res, { message: 'Logout successful' })
    } catch (error) {
      this.fail(next, error)
    }
  }

  me = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.auth?.userId
      if (!userId) {
        throw new ApiError(401, 'Authentication required', 'AUTH_REQUIRED')
      }

      const user = await this.authService.getCurrentUser(userId)
      this.ok(res, { user })
    } catch (error) {
      this.fail(next, error)
    }
  }
}

function authCookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/',
  }
}
