'use client'

import { useState } from 'react'
import { find } from 'lodash'
import { v4 as uuid } from 'uuid'
import { useWebSocket } from './hook'
import { Message, User } from './types'
import { PaperAirplaneIcon } from '@heroicons/react/24/outline'

interface DisplayMessage extends Message {
  isMe: boolean
}

const ChatApp = () => {
  const [selectedUserId, setSelectedUserId] = useState<string>()
  const [remoteUsers, setRemoteUsers] = useState<User[]>([])
  const [currentUser, setCurrentUser] = useState<User>()
  const [messageInput, setMessageInput] = useState<string>('')
  const [messages, setMessages] = useState<DisplayMessage[]>([])
  const { onOpen, onMessage, postMessage } = useWebSocket()

  onOpen((user) => {
    setCurrentUser(user)
  })

  onMessage((message) => {
    const displayMessage: DisplayMessage = {
      ...message,
      isMe: false
    }
    const remoteUserId = message.remoteUser?.id
    setSelectedUserId(remoteUserId)
    setMessages((prev) => [...prev, displayMessage])

    const existingUser = find(remoteUsers, { id: remoteUserId })
    if (!existingUser && message.remoteUser) {
      setRemoteUsers((prev) => prev.concat(message?.remoteUser || []))
    }
  })

  const sendMessage = () => {
    if (!selectedUserId || !currentUser || !messageInput.trim()) return

    const newMessage: DisplayMessage = {
      id: uuid(),
      distance: '0',
      content: messageInput,
      fromId: currentUser.id,
      toId: selectedUserId,
      type: 0,
      remoteUser: currentUser,
      isMe: true
    }

    setMessages((prev) => [...prev, newMessage])
    postMessage({
      momoid: currentUser.id,
      remoteId: selectedUserId,
      content: messageInput
    })
    setMessageInput('')
  }

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      sendMessage()
    }
  }

  const selectedUser = remoteUsers.find((user) => user.id === selectedUserId)

  return (
    <div className="flex h-screen bg-gray-50 font-sans">
      <div className="w-80 bg-white shadow-md border-r border-gray-100 flex flex-col">
        {currentUser && (
          <div className="p-6 bg-white shadow-sm border-b border-gray-100 flex items-center">
            <div className="w-14 h-14 rounded-full overflow-hidden shadow-md">
              <img
                src={`/api/image?id=${currentUser.avatar}`}
                alt={currentUser.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-bold text-gray-800">
                {currentUser.name}
              </h2>
              <p className="text-sm text-gray-600">
                {`${currentUser.constellation} · ${currentUser.popular}`}
              </p>
              <p className="text-xs text-gray-500">
                {currentUser.sign || "在线"}
              </p>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {remoteUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUserId(user.id)}
              className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 ease-in-out ${
                selectedUserId === user.id ? 'bg-blue-50 border-l-4 border-blue-500 shadow-md' : 'hover:bg-gray-100'
              }`}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-md">
                <img src={`/api/image?id=${user.avatar}`} alt={user.name} className="w-full h-full object-cover" />
              </div>
              <div className="ml-4">
                <p className="text-lg font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-600 truncate">{user.sign || 'No status'}</p>
              </div>
            </div>
          ))}
          {remoteUsers.length === 0 && (
            <p className="p-4 text-gray-500 text-center">暂无联系人</p>
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        <div className="p-6 bg-white shadow-sm border-b border-gray-100" />
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50 space-y-4">
          {selectedUserId ? (
            messages
              .filter(
                (msg) =>
                  (msg.fromId === currentUser?.id && msg.toId === selectedUserId) ||
                  (msg.fromId === selectedUserId && msg.toId === currentUser?.id)
              )
              .map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md p-4 rounded-lg shadow-md transition-all duration-200 ease-in-out ${
                      msg.isMe
                        ? 'bg-blue-500 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">选择一个联系人开始聊天</p>
            </div>
          )}
        </div>
        {selectedUserId && (
          <div className="p-6 bg-white border-t border-gray-100 flex items-center space-x-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="请输入消息..."
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={sendMessage}
              className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all duration-200 ease-in-out"
            >
              <PaperAirplaneIcon className="w-6 h-6" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatApp
