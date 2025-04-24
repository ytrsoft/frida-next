'use client'

import { useWebSocket } from './hook'
import { Message, User } from './types'


const App = () => {

  const { onOpen, onMessage, postMessage } = useWebSocket()

  onOpen((user: User) => {
    console.log('当前用户', user)
    postMessage(user)
  })

  onMessage((message: Message) => {
    console.log('消息', message)
  })

  return (
    <h1>Frida App</h1>
  )
}

export default App
