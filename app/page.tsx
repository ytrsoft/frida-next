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

  onOpen((user: User) => {
    setCurrentUser(user)
  })

  onMessage((message: Message) => {
    const displayMessage: DisplayMessage = {
      ...message,
      isMe: false,
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
      isMe: true,
    }

    setMessages((prev) => [...prev, newMessage])
    postMessage({
      momoid: currentUser.id,
      remoteId: selectedUserId,
      content: messageInput,
    })
    setMessageInput('')
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      sendMessage()
    }
  }

  const selectedUser = remoteUsers.find((user) => user.id === selectedUserId)

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Left Sidebar - Remote Users List */}
      <div className="w-80 bg-white shadow-lg border-r border-gray-200 flex flex-col">
        <div className="p-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white">
          <h1 className="text-xl font-bold">Chat</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {remoteUsers.map((user) => (
            <div
              key={user.id}
              onClick={() => setSelectedUserId(user.id)}
              className={`flex items-center p-4 cursor-pointer transition-colors duration-200 ${
                selectedUserId === user.id
                  ? 'bg-indigo-50 border-l-4 border-indigo-500'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                <img src={`/api/image?id=${user.avatar}`} className="w-6 h-6 text-gray-600" />
              </div>
              <div className="ml-3">
                <p className="font-semibold text-gray-800">{user.name}</p>
                <p className="text-sm text-gray-500 truncate">{user.sign || 'No status'}</p>
              </div>
            </div>
          ))}
          {remoteUsers.length === 0 && (
            <p className="p-4 text-gray-500 text-center">No users available</p>
          )}
        </div>
      </div>

      {/* Right Chat Panel */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        {selectedUser ? (
          <div className="p-4 bg-white shadow-sm border-b border-gray-200 flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <img src={`/api/image?id=${selectedUser.avatar}`} className="w-6 h-6 text-gray-600" />
            </div>
            <div className="ml-3">
              <h2 className="text-lg font-semibold text-gray-800">{selectedUser.name}</h2>
              <p className="text-sm text-gray-500">{selectedUser.constellation} · {selectedUser.popular}</p>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-white shadow-sm border-b border-gray-200">
            <p className="text-gray-500">Select a user to start chatting</p>
          </div>
        )}

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-gray-100">
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
                    className={`max-w-xs lg:max-w-md p-3 rounded-lg shadow-sm ${
                      msg.isMe
                        ? 'bg-indigo-500 text-white'
                        : 'bg-white text-gray-800 border border-gray-200'
                    }`}
                  >
                    <p>{msg.content}</p>
                  </div>
                </div>
              ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">Select a user to view messages</p>
            </div>
          )}
        </div>

        {/* Message Input */}
        {selectedUserId && (
          <div className="p-4 bg-white border-t border-gray-200 flex items-center">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={sendMessage}
              className="p-2 bg-indigo-500 text-white rounded-r-lg hover:bg-indigo-600 transition-colors duration-200"
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
