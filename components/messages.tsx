'use client'

import type { FC } from 'react'
import type { Message, User } from '@/app/types'
import Photo from './photo'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'
type Props = {
  messages: Array<Message>
  currentUser?: User
}

const MessageList: FC<Props> = ({ messages, currentUser }) => {
  const desc = (message: Message) => {
    const user = message.remoteUser
    if (!message.isMe && user?.distance) {
      return user?.name + '-' + user?.distance
    }
    return user?.name
  }
  return (
    <ScrollArea className="space-y-6 min-h-[100% - 200px]">
      {messages.map((message) => {
        const isMe = message.fromId === currentUser?.id || message.isMe

        return (
          <div key={message.id} className={cn("flex gap-3 mb-6", isMe ? "flex-row-reverse" : "flex-row")}>
            <Photo user={message.remoteUser} />

            <div className={cn("max-w-[70%]", isMe ? "items-end" : "items-start")}>
              <div className={cn("flex items-center gap-2 mb-1", isMe ? "justify-end" : "justify-start")}>
                <span className="text-sm font-medium">{desc(message)}</span>
              </div>

              <div
                className={cn(
                  "p-3 rounded-lg",
                  isMe ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-muted rounded-tl-none",
                )}
              >
                <p className="text-sm break-words">{message.content}</p>
              </div>
            </div>
          </div>
        )
      })}
    </ScrollArea>
  )
}

export default MessageList
