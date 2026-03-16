import { promises as fs } from 'node:fs';
import path from 'node:path';
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
export function isPathInsideDirectory(directoryPath, filePath) {
    const relative = path.relative(directoryPath, filePath);
    return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative);
}
