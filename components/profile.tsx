'use client'

import type { FC } from 'react'
import type { User } from '@/app/types'
import Photo from './photo'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, MapPin, Smartphone, Star, UserIcon } from 'lucide-react'

type Props = {
  user: User
}

const Profile: FC<Partial<Props>> = ({ user }) => {
  return (
    <div className="flex items-center gap-3">
      <Photo user={user} />
      <div>
        <h3 className="font-medium">
          {
            user && (`${user?.name} - ${user?.device}`)
          }
        </h3>
        <p className="text-xs text-muted-foreground">{user?.sign}</p>
      </div>
    </div>
  )
}

export default Profile
