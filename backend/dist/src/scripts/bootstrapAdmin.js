import { AuthService } from '../services/authService.js';
import { logger } from '../utils/logger.js';
const authService = new AuthService();
export async function bootstrapAdminUser() {
    const user = await authService.bootstrapAdmin();
    if (user) {
        logger.info(`Admin bootstrap complete for ${user.email}`);
    }
    return user;
}
if (import.meta.url === `file://${process.argv[1]}`) {
    bootstrapAdminUser()
        .then(() => {
        process.exitCode = 0;
    })
        .catch((error) => {
        logger.error('Admin bootstrap failed', error);
        process.exitCode = 1;
    });
}
