import { promises as fs } from 'node:fs';
export async function safeUnlink(filePath) {
    try {
        await fs.unlink(filePath);
    }
    catch (error) {
        const nodeError = error;
        if (nodeError.code !== 'ENOENT') {
            throw error;
        }
    }
}
