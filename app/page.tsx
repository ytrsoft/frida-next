'use client'

import { Message } from './types'
import { useState, KeyboardEvent, ChangeEvent } from 'react'
import { mewMessage, wrapMessage } from './utils'
import { useUser, useGroup, useMessages, useWebSocket } from './hook'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Group from '@/components/group'
import Profile from '@/components/profile'
import MessageList from '@/components/messages'
import Block from '@/components/block'

const ChatApp = () => {
  const [content, setContent] = useState('')
  const [user, setUser] = useUser()
  const [selectedUser, setSelectedUser] = useUser()
  const [users, setUsers] = useGroup()
  const [messages, setMessages] = useMessages()

  const { onOpen, onMessage, postMessage } = useWebSocket()

  const handleMessage = (message: Message) => {
    setSelectedUser(message.remoteUser)
    setMessages((msgs) => [...msgs, message])
    if (!users.some((user) => user.id === message.remoteUser?.id)) {
      setUsers((users) => users.concat(message?.remoteUser || []))
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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setContent(event.target.value)
  }

  onOpen(setUser)

  onMessage(handleMessage)

  return (
    <div className="w-screen h-screen">
      <div className="w-full h-full px-[8%] py-[4%] flex justify-center items-center">
        <div className="w-full h-full flex gap-2">
          <div className="h-full flex-[2]">
            <Block>
              <Group
                users={users}
                selectedUser={selectedUser}
                onSelectUser={(user) => setSelectedUser(user)} />
            </Block>
          </div>
          <div className="h-full flex-[7]">
            <Block>
              <div className="h-full">
                <Profile user={user} />
                <MessageList messages={messages} />
                <div className="flex gap-4">
                  <Input
                    type="text"
                    value={content}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown} />
                  <Button onClick={sendMessage}>发送</Button>
                </div>
              </div>
            </Block>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatApp
