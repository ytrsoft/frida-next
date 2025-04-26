'use client'

import type { FC } from 'react'
import type { User } from '@/app/types'
import Photo from './photo'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, MapPin, Smartphone, Star, UserIcon } from 'lucide-react'

type Props = {
  user: User
  detailed?: boolean
}

const Profile: FC<Partial<Props>> = ({ user, detailed = false }) => {
  if (!user) return null

  if (!detailed) {
    return (
      <div className="flex items-center gap-3">
        <Photo user={user} />
        <div>
          <h3 className="font-medium">{user.name} - {user.device}</h3>
          <p className="text-xs text-muted-foreground">{user.sign}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center gap-4 text-center">
        <Photo user={user} />
        <div>
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-muted-foreground mt-1">{user.sign}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <UserIcon className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">年龄</p>
              <p className="font-medium">{user.age}岁</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">星座</p>
              <p className="font-medium">{user.constellation}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <Smartphone className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">设备</p>
              <p className="font-medium">{user.device}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <MapPin className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">距离</p>
              <p className="font-medium">{user.distance}km</p>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardContent className="p-4 flex items-center gap-3">
            <Star className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">人气值</p>
              <div className="w-full bg-muted rounded-full h-2.5 mt-1">
                <div className="bg-primary h-2.5 rounded-full" style={{ width: `${user.popular}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Profile
