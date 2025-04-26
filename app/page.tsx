'use client'

import { Message } from './types'
import { useState, KeyboardEvent, ChangeEvent } from 'react'
import { mewMessage, wrapMessage } from './utils'
import { useUser, useGroup, useMessages, useWebSocket, useScrollArea } from './hook'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Group from '@/components/group'
import Profile from '@/components/profile'
import MessageList from '@/components/messages'
import Block from '@/components/block'

import { ScrollArea } from '@/components/ui/scroll-area'

const ChatApp = () => {
  const [content, setContent] = useState('')
  const [user, setUser] = useUser()
  const [selectedUser, setSelectedUser] = useUser()
  const [users, setUsers] = useGroup()
  const [messages, setMessages] = useMessages()

  const { onOpen, onMessage, postMessage } = useWebSocket()

  const groupScroll = useScrollArea([users])
  const chatScroll = useScrollArea([messages])

  const handleMessage = (message: Message) => {
    console.log('消息', JSON.stringify(message, null, 2))
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
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-3/4 h-3/4">
        <div className="w-full h-full flex gap-2">
          <div className="h-full flex-[2]">
            <Block>
              <div className="h-full flex flex-col">
                <ScrollArea className="flex-1" ref={groupScroll}>
                  <div className="space-y-2">
                    <Group
                      users={users}
                      selectedUser={selectedUser}
                      onSelectUser={(user) => setSelectedUser(user)} />
                  </div>
                </ScrollArea>
              </div>
            </Block>
          </div>
          <div className="h-full flex-[7]">
            <Block>
              <div className="h-full flex flex-col">
                <div className="flex-none">
                  <Profile user={user} />
                </div>
                <ScrollArea className="flex-1 my-3 space-y-6" ref={chatScroll}>
                  <MessageList messages={messages} />
                </ScrollArea>
                <div className="flex-none">
                  <div className="flex gap-4">
                    <Input
                      type="text"
                      value={content}
                      onChange={handleChange}
                      onKeyDown={handleKeyDown} />
                    <Button onClick={sendMessage}>发送</Button>
                  </div>
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
