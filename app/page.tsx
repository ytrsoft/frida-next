'use client'

import { v4 as uuid } from 'uuid'
import { find } from 'lodash'
import { Fragment, KeyboardEvent, useState } from 'react'
import { useWebSocket } from './hook'
import { Message, User } from './types'

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
    const hasUser = find(group, { id: message.remoteUser?.id })
    if (!hasUser) {
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

  return (
    <Fragment>
      <p>{ JSON.stringify(user) }</p>
      <p>{ JSON.stringify(selectUser) }</p>
      <p>{ JSON.stringify(messages) }</p>
      <input type="text" onKeyDown={msgKeyDown} />
      <button>发送</button>
    </Fragment>
  )
}

export default ChatApp
