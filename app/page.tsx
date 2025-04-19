'use client'

import { useEffect, useRef, useState } from 'react'

export default function Home() {
  const [message, setMessage] = useState<Array<any>>([])
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/ws`)
    wsRef.current = ws

    ws.onmessage = ({ data }) => {
      const currMessage = JSON.parse(data)
      setMessage((prevMessage) => [...prevMessage, currMessage])
    }

    ws.onerror = (error) => {
      console.error('发生错误', error)
    }

    ws.onclose = () => {
      console.log('连接关闭')
    }

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
      }
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">Frida Next</h1>
      <ul className="w-full max-w-md bg-white dark:bg-gray-800 shadow-md rounded-lg divide-y divide-gray-200 dark:divide-gray-700">
        {message.map((msg, index) => (
          <li
            key={index}
            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 text-gray-800 dark:text-white"
          >
            {JSON.stringify(msg.payload)}
          </li>
        ))}
      </ul>
    </div>
  )
}
