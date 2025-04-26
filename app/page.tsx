'use client'

import { Message } from './types'
import { useState, KeyboardEvent } from 'react'
import { mewMessage, wrapMessage } from './utils'
import { useUser, useGroup, useMessages, useWebSocket } from './hook'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Photo from '@/components/photo'
import Profile from '@/components/profile'
import MessageList from '@/components/messages'

const ChatApp = () => {
  const [content, setContent] = useState('')
  const [user, setUser] = useUser()
  const [selectedUser, setSelectedUser] = useUser()
  const [group, setGroup] = useGroup()
  const [messages, setMessages] = useMessages()

  const { onOpen, onMessage, postMessage } = useWebSocket()

  const handleMessage = (message: Message) => {
    setSelectedUser(message.remoteUser)
    setMessages((msgs) => [...msgs, message])
    if (!group.some((u) => u.id === message.remoteUser?.id)) {
      setGroup((g) => g.concat(message?.remoteUser || []))
    }
  }

  const sendMessage = () => {
    if (!selectedUser || !user || !content.trim()) return
    const msg = mewMessage({
      content,
      fromUser: user,
      toUser: selectedUser
    })
    setMessages((msgs) => [...msgs, msg])
    const sender = wrapMessage(msg)
    postMessage(sender)
    setContent('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage()
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value);
  }

  onOpen(setUser)

  onMessage(handleMessage)

  return (
    <div className="p-8">
      <Photo user={user} />
      <Profile user={user} />
      <MessageList messages={messages} />
      <h1 className="flex gap-2">
        <Input
          type="text"
          value={content}
          onChange={handleChange}
          onKeyDown={handleKeyDown} />
        <Button onClick={sendMessage}>发送</Button>
      </h1>
    </div>
  )
}

export default ChatApp
