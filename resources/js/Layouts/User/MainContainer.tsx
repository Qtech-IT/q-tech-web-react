import { cn } from '@/Utils/helpers'
import * as React from 'react'

interface MainProps extends React.HTMLAttributes<HTMLElement> {
  fixed?: boolean
  fluid?: boolean
}

export function MainContainer({ fixed, className, fluid, ...props }: MainProps) {
  return (
    <main
      data-layout={fixed ? 'fixed' : 'auto'}
      className={cn(
        '@container/main px-4 py-6',
        'w-full max-w-full box-border',
        // 'overflow-x-hidden',
        fixed && 'flex grow flex-col overflow-hidden',
        !fluid && '@7xl/content:w-full',
        className
      )}
      {...props}
    />
  )
}
