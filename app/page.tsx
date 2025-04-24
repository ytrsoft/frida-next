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
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* 左侧：联系人列表 */}
      <div className="w-80 bg-white shadow-md border-r border-gray-200 flex flex-col">
        <div className="p-4 flex items-center space-x-4 border-b border-gray-200">
          {currentUser && (
            <>
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm">
                <img
                  src={`/api/image?id=${currentUser.avatar}`}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-900">{currentUser.name}</h2>
                <p className="text-xs text-gray-600">{currentUser.sign || '在线'}</p>
              </div>
            </>
          )}
        </div>

        {/* 联系人列表展示 */}
        <div className="flex-1 overflow-y-auto p-2 space-y-2">
          {remoteUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUserId(user.id)}
              className={`flex items-center p-2 rounded-md cursor-pointer transition-all duration-200 ease-in-out ${
                selectedUserId === user.id
                  ? 'bg-gray-100'
                  : 'hover:bg-gray-100'
              }`}
            >
              <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
                <img
                  src={`/api/image?id=${user.avatar}`}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="ml-3">
                <p className="text-base font-medium text-gray-800">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.sign || 'No status'}</p>
              </div>
            </div>
          ))}
          {remoteUsers.length === 0 && (
            <p className="p-4 text-gray-500 text-center">暂无联系人</p>
          )}
        </div>
      </div>

      {/* 右侧：聊天区域 */}
      <div className="flex-1 flex flex-col">
        {/* 顶部：聊天用户信息 */}
        <div className="p-4 bg-white shadow-sm border-b border-gray-200">
          {selectedUser && (
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full overflow-hidden shadow-sm">
                <img
                  src={`/api/image?id=${selectedUser.avatar}`}
                  alt={selectedUser.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-medium text-gray-900">{selectedUser.name}</h2>
                <p className="text-xs text-gray-600">{selectedUser.sign || '在线'}</p>
              </div>
            </div>
          )}
        </div>

        {/* 详细信息展示区域 */}
        <div className="p-4 bg-white border-b border-gray-200 space-y-2">
          {selectedUser && (
            <>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-xs text-gray-600">年龄:</div>
                <div className="text-xs font-medium text-gray-800">{selectedUser.age || '未知'}</div>

                <div className="text-xs text-gray-600">性别:</div>
                <div className="text-xs font-medium text-gray-800">{selectedUser.sex === 0 ? '女' : '男'}</div>

                <div className="text-xs text-gray-600">星座:</div>
                <div className="text-xs font-medium text-gray-800">{selectedUser.constellation || '未知'}</div>

                <div className="text-xs text-gray-600">设备:</div>
                <div className="text-xs font-medium text-gray-800">{selectedUser.device || '未知'}</div>

                <div className="text-xs text-gray-600">热门:</div>
                <div className="text-xs font-medium text-gray-800">{selectedUser.popular || '未知'}</div>
              </div>
            </>
          )}
        </div>

        {/* 消息展示区域 */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-100 space-y-4">
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
                    className={`max-w-xs lg:max-w-md p-3 rounded-lg shadow-sm transition-all duration-200 ease-in-out ${
                      msg.isMe
                        ? 'bg-green-500 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className="text-xs text-gray-500 mt-1 text-right">
                      {msg.isMe ? 'You' : selectedUser?.name}
                    </p>
                  </div>
                </div>
              ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">选择一个联系人开始聊天</p>
            </div>
          )}
        </div>

        {/* 输入框和发送按钮 */}
        {selectedUserId && (
          <div className="p-4 bg-white border-t border-gray-200 flex items-center space-x-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="请输入消息..."
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={sendMessage}
              className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all duration-200 ease-in-out"
            >
              <PaperAirplaneIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatApp
