import next from 'next'
import { parse } from 'node:url'
import { Socket } from 'node:net'
import { WebSocket, WebSocketServer } from 'ws'
import { createServer, Server, IncomingMessage, ServerResponse } from 'node:http'
import * as frida from 'frida'

const nextApp = next({ dev: process.env.NODE_ENV !== 'production' })
const handle = nextApp.getRequestHandler()

const defineWebSocket = (port = 3000) => {
  const wss = new WebSocketServer({ noServer: true })
  const server: Server = createServer((req: IncomingMessage, res: ServerResponse) => {
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
  server.listen(port, () => {
    console.log(`服务器启动成功`)
  })
  return wss
}

const source = `
rpc.exports = {
  hello: function () {
    return 'Hello';
  },
  failPlease: function () {
    oops;
  }
};
`;

const createMomoProcess = async () => {
  const device = await frida.getUsbDevice()
  const session = await device.attach('MOMO陌陌')
  const script = await session.createScript(source)
  await script.load()
  const rpc = script.exports
  return {
    rpc,
    unload: () => {
      script.unload()
    }
  }
}

nextApp.prepare().then(() => {
  const wss = defineWebSocket()
  createMomoProcess().then((p) => {
    p.rpc.hello().then((x) => {
      console.log(x)
    })
    wss.on('connection', (ws: WebSocket) => {
      ws.on('message', (message: Buffer) => {
        console.log(`Message received: ${message}`)
      })
    })
    process.on('SIGINT', () => {
      p.unload()
    })
  })
})
