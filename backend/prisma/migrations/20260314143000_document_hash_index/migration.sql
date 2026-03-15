DROP INDEX IF EXISTS "Document_fileHash_key";

CREATE INDEX IF NOT EXISTS "Document_fileHash_idx" ON "Document"("fileHash");
CREATE INDEX IF NOT EXISTS "Document_userId_idx" ON "Document"("userId");
