
import next from 'next'
import { parse } from 'node:url'
import { Socket } from 'node:net'
import { WebSocketServer, WebSocket } from 'ws'
import { createServer, IncomingMessage, ServerResponse } from 'node:http'

export const getNextApp = () => {
  return next({ dev: true })
}

export const connectWebSocket = (nextApp: any, on: () => void, port?: number) => {
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

export type Handle = (...args: any) => void

export const useWebSocket = () => {

  const ref: any = {}

  const bootHandle = { value: (...args: any) => {}, port: 3000 }
  const conHandle = { value: (...args: any) => {} }
  const msgHandle = { value: (...args: any) => {} }

  const onBoot = (handle: Handle, port?: number) => {
    bootHandle.value = handle
    if (port) {
      bootHandle.port = port
    }
  }

  const onConnected = (handle: Handle) => {
    conHandle.value = handle
  }

  const onReceive = (handle: Handle) => {
    msgHandle.value = handle
  }

  const app = getNextApp()

  app.prepare().then(() => {
    const wss = connectWebSocket(
      app,
      bootHandle.value,
      bootHandle.port
    )
    wss.on('connection', (ws: WebSocket) => {
      ref.send = (message: any) => {
        ws.send(JSON.stringify(message))
      }
      conHandle.value(postMessage)
      ws.on('message', (msg: any) => {
        const json = msg.toString('utf8')
        const message = JSON.parse(json)
        msgHandle.value(message)
      })
    })
  })

  const postMessage = (message: any) => {
    ref.send && ref.send(message)
  }

  return { postMessage, onBoot, onConnected, onReceive }
}
