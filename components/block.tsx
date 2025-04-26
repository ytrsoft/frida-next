'use client'

import type { FC } from 'react'
import { Card, CardContent } from '@/components/ui/card'

type Props = {
  children: React.ReactNode
}

const Block: FC<Partial<Props>> = ({ children }) => {
  return (
    <Card className="h-full">
      <CardContent className="h-full p-0">
        <div className="h-full p-3 space-y-3">
          { children }
        </div>
      </CardContent>
    </Card>
  )
}

export default Block
