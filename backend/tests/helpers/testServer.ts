import { once } from 'node:events'
import type { AddressInfo } from 'node:net'
import type { Server } from 'node:http'

import { createApp } from '../../src/app.js'
import prisma from '../../src/config/db.js'

export async function startTestServer(): Promise<{
  baseUrl: string
  close: () => Promise<void>
}> {
  const app = createApp()
  const server = app.listen(0)
  await once(server, 'listening')

  const address = server.address() as AddressInfo
  const baseUrl = `http://127.0.0.1:${address.port}`

  return {
    baseUrl,
    close: () => closeServer(server),
  }
}

export async function resetDatabase(): Promise<void> {
  await prisma.document.deleteMany()
  await prisma.user.deleteMany()
}

async function closeServer(server: Server): Promise<void> {
  if (!server.listening) {
    return
  }

  await new Promise<void>((resolve, reject) => {
    server.close((error) => {
      if (error) {
        reject(error)
        return
      }
      resolve()
    })
  })
}
