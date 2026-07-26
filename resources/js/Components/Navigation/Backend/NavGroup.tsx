import { ChevronRight } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/Components/UI/Collapsible'
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/Components/UI/Sidebar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/Components/UI/DropdownMenu'
import { Badge } from '@/Components/UI/Badge'
import { Link, usePage } from '@inertiajs/react'

export function NavGroup({ title, reportCounters, items }: any) {
  const { state, isMobile } = useSidebar()
  const { url } = usePage()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item: any) => {
          const key = `${item.title}-${item.url || 'parent'}`

          if (!item.items)
            return <SidebarMenuLink key={key} item={item} currentUrl={url} reportCounters={reportCounters} />

          if (state === 'collapsed' && !isMobile)
            return (
              <SidebarMenuCollapsedDropdown key={key} item={item} currentUrl={url} reportCounters={reportCounters} />
            )

          return <SidebarMenuCollapsible key={key} item={item} currentUrl={url} reportCounters={reportCounters} />
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}

function NavBadge({ children }: any) {
  return <Badge className='px-1 py-0 text-xs rounded-full'>{children}</Badge>
}

function SidebarMenuLink({ item, currentUrl, reportCounters }: any) {
  const { setOpenMobile } = useSidebar()
  const isActive = checkIsActive(currentUrl, item)

  let counter = 0
  if (item?.counter_key) counter = reportCounters[item?.counter_key]

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
        <Link href={item.url} onClick={() => setOpenMobile(false)}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          {counter > 0 && <NavBadge>{counter}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

function SidebarMenuCollapsible({ item, currentUrl, reportCounters }: any) {
  const { setOpenMobile } = useSidebar()
  const hasActiveChild = checkIsActive(currentUrl, item, true)

  let total = 0
  if (item?.counter_keys?.length) {
    item.counter_keys.forEach((key: any) => {
      total += Number(reportCounters?.[key] || 0)
    })
  }

  return (
    <Collapsible asChild defaultOpen={hasActiveChild} className='group/collapsible'>
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={item.title} isActive={hasActiveChild}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {total > 0 && <NavBadge>{total}</NavBadge>}
            <ChevronRight className='ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent className='CollapsibleContent'>
          <SidebarMenuSub>
            {item.items.map((subItem: any) => {
              let counter = 0
              if (subItem?.counter_key) counter = reportCounters[subItem?.counter_key]

              return (
                <SidebarMenuSubItem key={`${subItem.title}-${subItem.url}`}>
                  <SidebarMenuSubButton asChild isActive={checkIsActive(currentUrl, subItem)}>
                    <Link href={subItem.url} onClick={() => setOpenMobile(false)}>
                      <span>{subItem.title}</span>
                      {counter > 0 && <NavBadge>{counter}</NavBadge>}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              )
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  )
}

function SidebarMenuCollapsedDropdown({ item, currentUrl, reportCounters }: any) {
  const hasActiveChild = checkIsActive(currentUrl, item, true)
  let counter = 0
  if (item?.counter_key) counter = reportCounters[item?.counter_key]

  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton tooltip={item.title} isActive={hasActiveChild}>
            {item.icon && <item.icon />}
            <span>{item.title}</span>
            {counter > 0 && <NavBadge>{counter}</NavBadge>}
            <ChevronRight className='ms-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent side='right' align='start' sideOffset={4}>
          <DropdownMenuLabel>
            {item.title} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub: any) => (
            <DropdownMenuItem key={`${sub.title}-${sub.url}`} asChild>
              <Link href={sub.url} className={`${checkIsActive(currentUrl, sub) ? 'bg-secondary' : ''}`}>
                {sub.icon && <sub.icon />}
                <span className='max-w-52 text-wrap'>{sub.title}</span>
                {sub.badge && <span className='text-xs ms-auto'>{sub.badge}</span>}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  )
}



function checkIsActive(currentUrl: any, item: any, checkChildren: any = false): boolean {
  if (!item.url && !checkChildren) return false

  const normalizeUrl = (url: any): any => {
    if (!url) return { full: '', path: '', query: '' }

    let cleanUrl: any = String(url).trim().split('#')[0]
    if (!cleanUrl.startsWith('/') && !cleanUrl.startsWith('http')) cleanUrl = '/' + cleanUrl

    if (cleanUrl.startsWith('http')) {
      try {
        const urlObj: any = new URL(cleanUrl)
        cleanUrl = urlObj.pathname + urlObj.search
      } catch (e) {
        const match: any = cleanUrl.match(/https?:\/\/[^\/]+(\/.*?)(?:$)/)
        if (match) cleanUrl = match[1]
      }
    }

    const parts: any = cleanUrl.split('?')
    let path: any = parts[0]
    const query: any = parts[1] || ''
    if (path !== '/' && path.endsWith('/')) path = path.slice(0, -1)
    return { full: path + (query ? '?' + query : ''), path, query }
  }

  const current: any = normalizeUrl(currentUrl)
  const itemNormalized: any = normalizeUrl(item.url)

  if (!itemNormalized.full) {
    if (checkChildren && item.items) return item.items.some((child: any) => checkIsActive(currentUrl, child))
    return false
  }

  if (current.full === itemNormalized.full) return true
  if (itemNormalized.query || current.query) {
    if (checkChildren && item.items) return item.items.some((child: any) => checkIsActive(currentUrl, child))
    return false
  }

  const getResourceBase = (path: any) => {
    let base: any = path.replace(/\/index$/, '')
    base = base.replace(/\/create$/, '')
    base = base.replace(/\/edit(\/\d+)?$/, '')
    base = base.replace(/\/\d+\/edit$/, '')
    base = base.replace(/\/\d+$/, '')
    return base
  }

  const currentBase: any = getResourceBase(current.path)
  const itemBase: any = getResourceBase(itemNormalized.path)

  if (currentBase === itemBase) return true
  if (checkChildren && item.items) return item.items.some((child: any) => checkIsActive(currentUrl, child))

  return false
}

