import { useEffect, useRef } from 'react'
import { Payload, Type, User, Message } from '../types'

type UserHandle = (user: User) => void
type MessageHandle = (message: Message) => void

const createWebSocket = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return new WebSocket(`${protocol}//${window.location.host}/api/ws`)
}

export const useWebSocket = () => {
  const wsRef = useRef<WebSocket | null>(null)
  const openHandle = useRef<UserHandle>(null)
  const messageHandle = useRef<MessageHandle>(null)

  const onOpen = (handle: UserHandle) => {
    openHandle.current = handle
  }

  const onMessage = (handle: MessageHandle) => {
    messageHandle.current = handle
  }

  const ws = createWebSocket()

  useEffect(() => {
    wsRef.current = ws

    ws.onmessage = (event: MessageEvent) => {
      const { payload }: { payload: Payload } = JSON.parse(event.data)
      if (payload.type === Type.INIT) {
        openHandle.current && openHandle.current(payload.data as User)
      } else {
        messageHandle.current && messageHandle.current(payload.data as Message)
      }
    }

    ws.onerror = (error) => {
      console.error('Error', error)
    }

    ws.onclose = () => {
      console.log('Closed')
    }

    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [])

  const postMessage = (data: any) => {
    const message = JSON.stringify(data)
    ws.send(message)
  }

  return { onOpen, onMessage, postMessage }
}
