export enum Type {
  INIT = 0,
  MSG = 1
}

export interface Payload<T = any> {
  type: Type
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
}

export type User = Partial<IUser>

interface IMessage {
  id: string
  distance: string
  content: string
  fromId: string
  toId: string
  type: number
  remoteUser: User
}

export type Message = Partial<IMessage>
