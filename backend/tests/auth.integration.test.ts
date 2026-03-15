import test from 'node:test'
import assert from 'node:assert/strict'

import { resetDatabase, startTestServer } from './helpers/testServer.js'

test.beforeEach(async () => {
  await resetDatabase()
})

test('register, login, me, and logout work with HttpOnly cookie auth', async () => {
  const server = await startTestServer()

  try {
    const registerResponse = await fetch(`${server.baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'user@example.com',
        password: 'Password123!',
      }),
    })

    assert.equal(registerResponse.status, 201)

    const loginResponse = await fetch(`${server.baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        email: 'user@example.com',
        password: 'Password123!',
      }),
    })

    assert.equal(loginResponse.status, 200)

    const cookies = loginResponse.headers.getSetCookie()
    assert.ok(cookies.some((cookie) => cookie.startsWith('verifyo_token=')))

    const meResponse = await fetch(`${server.baseUrl}/api/auth/me`, {
      headers: {
        cookie: cookies.map((cookie) => cookie.split(';', 1)[0]).join('; '),
      },
    })

    assert.equal(meResponse.status, 200)
    const mePayload = await meResponse.json()
    assert.equal(mePayload.user.email, 'user@example.com')
    assert.equal(mePayload.user.role, 'USER')

    const logoutResponse = await fetch(`${server.baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: {
        cookie: cookies.map((cookie) => cookie.split(';', 1)[0]).join('; '),
      },
    })

    assert.equal(logoutResponse.status, 200)
  } finally {
    await server.close()
  }
})
