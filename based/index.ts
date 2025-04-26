
import next from 'next'
import { parse } from 'node:url'
import { Socket } from 'node:net'
import { WebSocketServer, WebSocket } from 'ws'
import { createServer, IncomingMessage, ServerResponse } from 'node:http'

interface Sender {
  momoid: string
  remoteId: string
  content: string
}

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

type ConnectdHandle = (ws: WebSocket) => void
type CreatedHandle = () => void
type BindHandle = (message: any) => void

interface WSRef {
  port: number,
  bind: BindHandle,
  send: (message: any) => void,
  created: () => void,
  connected: ConnectdHandle
}

export const useWebSocket = () => {

  const ref: WSRef = {
    port: 3000,
    bind: (message: any) => {},
    send: (message: Sender) => {},
    created: () => {},
    connected: (ws?: WebSocket) => {},
  }

  const onCreated = (handle: CreatedHandle, port?: number) => {
    ref.created = handle
    if (port) {
      ref.port = port
    }
  }

  const onConnected = (handle: ConnectdHandle) => {
    ref.connected = handle
  }

  const onReceive = (handle: BindHandle) => {
    ref.bind = handle
  }

  const app = getNextApp()

  app.prepare().then(() => {
    const { port, created } = ref
    const wss = connectWebSocket(app, created, port)
    wss.on('connection', (ws: WebSocket) => {
      ref.send = (message: any) => {
        ws.send(JSON.stringify(message))
      }
      ref.connected(ws)
      ws.on('message', (msg: any) => {
        const json = msg.toString('utf8')
        const message = JSON.parse(json)
        ref.bind(message)
      })
    })
  })

  const postMessage = (message: Sender) => {
    ref.send && ref.send(message)
  }

  return { onCreated, onConnected, onReceive, postMessage }
}
