import { Button } from '@/Components/UI/Button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/Components/UI/DropdownMenu'
import { cn } from '@/Utils/helpers'
import { Link } from '@inertiajs/react'
import { ExternalLink, Menu } from 'lucide-react'
import * as React from 'react'

interface TopNavLink {
  title: string
  href: string
  isActive?: boolean
  disabled?: boolean
}

interface TopNavProps extends React.HTMLAttributes<HTMLElement> {
  links: TopNavLink[]
}

export function TopNav({ className, links, ...props }: TopNavProps) {
  return (
    <>
      {/* Mobile dropdown */}
      <div className='lg:hidden'>
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button size='icon' variant='outline' className='md:size-7'>
              <Menu />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side='bottom' align='start'>
            {links.map(({ title, href, isActive, disabled }) => (
              <DropdownMenuItem key={`${title}-${href}`} asChild>
                <Link
                  href={href}
                  className={!isActive ? 'text-muted-foreground' : ''}
                  aria-disabled={disabled}
                >
                  {title}
                </Link>
              </DropdownMenuItem>
            ))}


            <DropdownMenuItem >
              <a
                href={'/'}
                target={'_blank'}
                className={'text-muted-foreground'}
              >
                Frontend
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </DropdownMenuItem>


          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Desktop links */}
      <nav
        className={cn(
          'hidden items-center space-x-4 lg:flex lg:space-x-4 xl:space-x-6',
          className
        )}
        {...props}
      >
        {links.map(({ title, href, isActive, disabled }) => (
          <Link
            key={`${title}-${href}`}
            href={href}
            aria-disabled={disabled}
            className={`hover:text-primary text-sm font-medium transition-colors ${isActive ? '' : 'text-muted-foreground'}`}
          >
            {title}
          </Link>
        ))}

        <a
          href={'/'}
          target={'_blank'}
          className={`hover:text-primary text-sm font-medium transition-colors flex items-center gap-1 'text-muted-foreground'
            `}
        >
          Frontend
          <ExternalLink className="w-3.5 h-3.5" />
        </a>


      </nav>
    </>
  )
}
