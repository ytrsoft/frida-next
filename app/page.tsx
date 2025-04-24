'use client'

import { useWebSocket } from './hook'
import { Message, User } from './types'


const App = () => {

  const { onOpen, onMessage } = useWebSocket()

  onOpen((user: User) => {
    console.log(user)
  })

  onMessage((message: Message) => {
    console.log(message)
  })

  return (
    <h1>Frida</h1>
  )
}

export default App
