import { createApp } from './app.js';
import { env } from './config/env.js';
import { logger } from './utils/logger.js';
import { bootstrapAdminUser } from './scripts/bootstrapAdmin.js';
const app = createApp();
bootstrapAdminUser()
    .then(() => {
    app.listen(env.port, () => {
        logger.info(`Backend server listening on port ${env.port}`);
    });
})
    .catch((error) => {
    logger.error('Failed to bootstrap backend server', error);
    process.exitCode = 1;
});
