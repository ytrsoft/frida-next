export enum Type {
  INIT = 0,
  MSG = 1,
  CUSTOM = 2
}

export interface Payload<T = any> {
  type: Type | string
  description: string
  data: T
}

interface IUser {
  id: string
  name: string
  age: number
  sex: number
  constellation: string
  sign: string
  avatar: string
  device: string
  popular: string
  distance: number
}

export type User = Partial<IUser>

interface IMessage {
  id: string
  distance: string
  content: string
  fromId: string
  toId: string
  type: number
  isMe: boolean
  remoteUser: User
}

export interface ISender {
  momoid: string
  remoteId: string
  content: string
}


export type Message = Partial<IMessage>

export type Sender = Partial<ISender>
