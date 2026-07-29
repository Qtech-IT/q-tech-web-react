import type { CSSProperties } from 'react'
import { Link } from '@inertiajs/react'

import { Badge } from '@/Components/UI/Badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/Components/UI/DropdownMenu'
import { NavIcon } from '@/Components/Public/NavIcon'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import type { NavItem, NavNode } from '@/Types/navigation'
import { ChevronDown } from 'lucide-react'

export interface DesktopNavProps {
  items: NavNode[]
  className?: string | undefined
  /** Marks the item matching the current URL. */
  currentUrl?: string | undefined
}

const linkBase =
  'inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background'

function isActive(href: string | undefined, currentUrl: string | undefined) {
  if (!href || !currentUrl) return false
  if (href === '/') return currentUrl === '/'
  return currentUrl === href || currentUrl.startsWith(`${href}/`)
}

/** External and anchor targets must not go through Inertia's client router. */
function isRouterLink(item: NavItem): boolean {
  if (item.newTab) return false
  if (item.type === 'external' || item.type === 'anchor') return false
  return Boolean(item.href?.startsWith('/'))
}

function NavLeaf({
  item,
  currentUrl,
  withDescription = false,
}: {
  item: NavItem
  currentUrl?: string | undefined
  withDescription?: boolean | undefined
}) {
  const { t } = useTranslations()

  if (item.type === 'separator') {
    // `role="separator"` is not a permitted child of a list, so the <li> stays
    // a listitem and the rule inside it carries the visual break.
    return (
      <li aria-hidden="true" className="my-1">
        <hr className="border-0 border-t border-border" />
      </li>
    )
  }

  if (!item.href) {
    return (
      <li className="px-3 pt-3 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {t(item.label)}
      </li>
    )
  }

  const content = (
    <>
      <span className="flex items-center gap-2">
        <NavIcon name={item.icon} className="text-muted-foreground" />
        <span className="font-medium">{t(item.label)}</span>
        {item.badge ? (
          <Badge variant={item.badge.variant ?? 'secondary'} className="ml-1">
            {t(item.badge.label)}
          </Badge>
        ) : null}
      </span>
      {withDescription && item.description ? (
        <span className="mt-1 block text-sm text-muted-foreground">
          {t(item.description)}
        </span>
      ) : null}
    </>
  )

  const className = cn(
    'block rounded-md px-3 py-2.5 text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
    isActive(item.href, currentUrl) && 'bg-accent/60 text-accent-foreground'
  )

  return (
    <li>
      {isRouterLink(item) ? (
        <Link href={item.href} className={className}>
          {content}
        </Link>
      ) : (
        <a
          href={item.href}
          className={className}
          {...(item.newTab
            ? { target: '_blank', rel: 'noopener noreferrer' }
            : {})}
        >
          {content}
          {item.newTab ? (
            <span className="sr-only"> {t('(opens in a new tab)')}</span>
          ) : null}
        </a>
      )}
    </li>
  )
}

/**
 * Primary desktop navigation.
 *
 * Built on `DropdownMenu` rather than a bespoke popover because it brings
 * correct focus management, Escape handling, arrow-key traversal and outside
 * -click dismissal for free. `@radix-ui/react-navigation-menu` would be the
 * more literal fit but is not a dependency of this project, and the brief
 * forbids adding one.
 *
 * Every branch tolerates missing data: a node with no children renders as a
 * plain link, a node with no `href` renders as a non-navigating trigger.
 */
export function DesktopNav({ items, className, currentUrl }: DesktopNavProps) {
  const { t } = useTranslations()

  const visible = items.filter((item) => item.hideOn !== 'desktop')
  if (visible.length === 0) return null

  return (
    <nav aria-label={t('Primary')} className={className}>
      <ul className="flex items-center gap-1">
        {visible.map((node) => {
          const children = node.children ?? []
          const hasPanel = node.display !== 'link' && children.length > 0

          if (!hasPanel) {
            if (!node.href) return null
            return (
              <li key={node.id}>
                {isRouterLink(node) ? (
                  <Link
                    href={node.href}
                    className={cn(
                      linkBase,
                      isActive(node.href, currentUrl) && 'text-foreground'
                    )}
                    aria-current={
                      isActive(node.href, currentUrl) ? 'page' : undefined
                    }
                  >
                    {t(node.label)}
                  </Link>
                ) : (
                  <a
                    href={node.href}
                    className={linkBase}
                    {...(node.newTab
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {t(node.label)}
                  </a>
                )}
              </li>
            )
          }

          const isMega = node.display === 'mega'
          const columns = Math.min(Math.max(node.columns ?? 1, 1), 4)

          return (
            <li key={node.id}>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger
                  className={cn(
                    linkBase,
                    'data-[state=open]:text-foreground',
                    isActive(node.href, currentUrl) && 'text-foreground'
                  )}
                >
                  {t(node.label)}
                  {/* Rotates from the trigger's own data-state, since the
                      icon is a child of the element carrying that attribute. */}
                  <ChevronDown
                    aria-hidden="true"
                    className="size-4 transition-transform duration-200 in-data-[state=open]:rotate-180 motion-reduce:transition-none"
                  />
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="start"
                  sideOffset={8}
                  className={cn(
                    'p-2',
                    isMega ? 'w-(--mega-width)' : 'min-w-56'
                  )}
                  style={
                    isMega
                      ? ({ '--mega-width': `${columns * 17}rem` } as CSSProperties)
                      : undefined
                  }
                >
                  <ul
                    className={cn(
                      isMega && 'grid gap-1',
                      isMega && columns === 2 && 'grid-cols-2',
                      isMega && columns === 3 && 'grid-cols-3',
                      isMega && columns === 4 && 'grid-cols-4'
                    )}
                  >
                    {children.map((child) => (
                      <NavLeaf
                        key={child.id}
                        item={child}
                        currentUrl={currentUrl}
                        withDescription={isMega}
                      />
                    ))}
                  </ul>
                </DropdownMenuContent>
              </DropdownMenu>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default DesktopNav
