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
  const bootHandle = { value: (...args: any) => {} }
  const conHandle = { value: (...args: any) => {} }
  const msgHandle = { value: (...args: any) => {} }

  const onBoot = (handle: Handle) => {
    bootHandle.value = handle
  }

  const onConnected = (handle: Handle) => {
    conHandle.value = handle
  }

  const onMessage = (handle: Handle) => {
    msgHandle.value = handle
  }

  const app = getNextApp()

  app.prepare().then(() => {
    const wss = connectWebSocket(app, () => {
      bootHandle.value && bootHandle.value()
    })
    wss.on('connection', (ws: WebSocket) => {
      conHandle.value && conHandle.value(ws)
      ws.on('message', (msg: any) => {
        const json = msg.toString('utf8')
        const message = JSON.parse(json)
        msgHandle.value && msgHandle.value(message)
      })
    })
  })

  return { onBoot, onConnected, onMessage }
}

export const useMomo = () => {
  const { onConnected, onMessage } = useWebSocket()
  const api = {
    value: {
      init: () => {},
      receive: () => {},
      post: (msg: Message) => {}
    }
  }
  const wsRef = { value: { send: (data: any) => {} } }
  const openHandle = { value: (...args: any) => {} }
  const onOpen = (handle: Handle) => {
    openHandle.value = handle
  }
  onConnected((ws: WebSocket) => {
    wsRef.value = ws
    useFrida({
      script,
      name: 'MOMO陌陌',
      onMessage: (message) => {
        ws.send(JSON.stringify(message))
      }
    }).then((inst) => {
      api.value = inst.api as any
      openHandle.value && openHandle.value()
      process.on('SIGINT', () => {
        inst.unload()
      })
    })
  })
  return { api, onOpen, onMessage }
}
