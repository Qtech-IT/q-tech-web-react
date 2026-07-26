import { useEffect, useState } from 'react'
import { cn } from '@/Utils/helpers'
import { Separator } from '@/Components/UI/Separator'
import { SidebarTrigger } from '@/Components/UI/Sidebar'

interface HeaderProps {
  className?: string
  fixed?: boolean
  children?: React.ReactNode
  [key: string]: any
}

export function Header({ className, fixed, children, ...props }: HeaderProps) {
  const [offset, setOffset] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop)
    }

    document.addEventListener('scroll', onScroll, { passive: true })
    return () => document.removeEventListener('scroll', onScroll)
  }, [])

   const isOnboarding:boolean  = (route(undefined as any, undefined, false) as any)
                                  .current('backend.onboarding.*');


                                  
  return (
    <header
      className={cn(
        'z-50 h-16',
        fixed && 'header-fixed peer/header sticky top-0 w-[inherit]',
        offset > 10 && fixed ? 'shadow' : 'shadow-none',
        className
      )}
      {...props}
    >
      <div
        className={cn(
          'relative flex h-full items-center gap-3 p-4 sm:gap-4',
          offset > 10 &&
            fixed &&
            'after:bg-background/20 after:absolute after:inset-0 after:-z-10 after:backdrop-blur-lg'
        )}
      >
         {
          !isOnboarding &&
           <>
             <SidebarTrigger variant='outline' className='max-md:scale-125' />
             <Separator orientation='vertical' className='h-6' />
           </>
         }
       
        {children}
      </div>
    </header>
  )
}
