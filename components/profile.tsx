'use client'

import { FC } from 'react'
import { User } from '@/app/types'

type Props = {
  user: User
}

const Profile: FC<Partial<Props>> = ({ user }) => {
  return (
    <div>
      { JSON.stringify(user) }
    </div>
  )
}

export default Profile
