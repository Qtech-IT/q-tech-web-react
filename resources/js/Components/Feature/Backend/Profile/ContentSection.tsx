import { ReactNode } from 'react'
import { Separator } from '@/Components/UI/Separator'

interface ContentSectionProps {
  title: string
  desc?: string
  children: ReactNode
}

export function ContentSection({ title, desc, children }: ContentSectionProps) {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex-none">
        <h3 className="text-lg font-medium">{title}</h3>
        {desc && <p className="text-sm text-muted-foreground">{desc}</p>}
      </div>

      <Separator className="flex-none my-4" />

      <div className="w-full h-full pb-12 overflow-y-auto faded-bottom scroll-smooth pe-4">
        <div className="-mx-1 px-1.5 lg:max-w-xl">{children}</div>
      </div>
    </div>
  )
}
