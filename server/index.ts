
import next from 'next'
import { parse } from 'node:url'
import { Socket } from 'node:net'
import { WebSocketServer } from 'ws'
import { createServer, IncomingMessage, ServerResponse } from 'node:http'

import * as frida from 'frida'

export const getNextApp = () => {
  return next({ dev: true })
}

export const connectWebSocket = (nextApp: any, on: () => void, port = 7040) => {
  const wss = new WebSocketServer({ noServer: true })
  const handle = nextApp.getRequestHandler()
  const server = createServer((req: IncomingMessage, res: ServerResponse) => {
    handle(req, res, parse(req.url || '', true))
  })
  server.on('upgrade', (req: IncomingMessage, socket: Socket, head: Buffer) => {
    const { pathname } = parse(req.url || '/', true)
    if (pathname === '/_next/webpack-hmr') {
      nextApp.getUpgradeHandler()(req, socket, head)
    }
    if (pathname === '/api/ws') {
      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req)
      })
    }
  })
  server.listen(port, on)
  return wss
}


export interface FridaOption {
  name: string
  script: string
  onMessage?: (message: any) => void
}

export const useFrida = async (option: FridaOption) => {
  const device = await frida.getUsbDevice()
  const session = await device.attach(option.name)
  const script = await session.createScript(option.script)
  script.message.connect((message) => {
    option?.onMessage && option?.onMessage(message)
  })
  await script.load()
  return {
    api: script.exports,
    unload: () => {
      script.unload()
    }
  }
}
