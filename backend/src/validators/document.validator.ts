import { z } from 'zod'

export const uploadDocumentSchema = z.object({
  clientHash: z.string().length(64).optional(),
})

export const adminQuerySchema = z.object({
  hash: z.string().length(64).optional(),
  user: z.string().min(1).optional(),
})

export const documentIdParamSchema = z.object({
  id: z.string().uuid(),
})
