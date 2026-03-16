import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { env } from './config/env.js'
import { errorHandler, notFoundHandler } from './middleware/error.middleware.js'
import { globalRateLimiter } from './middleware/rateLimit.middleware.js'
import adminRoutes from './routes/adminRoutes.js'
import authRoutes from './routes/authRoutes.js'
import documentRoutes from './routes/documentRoutes.js'

export function createApp() {
  const app = express()

  app.use(
    cors({
      origin: env.frontendOrigin,
      credentials: true,
    }),
  )
  app.use(helmet())
  //app.use(morgan(env.nodeEnv === 'production' ? 'combined' : 'dev'))
  app.use(morgan('combined'))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(globalRateLimiter)

  app.get('/health', (_req, res) => {
    res.status(200).json({
      status: 'ok',
      message: 'Secure Verification API is running',
    })
  })

  app.use('/api/auth', authRoutes)
  app.use('/api/documents', documentRoutes)
  app.use('/api/admin', adminRoutes)

  app.use(notFoundHandler)
  app.use(errorHandler)

  return app
}
