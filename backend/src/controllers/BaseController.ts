import type { NextFunction, Response } from 'express'

export class BaseController {
  protected ok(res: Response, data: unknown, statusCode = 200): void {
    res.status(statusCode).json(data)
  }

  protected created(res: Response, data: unknown): void {
    this.ok(res, data, 201)
  }

  protected fail(next: NextFunction, error: unknown): void {
    next(error)
  }
}
