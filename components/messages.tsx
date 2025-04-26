'use client'

import { FC } from 'react'
import { Message } from '@/app/types'

type Props = {
  messages: Array<Message>
}

const Messages: FC<Props> = ({ messages }) => {
  return (
    <div className="p-4 space-y-4">
        {
          messages.map((message) => (
            <h1>{JSON.stringify(message)}</h1>
          ))
        }
    </div>
  )
}

export default Messages
