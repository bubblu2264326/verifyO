import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import prisma from '../src/config/db.js';
import { bootstrapAdminUser } from '../src/scripts/bootstrapAdmin.js';
import { generateSha256FromBuffer } from '../src/utils/hash.js';
import { resetDatabase, startTestServer } from './helpers/testServer.js';
test.beforeEach(async () => {
    process.env.ADMIN_EMAIL = 'admin@example.com';
    process.env.ADMIN_PASSWORD = 'AdminPassword123!';
    await resetDatabase();
    await bootstrapAdminUser();
});
test('documents upload, verify, duplicate hashes, and admin controls work', async () => {
    const server = await startTestServer();
    try {
        const firstUserCookie = await registerAndLogin(server.baseUrl, 'first@example.com');
        const secondUserCookie = await registerAndLogin(server.baseUrl, 'second@example.com');
        const adminCookie = await login(server.baseUrl, 'admin@example.com', 'AdminPassword123!');
        const fileBuffer = Buffer.concat([Buffer.from('%PDF-1.4\n'), Buffer.from('duplicate document')]);
        const clientHash = await generateSha256FromBuffer(fileBuffer);
        const firstUploadResponse = await uploadDocument(server.baseUrl, firstUserCookie, fileBuffer, clientHash);
        assert.equal(firstUploadResponse.status, 201);
        const firstUploadPayload = await firstUploadResponse.json();
        const secondUploadResponse = await uploadDocument(server.baseUrl, secondUserCookie, fileBuffer, clientHash);
        assert.equal(secondUploadResponse.status, 201);
        const secondUploadPayload = await secondUploadResponse.json();
        assert.equal(firstUploadPayload.document.storagePath, secondUploadPayload.document.storagePath);
        const verifyForm = new FormData();
        verifyForm.append('document', new Blob([new Uint8Array(fileBuffer)], { type: 'application/pdf' }), 'duplicate.pdf');
        const verifyResponse = await fetch(`${server.baseUrl}/api/documents/verify`, {
            method: 'POST',
            headers: { cookie: firstUserCookie },
            body: verifyForm,
        });
        assert.equal(verifyResponse.status, 200);
        const verifyPayload = await verifyResponse.json();
        assert.equal(verifyPayload.status, 'valid');
        assert.equal(verifyPayload.matches.length, 2);
        assert.ok(verifyPayload.matches.every((match) => match.uploaderEmailMasked.includes('***@')));
        const adminListResponse = await fetch(`${server.baseUrl}/api/admin/documents?hash=${clientHash}`, {
            headers: { cookie: adminCookie },
        });
        assert.equal(adminListResponse.status, 200);
        const adminListPayload = await adminListResponse.json();
        assert.equal(adminListPayload.total, 2);
        const documentId = adminListPayload.documents[0].id;
        const deleteResponse = await fetch(`${server.baseUrl}/api/admin/documents/${documentId}`, {
            method: 'DELETE',
            headers: { cookie: adminCookie },
        });
        assert.equal(deleteResponse.status, 200);
        const remainingDocuments = await prisma.document.findMany({
            where: { fileHash: clientHash },
        });
        assert.equal(remainingDocuments.length, 1);
    }
    finally {
        await server.close();
    }
});
test('documents reject spoofed pdf uploads by signature', async () => {
    const server = await startTestServer();
    const uploadsDir = resolve(process.cwd(), 'uploads', 'documents');
    try {
        const userCookie = await registerAndLogin(server.baseUrl, 'user@example.com');
        const before = new Set(await readdir(uploadsDir));
        const fileBuffer = Buffer.from('not a pdf');
        const clientHash = await generateSha256FromBuffer(fileBuffer);
        const response = await uploadDocument(server.baseUrl, userCookie, fileBuffer, clientHash);
        assert.equal(response.status, 400);
        const payload = await response.json();
        assert.equal(payload.code, 'INVALID_FILE_SIGNATURE');
        const after = new Set(await readdir(uploadsDir));
        assert.deepEqual(after, before);
    }
    finally {
        await server.close();
    }
});
async function registerAndLogin(baseUrl, email) {
    const registerResponse = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            email,
            password: 'Password123!',
        }),
    });
    assert.equal(registerResponse.status, 201);
    return login(baseUrl, email, 'Password123!');
}
async function login(baseUrl, email, password) {
    const loginResponse = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ email, password }),
    });
    assert.equal(loginResponse.status, 200);
    return loginResponse.headers
        .getSetCookie()
        .map((cookie) => cookie.split(';', 1)[0])
        .join('; ');
}
async function uploadDocument(baseUrl, cookie, fileBuffer, clientHash) {
    const form = new FormData();
    form.append('document', new Blob([new Uint8Array(fileBuffer)], { type: 'application/pdf' }), 'duplicate.pdf');
    form.append('clientHash', clientHash);
    return fetch(`${baseUrl}/api/documents/upload`, {
        method: 'POST',
        headers: { cookie },
        body: form,
    });
}
