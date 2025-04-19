'use client'

import { useEffect, useRef } from 'react'

export default function Home() {

  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    const ws = new WebSocket(`${protocol}//${window.location.host}/api/ws`)
    wsRef.current = ws
    ws.onmessage = (event) => {
      console.log('message', event)
    }
  }, [])

  return <h1>Frida</h1>
}
