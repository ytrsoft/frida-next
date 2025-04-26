import { DependencyList, useEffect, useRef, useState } from 'react'
import { Payload, Type, User, Message, Sender } from '../types'

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
        if (payload.type === Type.INIT) {
          openHandle.current && openHandle.current(payload.data as User)
        } else {
          messageHandle.current && messageHandle.current(payload.data as Message)
        }
      }
    }

    wsRef.current.onerror = (error) => {
      console.error('服务器错误', error)
    }

    wsRef.current.onclose = () => {
      console.log('服务器关闭')
    }

    return () => {
      wsRef.current?.close()
      wsRef.current = null
    }
  }, [])

  const postMessage = (sender: Sender) => {
    const message = JSON.stringify(sender)
    wsRef.current?.send(message)
  }

  return { onOpen, onMessage, postMessage }
}

export const useUser = () => {
  return useState<User>()
}

export const useGroup = () => {
  return useState<Array<User>>([])
}

export const useMessages = () => {
  return useState<Array<Message>>([])
}

export const useScrollArea = (deps?: DependencyList) => {
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (scrollRef.current) {
      const el = scrollRef.current.querySelector(
        '[data-radix-scroll-area-viewport]'
      ) as HTMLDivElement
      el.scrollTop = el.scrollHeight
    }
  }, deps || [])
  return scrollRef
}
