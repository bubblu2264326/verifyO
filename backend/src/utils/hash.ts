import { createHash } from 'node:crypto'
import { createReadStream } from 'node:fs'

export async function generateSha256FromBuffer(buffer: Buffer): Promise<string> {
  return createHash('sha256').update(buffer).digest('hex')
}

export async function generateSha256FromFile(filePath: string): Promise<string> {
  const hash = createHash('sha256')

  await new Promise<void>((resolve, reject) => {
    const stream = createReadStream(filePath)
    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('end', () => resolve())
    stream.on('error', reject)
  })

  return hash.digest('hex')
}

export function maskEmail(email: string): string {
  const [localPart, domain] = email.split('@')

  if (!localPart || !domain) {
    return 'u***@hidden.invalid'
  }

  return `${localPart[0]}***@${domain}`
}
