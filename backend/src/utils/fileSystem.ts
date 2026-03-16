import { promises as fs } from 'node:fs'
import path from 'node:path'

export async function safeUnlink(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath)
  } catch (error) {
    const nodeError = error as NodeJS.ErrnoException
    if (nodeError.code !== 'ENOENT') {
      throw error
    }
  }
}

export function isPathInsideDirectory(directoryPath: string, filePath: string): boolean {
  const relative = path.relative(directoryPath, filePath)
  return relative !== '' && !relative.startsWith('..') && !path.isAbsolute(relative)
}
