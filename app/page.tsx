'use client'

import { v4 as uuid } from 'uuid'
import { KeyboardEvent, useState } from 'react'
import { useWebSocket } from './hook'
import { Message, User } from './types'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

const ChatApp = () => {
  const [user, setUser] = useState<User>()
  const [selectUser, setSelectUser] = useState<User>()
  const [messages, setMessages] = useState<Array<Message>>([])
  const [group, setGroup] = useState<Array<User>>([])
  const [content, setContent] = useState<string>('')

  const { onOpen, onMessage, postMessage } = useWebSocket()

  onOpen(setUser)
  onMessage((message) => {
    setSelectUser(message.remoteUser)
    setMessages((msgs) => [...msgs, message])
    if (!group.some((u) => u.id === message.remoteUser?.id)) {
      setGroup((g) => g.concat(message?.remoteUser || []))
    }
  })

  const sendMessage = () => {
    if (!selectUser || !user || !content.trim()) return
    const msg: Message = {
      id: uuid(),
      distance: '0',
      content,
      fromId: user?.id,
      toId: selectUser?.id,
      type: 0,
      remoteUser: user,
      isMe: true
    }
    setMessages((msgs) => [...msgs, msg])
    postMessage({
      content,
      momoid: user?.id,
      remoteId: selectUser?.id
    })
    setContent('')
  }

  const msgKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage()
    }
  }

  const formatDistance = (meters?: any) => {
    if (!meters) return '0m'
    if (meters >= 1000) return `${(meters / 1000).toFixed(1)}km`
    return `${meters.toFixed(meters)}m`
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-700">
      <div className="flex gap-6 w-11/12 max-w-screen-xl h-[85vh] rounded-2xl">
        <Card className="flex-[2] bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl dark:bg-gray-800/90 dark:text-gray-100 border border-gray-200/50 dark:border-gray-700/50 transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-5 space-y-4">
            <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-purple-600 dark:from-indigo-400 dark:to-purple-500">
              联系人
            </div>
            <div className="space-y-2 h-[calc(100%-2.5rem)] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300/50 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-gray-600/50 dark:hover:scrollbar-thumb-gray-600">
              {group.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400 dark:text-gray-500">
                  <div className="i-lucide-contact rounded-full bg-gray-200/50 dark:bg-gray-700/50 p-3 mb-2 text-2xl" />
                  <div>没有联系人</div>
                </div>
              ) : (
                group.map((user) => (
                  <div
                    key={user?.id}
                    className={`flex items-center p-3 rounded-xl transition-all duration-200 hover:bg-indigo-50/70 dark:hover:bg-gray-700/70 cursor-pointer ${
                      selectUser?.id === user.id
                        ? 'bg-gradient-to-r from-indigo-50/80 to-purple-50/80 dark:from-gray-700/80 dark:to-gray-700/80 border border-indigo-200/50 dark:border-gray-600/50 shadow-sm'
                        : ''
                    }`}
                    onClick={() => setSelectUser(user)}
                  >
                    <Avatar className="h-10 w-10 border border-indigo-200/50 dark:border-gray-600/50">
                      <AvatarImage src={`/api/image?id=${user?.avatar}`} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-600 dark:to-gray-700 font-medium">
                        {user?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="ml-3 overflow-hidden">
                      <div className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">
                        {user?.name}
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">{user?.age}</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {user?.sign || '这个人很懒'}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
        <Card className="flex-[8] bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl dark:bg-gray-800/90 dark:text-gray-100 border border-gray-200/50 dark:border-gray-700/50 flex flex-col transition-all duration-300 hover:shadow-lg">
          <CardHeader className="flex gap-4 p-5 border-b dark:border-gray-700/50 bg-white/60 dark:bg-gray-700/60 rounded-t-2xl">
            <div className="flex gap-3 items-center">
              <Avatar className="h-11 w-11 border border-indigo-200/50 dark:border-gray-600/50">
                <AvatarImage src={`/api/image?id=${user?.avatar}`} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-600 dark:to-gray-700 font-medium">
                  {(user?.name || user?.name)?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="overflow-hidden">
                <div className="font-bold text-gray-800 dark:text-gray-100 truncate">
                  {user?.name}
                  <span className="ml-2 text-sm font-medium text-indigo-500/80 dark:text-indigo-400/80">
                    {user?.device}
                  </span>
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  {user?.sign}
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-5 flex-1 overflow-y-auto bg-gradient-to-b from-white/40 via-white/20 to-white/10 dark:from-gray-800/40 dark:via-gray-800/20 dark:to-gray-800/10 scrollbar-thin scrollbar-thumb-gray-300/50 hover:scrollbar-thumb-gray-300 scrollbar-track-transparent dark:scrollbar-thumb-gray-600/50 dark:hover:scrollbar-thumb-gray-600">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 dark:text-gray-500">
                <div className="i-lucide-message-square rounded-full bg-gray-200/50 dark:bg-gray-700/50 p-3 mb-2 text-2xl" />
                <div className="text-lg mb-2">没有消息</div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 items-start my-3 ${msg.isMe ? 'justify-end' : 'justify-start'}`}
                >
                  {!msg.isMe && (
                    <Avatar className="h-8 w-8 mt-1 border border-indigo-200/50 dark:border-gray-600/50">
                      <AvatarImage src={`/api/image?id=${msg.remoteUser?.avatar}`} />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-600 dark:to-gray-700">
                        {msg.remoteUser?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2 transition-all duration-200 ${
                      msg.isMe
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-br-none shadow-md'
                        : 'bg-gray-100 dark:bg-gray-700 rounded-bl-none shadow-sm'
                    }`}
                  >
                    <div className="text-sm">{msg.content}</div>
                    <div
                      className={`text-[0.7rem] mt-1 text-right flex items-center justify-end gap-1 ${
                        msg.isMe ? 'text-indigo-100/80' : 'text-gray-500/80 dark:text-gray-400/80'
                      }`}
                    >
                      {
                        !msg.isMe && (
                          <span>{formatDistance(msg?.distance)}</span>
                        )
                      }
                    </div>
                  </div>
                  {msg.isMe && (
                    <Avatar className="h-8 w-8 mt-1 border border-indigo-200/50 dark:border-gray-600/50">
                      <AvatarImage src={`/api/image?id=${msg.remoteUser?.avatar}`} />
                      <AvatarFallback className="text-xs bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-600 dark:to-gray-700">
                        {msg.remoteUser?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))
            )}
          </CardContent>
          <CardFooter className="p-5 border-t dark:border-gray-700/50 bg-white/60 dark:bg-gray-700/60 rounded-b-2xl">
            <div className="flex w-full items-center gap-2">
              <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                onKeyDown={msgKeyDown}
                placeholder="请输入消息..."
                className="flex-1 rounded-full bg-white/90 dark:bg-gray-700/90 border-gray-300/50 dark:border-gray-600/50 focus-visible:ring-2 focus-visible:ring-indigo-500/50 focus-visible:ring-offset-2 transition-all duration-200 hover:border-indigo-300/50 dark:hover:border-indigo-500/50"
              />
              <Button
                onClick={sendMessage}
                className="rounded-full h-11 w-11 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 dark:from-indigo-600 dark:to-purple-600 dark:hover:from-indigo-700 dark:hover:to-purple-700 shadow-md transition-all duration-200 transform hover:scale-105"
                disabled={!content.trim()}
              >
                <PaperAirplaneIcon className="h-5 w-5 text-white" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default ChatApp
