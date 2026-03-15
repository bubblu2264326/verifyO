import { createApp } from './app.js'
import { env } from './config/env.js'
import { logger } from './utils/logger.js'

const app = createApp()

app.listen(env.port, () => {
  logger.info(`Backend server listening on port ${env.port}`)
})
