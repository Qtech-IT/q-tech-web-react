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

/**
 * Footer links animate an underline in from the left on hover rather than
 * switching colour. It is quieter, it reads as editorial, and it keeps the
 * resting state at one ink weight so the columns scan as columns.
 */
const itemClass = cn(
  'group/link relative inline-block text-fx-body-sm text-fx-ink-soft',
  'transition-colors duration-200 ease-fx motion-reduce:transition-none',
  'hover:text-fx-ink fx-focus rounded-fx-xs',
  'after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px',
  'after:origin-left after:scale-x-0 after:bg-fx-accent',
  'after:transition-transform after:duration-300 after:ease-fx',
  'hover:after:scale-x-100 motion-reduce:after:transition-none'
)

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
      {item.newTab ? (
        <span className="sr-only"> {t('(opens in a new tab)')}</span>
      ) : null}
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
 *
 * Visually it closes the page rather than decorating it: a single hairline at
 * the top, a large quiet brand block on the left, link columns on the right,
 * and a generous band of space before the legal line. No cards, no panels — the
 * footer is the one place a marketing page should get calmer, not busier.
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
      // `relative z-10`: see the matching comment on `PublicLayout`'s
      // `<main>` — the site's fixed mesh backdrop is a positioned sibling and
      // paints above normal-flow content by default, so the footer needs the
      // same explicit stack to keep its own surface colour on top of it.
      className={cn(
        'relative z-10 mt-auto border-t border-fx-line bg-fx-surface-2 text-fx-ink',
        className
      )}
    >
      <Container className="py-fx-band-sm">
        <div
          className={cn(
            'grid gap-fx-stack-xl',
            hasColumns && 'lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.9fr)]'
          )}
        >
          {/* Brand block */}
          <div className="flex flex-col gap-fx-stack-md">
            <Link
              href="/"
              className="fx-focus w-fit rounded-fx-sm text-fx-heading text-fx-ink"
            >
              {brand}
            </Link>

            {description ? (
              <p className="max-w-sm text-fx-body-sm text-pretty text-fx-ink-soft">
                {description}
              </p>
            ) : null}

            {hasSocial ? (
              <ul className="flex flex-wrap items-center gap-2 pt-1">
                {social!.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(':label (opens in a new tab)', {
                        label: link.label,
                      })}
                      className={cn(
                        'inline-flex size-10 min-w-10 items-center justify-center rounded-fx-pill px-2',
                        'border border-fx-line bg-fx-surface text-fx-ink-soft',
                        'transition-[color,border-color,transform] duration-200 ease-fx',
                        'hover:-translate-y-px hover:border-fx-accent-line hover:text-fx-accent-text',
                        'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
                        'fx-focus'
                      )}
                    >
                      {/* An unregistered icon name must not produce an empty
                          but still focusable link — fall back to the label. */}
                      {isRegisteredNavIcon(link.icon) ? (
                        <NavIcon name={link.icon} className="size-[1.1rem]" />
                      ) : (
                        <span className="text-fx-meta font-medium">
                          {link.label}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Link columns */}
          {hasColumns ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-fx-stack-lg sm:grid-cols-3">
              {columns!.map((column) => (
                <nav key={column.id} aria-labelledby={`footer-${column.id}`}>
                  <h2
                    id={`footer-${column.id}`}
                    className="mb-4 text-fx-eyebrow uppercase text-fx-ink-faint"
                  >
                    {t(column.title)}
                  </h2>
                  <ul className="flex flex-col gap-3">
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
        <div className="mt-fx-stack-xl flex flex-col-reverse gap-4 border-t border-fx-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-fx-meta text-fx-ink-faint">
            {copyright?.trim() || `© ${year} ${brand}. ${t('All rights reserved.')}`}
          </p>

          {hasLegal ? (
            <nav aria-label={t('Legal')}>
              <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
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
