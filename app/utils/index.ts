import { v4 } from 'uuid'
import { Message, Sender, User } from '../types'

export const uuid = () => v4()

export interface MessageBuilder {
  fromUser: User
  toUser: User
  content: string
}

export const mewMessage= (builder: MessageBuilder): Message => {
  return {
    id: uuid(),
    distance: '0',
    content: builder.content,
    fromId: builder.fromUser?.id,
    toId: builder.toUser?.id,
    type: 0,
    remoteUser: builder.fromUser,
    isMe: true
  }
}

export const wrapMessage= (message: Message): Sender => {
  return {
    content: message.content,
    momoid: message.fromId,
    remoteId: message.toId
  }
}
