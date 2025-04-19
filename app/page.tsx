'use client'

import { useEffect, useRef, useState } from 'react'

interface MessageData {
  id: string
  distance: string
  content: string
  fromId: string
  toId: string
  type: number
  remoteUser: {
    id: string
    name: string
    age: number
    sex: number
    constellation: string
    sign: string
    avatar: string
    popular: string
  }
}

interface Message {
  type: number
  data: MessageData
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/ws`)
    wsRef.current = ws

    ws.onmessage = ({ data }) => {
      const newMessage = JSON.parse(data).payload as Message
      setMessages(prev => [...prev, newMessage])
    }

    ws.onerror = (error) => {
      console.error('未知错误', error)
    }

    ws.onclose = () => {
      console.log('连接已关闭')
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-4 md:p-8">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">消息列表</h1>
      <div className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 space-y-4">
        {messages.length === 0 ? (
          <p className="text-center text-gray-600 dark:text-gray-400">暂无消息</p>
        ) : (
          messages.map((msg, index) => (
            <div
              key={index}
              className="flex flex-col bg-gray-50 dark:bg-gray-700 p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <span className="text-lg font-semibold text-gray-800 dark:text-white">
                {msg.data.remoteUser.name}
              </span>
              <p className="text-gray-700 dark:text-white mt-2">
                {msg.data.content}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
