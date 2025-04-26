'use client'

import { FC } from 'react'
import { User } from '@/app/types'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

type Props = {
  user: User
}

const Photo: FC<Partial<Props>> = ({ user }) => {
  const borderClass = user?.sex ? 'border-pink-500' : 'border-blue-500';

  return (
    <div>
      <Avatar className={`border ${borderClass} border-2 rounded-full`}>
        <AvatarImage src={`/api/image?id=${user?.avatar}`} />
        <AvatarFallback>
          {(user?.name || user?.name)?.charAt(0)}
        </AvatarFallback>
      </Avatar>
    </div>
  )
}

export default Photo
