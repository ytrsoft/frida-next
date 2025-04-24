import { useEffect, useRef } from 'react'
import { Payload, Type, User, Message } from '../types'

type UserHandle = (user: User) => void
type MessageHandle = (message: Message) => void

const defineWebSocket = (location: Location) => {
  const protocol = location.protocol === 'https:' ? 'wss:' : 'ws:'
  return new WebSocket(`${protocol}//${location.host}/api/ws`)
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

  useEffect(() => {
    wsRef.current = defineWebSocket(window.location)

    wsRef.current.onmessage = (event: MessageEvent) => {
      const data = JSON.parse(event.data)
      if (data.type === 'error') {
        console.error(data.description)
      } else {
        const payload = data.payload as Payload
        console.log('>>>', payload)
        if (payload.type === Type.INIT) {
          openHandle.current && openHandle.current(payload.data as User)
        } else {
          messageHandle.current && messageHandle.current(payload.data as Message)
        }
      }
    }

    wsRef.current.onerror = (error) => {
      console.error('Error', error)
    }

    wsRef.current.onclose = () => {
      console.log('Closed')
    }

    return () => {
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [])

  const postMessage = (data: any) => {
    const message = JSON.stringify(data)
    wsRef.current?.send(message)
  }

  return { onOpen, onMessage, postMessage }
}
