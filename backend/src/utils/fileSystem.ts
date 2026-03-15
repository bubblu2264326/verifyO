import { promises as fs } from 'node:fs'

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
