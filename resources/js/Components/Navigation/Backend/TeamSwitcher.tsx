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
          className='block w-full min-w-0 p-2 overflow-hidden transition-colors rounded-lg hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
        >
          {siteLogo ? (
            <img
              src={siteLogo}
              alt={`${siteConfig?.site_name || 'Site'} logo`}
              className='w-full h-auto max-h-24 object-contain object-left'
            />
          ) : (
            <span className='block text-base font-semibold truncate'>
              {siteConfig?.site_name || 'Dashboard'}
            </span>
          )}
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
