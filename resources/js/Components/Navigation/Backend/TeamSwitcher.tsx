import {
  SidebarMenu,
  SidebarMenuItem,
  useSidebar,
} from '@/Components/UI/Sidebar'
import { Link } from '@inertiajs/react'
import { route } from 'ziggy-js'

interface TeamSwitcherProps {
  siteConfig?: {
    site_name?: string
  }
  siteLogo?: string
}

export function TeamSwitcher({ siteConfig, siteLogo }: TeamSwitcherProps) {
  const { isMobile } = useSidebar()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link
          href={route('backend.dashboard')}
          className='flex items-center w-full gap-2 p-2 transition-colors rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        >
          <div className='flex items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground aspect-square size-8'>
            {siteLogo && (
              <img
                src={siteLogo}
                alt={`${siteConfig?.site_name || 'Site'} logo`}
                className='object-contain size-4'
              />
            )}
          </div>
          <div className='grid flex-1 text-sm leading-tight text-start'>
            <span className='font-semibold truncate'>
              {siteConfig?.site_name}
            </span>
          </div>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
