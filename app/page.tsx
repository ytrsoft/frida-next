'use client'

import { useWebSocket } from './hook'
import { Message, User } from './types'


const Home = () => {

  const { onOpen, onMessage } = useWebSocket()

  onOpen((user: User) => {
    console.log('onOpen', JSON.stringify(user, null, 2))
  })

  onMessage((message: Message) => {
    console.log('onMessage', JSON.stringify(message, null, 2))
  })

  return (
    <h1>React</h1>
  )
}

export default Home
