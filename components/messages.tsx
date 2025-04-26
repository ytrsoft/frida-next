'use client'

import type { FC } from 'react'
import type { Message, User } from '@/app/types'
import Photo from './photo'
import { cn } from '@/lib/utils'

type Props = {
  messages: Array<Message>
  currentUser?: User
}

const MessageList: FC<Props> = ({ messages, currentUser }) => {
  // 格式化距离的函数，更具描述性的函数名
  const formatDistance = (distance: number) => {
    if (distance < 1000) {
      return `${Math.round(distance)} m`
    }
    const distanceInKm = distance / 1000
    return `${distanceInKm.toFixed(2)} km`
  }

  const generateMessageDescription = (message: Message) => {
    const sender = message.remoteUser
    if (!message.isMe) {
      return `${sender?.name} - ${formatDistance(message?.distance as any)}`
    }
    return sender?.name
  }

  return messages.map((message) => {
    const isCurrentUserMessage = message.fromId === currentUser?.id || message.isMe

    return (
      <div key={message.id} className={cn("flex gap-3 mb-6", isCurrentUserMessage ? "flex-row-reverse" : "flex-row")}>
        <Photo user={message.remoteUser} />

        <div className={cn("max-w-[70%]", isCurrentUserMessage ? "items-end" : "items-start")}>
          <div className={cn("flex items-center gap-2 mb-1", isCurrentUserMessage ? "justify-end" : "justify-start")}>
            <span className="text-sm font-medium">{generateMessageDescription(message)}</span>
          </div>

          <div
            className={cn(
              "p-3 rounded-lg",
              isCurrentUserMessage ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted rounded-tl-none",
            )}
          >
            <p className="text-sm break-words">{message.content}</p>
          </div>
        </div>
      </div>
    )
  })
}

export default MessageList
