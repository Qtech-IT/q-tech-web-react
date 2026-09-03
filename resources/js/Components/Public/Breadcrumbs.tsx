import { Link } from '@inertiajs/react'
import { ChevronRight, House } from 'lucide-react'

import { Container } from '@/Components/Public/Container'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'

/** One crumb. A `null` path means "this is where you already are". */
export interface Crumb {
  title: string
  path: string | null
}

export interface BreadcrumbsProps {
  /** `PageRenderService::breadcrumbs()` — empty on the homepage. */
  items: Crumb[] | null | undefined
  className?: string | undefined
}

/**
 * The ancestor trail above a page's first section.
 *
 * MARKUP FIRST. A `nav` landmark with an accessible name, an ordered list
 * because the sequence carries meaning, and `aria-current="page"` on the last
 * item. Separators are `aria-hidden` so a screen reader announces
 * "Home, Services, Custom Software Development" rather than reading a chevron
 * between every pair.
 *
 * THE CURRENT PAGE IS NOT A LINK. It is where the visitor is standing, and a
 * link that navigates nowhere is a documented WCAG annoyance rather than
 * navigation. It is styled as the emphasised end of the trail instead.
 *
 * THE HOME CRUMB CARRIES AN ICON AND ITS LABEL, not the icon alone. An
 * icon-only home crumb is the most common breadcrumb mistake: it halves the
 * hit area, removes the word a screen reader would announce, and reads as a
 * decoration rather than as the first step of a path. The glyph is
 * `aria-hidden` and the word does the talking.
 *
 * Renders nothing when the trail is empty or holds only the home crumb — a
 * breadcrumb of length one is a decoration pretending to be orientation.
 */
export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  const { t } = useTranslations()

  const trail = Array.isArray(items) ? items.filter((item) => item?.title) : []

  if (trail.length < 2) {
    return null
  }

  return (
    <Container>
      <nav
        aria-label={t('Breadcrumb')}
        className={cn('pt-fx-stack-md', className)}
      >
        {/*
          * A contained bar rather than loose text. The trail sits directly
          * above a section that owns the page's `h1`, and unbounded small grey
          * text there reads as a stray caption; a hairline surface gives it a
          * job and separates it from the headline beneath.
          *
          * `w-fit` so the bar wraps the path instead of striping the full
          * measure, and `max-w-full` so a deep trail still wraps rather than
          * pushing the page into a horizontal scroll.
          */}
        <ol
          className={cn(
            'flex w-fit max-w-full flex-wrap items-center gap-x-1 gap-y-1',
            'rounded-fx-pill border border-fx-line bg-fx-surface px-3 py-1.5',
            'text-fx-meta text-fx-ink-faint'
          )}
        >
          {trail.map((crumb, index) => {
            const isLast = index === trail.length - 1
            const isHome = index === 0

            return (
              <li
                key={`${crumb.path ?? 'current'}-${index}`}
                className="flex min-w-0 items-center gap-1"
              >
                {index > 0 ? (
                  <ChevronRight
                    aria-hidden="true"
                    // `rtl:rotate-180` — the trail reads right-to-left in
                    // Arabic, so a chevron pointing "forward" has to turn with
                    // it or it points back the way the reader came.
                    className="size-3.5 shrink-0 text-fx-ink-faint/50 rtl:rotate-180"
                  />
                ) : null}

                {crumb.path && !isLast ? (
                  <Link
                    href={crumb.path}
                    className={cn(
                      'flex min-w-0 items-center gap-1.5 rounded-fx-pill px-2 py-0.5',
                      'transition-colors duration-200 ease-fx',
                      'hover:bg-fx-surface-2 hover:text-fx-ink',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fx-focus',
                      'motion-reduce:transition-none'
                    )}
                  >
                    {isHome ? (
                      <House aria-hidden="true" className="size-3.5 shrink-0" />
                    ) : null}
                    <span className="truncate">{crumb.title}</span>
                  </Link>
                ) : (
                  <span
                    {...(isLast ? { 'aria-current': 'page' as const } : {})}
                    className={cn(
                      'flex min-w-0 items-center gap-1.5 px-2 py-0.5',
                      // The end of the trail is where the visitor is. It gets
                      // the ink and the weight; everything before it is a way
                      // back, not a destination.
                      isLast && 'font-medium text-fx-ink'
                    )}
                  >
                    {isHome ? (
                      <House aria-hidden="true" className="size-3.5 shrink-0" />
                    ) : null}
                    <span className="truncate">{crumb.title}</span>
                  </span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>
    </Container>
  )
}

export default Breadcrumbs
