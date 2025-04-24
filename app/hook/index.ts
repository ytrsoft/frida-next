import { useEffect, useRef } from 'react'
import { Payload, Type, User, Message } from '../types'

type UserCallback = (user: User) => void
type MessageCallback = (message: Message) => void

const createWebSocket = () => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  return new WebSocket(`${protocol}//${window.location.host}/api/ws`)
}

export const useWebSocket = () => {
  const wsRef = useRef<WebSocket | null>(null)
  const openCallbacks = useRef<UserCallback[]>([])
  const messageCallbacks = useRef<MessageCallback[]>([])

  const onOpen = (callback: UserCallback) => {
    openCallbacks.current.push(callback)
  }

  const onMessage = (callback: MessageCallback) => {
    messageCallbacks.current.push(callback)
  }

  useEffect(() => {
    const ws = createWebSocket()
    wsRef.current = ws

    ws.onmessage = (event: MessageEvent) => {
      try {
        const { payload }: { payload: Payload } = JSON.parse(event.data)
        if (payload.type === Type.INIT) {
          openCallbacks.current.forEach((callback) => callback(payload.data as User))
        } else {
          messageCallbacks.current.forEach((callback) => callback(payload.data as Message))
        }
      } catch (error) {
        console.error('未知错误', error)
      }
    }

    ws.onerror = (error) => {
      console.error('未知错误', error)
    }

    ws.onclose = () => {
      console.log('连接关闭')
    }

    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [])

  return { onOpen, onMessage }
}
