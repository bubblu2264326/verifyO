import test from 'node:test'
import assert from 'node:assert/strict'

import prisma from '../src/config/db.js'
import { bootstrapAdminUser } from '../src/scripts/bootstrapAdmin.js'
import { generateSha256FromBuffer } from '../src/utils/hash.js'
import { resetDatabase, startTestServer } from './helpers/testServer.js'

test.beforeEach(async () => {
  process.env.ADMIN_EMAIL = 'admin@example.com'
  process.env.ADMIN_PASSWORD = 'AdminPassword123!'
  await resetDatabase()
  await bootstrapAdminUser()
})

test('documents upload, verify, duplicate hashes, and admin controls work', async () => {
  const server = await startTestServer()

  try {
    const firstUserCookie = await registerAndLogin(server.baseUrl, 'first@example.com')
    const secondUserCookie = await registerAndLogin(server.baseUrl, 'second@example.com')
    const adminCookie = await login(server.baseUrl, 'admin@example.com', 'AdminPassword123!')

    const fileBuffer = Buffer.from('duplicate document')
    const clientHash = await generateSha256FromBuffer(fileBuffer)

    const firstUploadResponse = await uploadDocument(server.baseUrl, firstUserCookie, fileBuffer, clientHash)
    assert.equal(firstUploadResponse.status, 201)

    const secondUploadResponse = await uploadDocument(server.baseUrl, secondUserCookie, fileBuffer, clientHash)
    assert.equal(secondUploadResponse.status, 201)

    const verifyForm = new FormData()
    verifyForm.append(
      'document',
      new Blob([new Uint8Array(fileBuffer)], { type: 'application/pdf' }),
      'duplicate.pdf',
    )

    const verifyResponse = await fetch(`${server.baseUrl}/api/documents/verify`, {
      method: 'POST',
      headers: { cookie: firstUserCookie },
      body: verifyForm,
    })

    assert.equal(verifyResponse.status, 200)
    const verifyPayload = await verifyResponse.json()
    assert.equal(verifyPayload.status, 'valid')
    assert.equal(verifyPayload.matches.length, 2)
    assert.ok(verifyPayload.matches.every((match: { uploaderEmailMasked: string }) => match.uploaderEmailMasked.includes('***@')))

    const adminListResponse = await fetch(`${server.baseUrl}/api/admin/documents?hash=${clientHash}`, {
      headers: { cookie: adminCookie },
    })

    assert.equal(adminListResponse.status, 200)
    const adminListPayload = await adminListResponse.json()
    assert.equal(adminListPayload.total, 2)

    const documentId = adminListPayload.documents[0].id as string
    const deleteResponse = await fetch(`${server.baseUrl}/api/admin/documents/${documentId}`, {
      method: 'DELETE',
      headers: { cookie: adminCookie },
    })

    assert.equal(deleteResponse.status, 200)

    const remainingDocuments = await prisma.document.findMany({
      where: { fileHash: clientHash },
    })
    assert.equal(remainingDocuments.length, 1)
  } finally {
    await server.close()
  }
})

async function registerAndLogin(baseUrl: string, email: string): Promise<string> {
  const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      email,
      password: 'Password123!',
    }),
  })

  assert.equal(registerResponse.status, 201)
  return login(baseUrl, email, 'Password123!')
}

async function login(baseUrl: string, email: string, password: string): Promise<string> {
  const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  assert.equal(loginResponse.status, 200)
  return loginResponse.headers
    .getSetCookie()
    .map((cookie) => cookie.split(';', 1)[0])
    .join('; ')
}

async function uploadDocument(
  baseUrl: string,
  cookie: string,
  fileBuffer: Buffer,
  clientHash: string,
): Promise<Response> {
  const form = new FormData()
  form.append(
    'document',
    new Blob([new Uint8Array(fileBuffer)], { type: 'application/pdf' }),
    'duplicate.pdf',
  )
  form.append('clientHash', clientHash)

  return fetch(`${baseUrl}/api/documents/upload`, {
    method: 'POST',
    headers: { cookie },
    body: form,
  })
}
