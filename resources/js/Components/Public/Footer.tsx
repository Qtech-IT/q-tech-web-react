import { Link } from '@inertiajs/react'

import { Container } from '@/Components/Public/Container'
import { NavIcon, isRegisteredNavIcon } from '@/Components/Public/NavIcon'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import type { FooterColumn, NavItem, SocialLink } from '@/Types/navigation'

export interface FooterProps {
  columns?: FooterColumn[] | undefined
  legal?: NavItem[] | undefined
  social?: SocialLink[] | undefined
  siteName?: string | undefined
  /** Pre-rendered copyright from the server (`copy_right_text` shared prop). */
  copyright?: string | undefined
  description?: string | undefined
  className?: string | undefined
}

function isRouterLink(item: NavItem): boolean {
  if (item.newTab) return false
  if (item.type === 'external' || item.type === 'anchor') return false
  return Boolean(item.href?.startsWith('/'))
}

const itemClass =
  'text-sm text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm'

function FooterLink({ item }: { item: NavItem }) {
  const { t } = useTranslations()
  if (!item.href) return null

  return isRouterLink(item) ? (
    <Link href={item.href} className={itemClass}>
      {t(item.label)}
    </Link>
  ) : (
    <a
      href={item.href}
      className={itemClass}
      {...(item.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {t(item.label)}
      {item.newTab ? <span className="sr-only"> {t('(opens in a new tab)')}</span> : null}
    </a>
  )
}

/**
 * Site footer.
 *
 * Every region is independently optional — a site with no social links, no
 * legal menu or no columns still renders a valid footer rather than an empty
 * bordered box. That is the CMS-survivability rule from CLAUDE.md applied at
 * the region level, not just the field level.
 */
export function Footer({
  columns,
  legal,
  social,
  siteName,
  copyright,
  description,
  className,
}: FooterProps) {
  const { t } = useTranslations()

  const brand = siteName?.trim() || 'QTECH'
  const year = new Date().getFullYear()
  const hasColumns = Boolean(columns && columns.length > 0)
  const hasLegal = Boolean(legal && legal.length > 0)
  const hasSocial = Boolean(social && social.length > 0)

  return (
    <footer
      data-slot="site-footer"
      className={cn('mt-auto border-t border-border bg-(--surface-subtle)', className)}
    >
      <Container className="py-(--section-py-sm)">
        <div
          className={cn(
            'grid gap-10',
            hasColumns ? 'lg:grid-cols-[minmax(0,1.5fr)_minmax(0,2fr)]' : ''
          )}
        >
          {/* Brand block */}
          <div className="flex flex-col gap-4">
            <Link
              href="/"
              className="w-fit rounded-md text-lg font-semibold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {brand}
            </Link>

            {description ? (
              <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            ) : null}

            {hasSocial ? (
              <ul className="flex items-center gap-1 pt-1">
                {social!.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(':label (opens in a new tab)', {
                        label: link.label,
                      })}
                      className="inline-flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      {/* An unregistered icon name must not produce an empty
                          but still focusable link — fall back to the label. */}
                      {isRegisteredNavIcon(link.icon) ? (
                        <NavIcon name={link.icon} className="size-[1.1rem]" />
                      ) : (
                        <span className="text-sm font-medium">{link.label}</span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Link columns */}
          {hasColumns ? (
            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {columns!.map((column) => (
                <nav key={column.id} aria-labelledby={`footer-${column.id}`}>
                  <h2
                    id={`footer-${column.id}`}
                    className="mb-3 text-sm font-semibold text-foreground"
                  >
                    {t(column.title)}
                  </h2>
                  <ul className="flex flex-col gap-2.5">
                    {column.items.map((item) => (
                      <li key={item.id}>
                        <FooterLink item={item} />
                      </li>
                    ))}
                  </ul>
                </nav>
              ))}
            </div>
          ) : null}
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col-reverse gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {copyright?.trim() || `© ${year} ${brand}. ${t('All rights reserved.')}`}
          </p>

          {hasLegal ? (
            <nav aria-label={t('Legal')}>
              <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
                {legal!.map((item) => (
                  <li key={item.id}>
                    <FooterLink item={item} />
                  </li>
                ))}
              </ul>
            </nav>
          ) : null}
        </div>
      </Container>
    </footer>
  )
}

export default Footer
