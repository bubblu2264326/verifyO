import type { NextFunction, Request, Response } from 'express'
import type { ZodType } from 'zod'

type Schemas = {
  body?: ZodType
  query?: ZodType
  params?: ZodType
}

export function validateRequest(schemas: Schemas) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body)
      }
      if (schemas.query) {
        schemas.query.parse(req.query)
      }
      if (schemas.params) {
        schemas.params.parse(req.params)
      }
      next()
    } catch (error) {
      next(error)
    }
  }
}
