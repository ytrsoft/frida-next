'use client'

import { FC } from 'react'
import { User } from '@/app/types'
import Photo from './photo'
import { cn } from '@/lib/utils'
import { ScrollArea } from '@/components/ui/scroll-area'

type Props = {
  users: Array<User>
  onSelectUser?: (user: User) => void
  selectedUser?: User
}

const Group: FC<Props> = ({ users, onSelectUser, selectedUser }) => {
  return users.map((user) => (
    <div
      key={user.id}
      onClick={() => onSelectUser?.(user)}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors",
        selectedUser?.id === user.id ? "bg-primary/10" : "hover:bg-muted",
      )}
    >
      <Photo user={user} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className="font-medium truncate">{user.name}</h3>
          <span className="text-xs text-muted-foreground">{user.age}</span>
        </div>
        <p className="text-xs text-muted-foreground truncate">{user.sign}</p>
      </div>
    </div>
  ))
}

export default Group

