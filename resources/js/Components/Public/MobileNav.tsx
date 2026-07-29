import { useEffect, useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { ChevronDown, Menu } from 'lucide-react'

import { Badge } from '@/Components/UI/Badge'
import { Button } from '@/Components/UI/Button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/Components/UI/Sheet'
import { NavIcon } from '@/Components/Public/NavIcon'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import type { NavCta, NavItem, NavNode } from '@/Types/navigation'

export interface MobileNavProps {
  items: NavNode[]
  ctas?: NavCta[] | undefined
  className?: string | undefined
  currentUrl?: string | undefined
}

function isRouterLink(item: NavItem | NavCta): boolean {
  if (item.newTab) return false
  if ('type' in item && (item.type === 'external' || item.type === 'anchor')) {
    return false
  }
  return Boolean(item.href?.startsWith('/'))
}

function MobileLeaf({ item, onNavigate }: { item: NavItem; onNavigate: () => void }) {
  const { t } = useTranslations()

  if (item.type === 'separator') {
    // `role="separator"` is not a permitted child of a list.
    return (
      <li aria-hidden="true" className="my-2">
        <hr className="border-0 border-t border-border" />
      </li>
    )
  }
  if (!item.href) return null

  const className =
    'flex items-center gap-2 rounded-md py-2.5 pl-4 pr-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'

  const content = (
    <>
      <NavIcon name={item.icon} />
      <span>{t(item.label)}</span>
      {item.badge ? (
        <Badge variant={item.badge.variant ?? 'secondary'}>
          {t(item.badge.label)}
        </Badge>
      ) : null}
    </>
  )

  return (
    <li>
      {isRouterLink(item) ? (
        <Link href={item.href} className={className} onClick={onNavigate}>
          {content}
        </Link>
      ) : (
        <a
          href={item.href}
          className={className}
          onClick={onNavigate}
          {...(item.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {content}
          {item.newTab ? <span className="sr-only"> {t('(opens in a new tab)')}</span> : null}
        </a>
      )}
    </li>
  )
}

/**
 * Mobile navigation drawer.
 *
 * Focus trapping, Escape-to-close, outside-click dismissal and `aria-modal`
 * come from Radix's Dialog underneath `Sheet` — not reimplemented here.
 *
 * Two things Radix does NOT handle that are handled explicitly:
 *  1. Closing on Inertia navigation. Client-side routing does not unmount the
 *     drawer, so without this the menu stays open over the new page.
 *  2. Body scroll lock. `app.css` neutralises Radix's lock with
 *     `body[data-scroll-locked] { overflow: unset !important }` (added for
 *     sticky headers), so the lock is reapplied here via a class the override
 *     does not touch.
 *
 * Disclosure sections are real `<button aria-expanded>` elements rather than
 * hover panels — hover is not available on touch.
 */
export function MobileNav({ items, ctas, className, currentUrl }: MobileNavProps) {
  const { t } = useTranslations()
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  // Close on client-side navigation.
  useEffect(() => {
    const stop = router.on('navigate', () => setOpen(false))
    return () => stop()
  }, [])

  // Reapply the scroll lock that app.css deliberately disables for Radix.
  useEffect(() => {
    if (typeof document === 'undefined') return
    const body = document.body
    if (open) body.classList.add('nav-scroll-locked')
    else body.classList.remove('nav-scroll-locked')
    return () => body.classList.remove('nav-scroll-locked')
  }, [open])

  const visible = items.filter((item) => item.hideOn !== 'mobile')
  if (visible.length === 0) return null

  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={cn('rounded-full', className)}
          aria-label={t('Open menu')}
        >
          <Menu aria-hidden="true" className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="flex w-full flex-col gap-0 p-0 sm:max-w-sm"
      >
        <SheetHeader className="border-b px-(--gutter) py-4">
          <SheetTitle className="text-left text-base">{t('Menu')}</SheetTitle>
        </SheetHeader>

        <nav
          aria-label={t('Primary')}
          className="flex-1 overflow-y-auto overscroll-contain px-(--gutter) py-4"
        >
          <ul className="flex flex-col gap-1">
            {visible.map((node) => {
              const children = node.children ?? []
              const hasPanel = node.display !== 'link' && children.length > 0
              const isOpen = expanded === node.id

              if (!hasPanel) {
                if (!node.href) return null
                const active =
                  currentUrl === node.href ||
                  (node.href !== '/' && currentUrl?.startsWith(`${node.href}/`))

                return (
                  <li key={node.id}>
                    {isRouterLink(node) ? (
                      <Link
                        href={node.href}
                        onClick={close}
                        aria-current={active ? 'page' : undefined}
                        className="block rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                      >
                        {t(node.label)}
                      </Link>
                    ) : (
                      <a
                        href={node.href}
                        onClick={close}
                        className="block rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

              return (
                <li key={node.id}>
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : node.id)}
                    aria-expanded={isOpen}
                    aria-controls={`mobile-nav-${node.id}`}
                    className="flex w-full items-center justify-between rounded-md px-3 py-3 text-base font-medium transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {t(node.label)}
                    <ChevronDown
                      aria-hidden="true"
                      className={cn(
                        'size-4 transition-transform duration-200 motion-reduce:transition-none',
                        isOpen && 'rotate-180'
                      )}
                    />
                  </button>

                  <ul
                    id={`mobile-nav-${node.id}`}
                    hidden={!isOpen}
                    className="mt-1 flex flex-col gap-0.5 border-l border-border pb-2 pl-2"
                  >
                    {children.map((child) => (
                      <MobileLeaf key={child.id} item={child} onNavigate={close} />
                    ))}
                  </ul>
                </li>
              )
            })}
          </ul>
        </nav>

        {ctas && ctas.length > 0 ? (
          <div className="flex flex-col gap-2 border-t px-(--gutter) py-4">
            {ctas.map((cta) => (
              <Button
                key={cta.href}
                asChild
                variant={cta.variant ?? 'default'}
                size="lg"
                className="w-full"
              >
                {isRouterLink(cta) ? (
                  <Link href={cta.href} onClick={close}>
                    {t(cta.label)}
                  </Link>
                ) : (
                  <a
                    href={cta.href}
                    onClick={close}
                    {...(cta.newTab
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {t(cta.label)}
                  </a>
                )}
              </Button>
            ))}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

export default MobileNav
