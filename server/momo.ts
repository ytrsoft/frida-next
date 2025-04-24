import { WebSocket } from 'ws'
import { getNextApp, connectWebSocket, useFrida } from './index'
import script from './script'

export interface Message {
  momoid: string
  remoteId: string
  content: string
}

export interface MomoExports {
  receive: () => void
  post: (msg: Message) => void
  init: () => void
}

type Handle = (...args: any) => void

const useWebSocket = () => {
  const bootHandle = { current: (...args: any) => {} }
  const conHandle = { current: (...args: any) => {} }
  const msgHandle = { current: (...args: any) => {} }

  const onBoot = (handle: Handle) => {
    bootHandle.current = handle
  }

  const onConnected = (handle: Handle) => {
    conHandle.current = handle
  }

  const onMessage = (handle: Handle) => {
    msgHandle.current = handle
  }

  const app = getNextApp()

  app.prepare().then(() => {
    const wss = connectWebSocket(app, () => {
      bootHandle.current && bootHandle.current()
    })
    wss.on('connection', (ws: WebSocket) => {
      conHandle.current && conHandle.current(ws)
      ws.on('message', (msg: any) => {
        const json = msg.toString('utf8')
        const message = JSON.parse(json)
        msgHandle.current && msgHandle.current(message)
      })
    })
  })

  return { onBoot, onConnected, onMessage }
}

export const useMomo = () => {
  const { onConnected, onMessage } = useWebSocket()
  const exports = { current: {} }
  const wsRef = { current: { send: (data: any) => {} } }
  const openHandle = { current: (...args: any) => {} }
  const onOpen = (handle: Handle) => {
    openHandle.current = handle
  }
  onConnected((ws: WebSocket) => {
    wsRef.current = ws
    useFrida({
      script,
      name: 'MOMO陌陌',
      onMessage: (message) => {
        ws.send(JSON.stringify(message))
      }
    }).then((inst) => {
      exports.current = inst.api
      openHandle.current && openHandle.current(inst.api)
      process.on('SIGINT', () => {
        inst.unload()
      })
    })
  })
  return { exports, onOpen, onMessage }
}
