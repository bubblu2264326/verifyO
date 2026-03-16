export type AllowedUploadType = 'application/pdf' | 'image/png' | 'image/jpeg'

const PDF_MAGIC = Buffer.from('%PDF-')
const PNG_MAGIC = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])
const JPEG_MAGIC = Buffer.from([0xff, 0xd8, 0xff])

function startsWith(buffer: Buffer, prefix: Buffer): boolean {
  if (buffer.length < prefix.length) return false
  return buffer.subarray(0, prefix.length).equals(prefix)
}

export async function detectAllowedUploadType(buffer: Buffer): Promise<AllowedUploadType | null> {
  if (startsWith(buffer, PDF_MAGIC)) return 'application/pdf'
  if (startsWith(buffer, PNG_MAGIC)) return 'image/png'
  if (startsWith(buffer, JPEG_MAGIC)) return 'image/jpeg'

  return null
}

export function sanitizeOriginalFileName(originalName: string): string {
  const withoutControls = originalName.replace(/[\u0000-\u001f\u007f]/g, '')
  const withoutSlashes = withoutControls.replace(/[\\/]/g, '_')
  const trimmed = withoutSlashes.trim()
  const normalized = trimmed || 'uploaded-file'
  return normalized.length > 255 ? normalized.slice(0, 255) : normalized
}
