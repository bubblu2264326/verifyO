import { once } from 'node:events';
import { createApp } from '../../src/app.js';
import prisma from '../../src/config/db.js';
export async function startTestServer() {
    const app = createApp();
    const server = app.listen(0);
    await once(server, 'listening');
    const address = server.address();
    const baseUrl = `http://127.0.0.1:${address.port}`;
    return {
        baseUrl,
        close: () => closeServer(server),
    };
}
export async function resetDatabase() {
    await prisma.document.deleteMany();
    await prisma.user.deleteMany();
}
async function closeServer(server) {
    if (!server.listening) {
        return;
    }
    await new Promise((resolve, reject) => {
        server.close((error) => {
            if (error) {
                reject(error);
                return;
            }
            resolve();
        });
    });
}
