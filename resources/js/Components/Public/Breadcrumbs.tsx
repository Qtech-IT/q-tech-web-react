import { Link } from '@inertiajs/react'
import { ChevronRight } from 'lucide-react'

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
 * MARKUP, not decoration. A `nav` landmark with an accessible name, an ordered
 * list because the sequence carries meaning, and `aria-current="page"` on the
 * last item. The separators are `aria-hidden` spans rather than characters
 * inside the links, so a screen reader announces "Home, Services, Video and
 * Animation" instead of "Home chevron right Services chevron right".
 *
 * The current page is NOT a link. It is where the visitor is standing, and a
 * link that navigates nowhere is a documented WCAG annoyance rather than
 * navigation.
 *
 * Renders nothing at all when the trail is empty or has only the home crumb —
 * a breadcrumb of length one is a decoration pretending to be orientation.
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
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-fx-meta text-fx-ink-faint">
          {trail.map((crumb, index) => {
            const isLast = index === trail.length - 1

            return (
              <li key={`${crumb.path ?? 'current'}-${index}`} className="flex items-center gap-2">
                {index > 0 ? (
                  <ChevronRight
                    aria-hidden="true"
                    // `rtl:rotate-180` — the trail reads right-to-left in
                    // Arabic, so a chevron pointing "forward" has to turn with
                    // it or it points back the way the reader came.
                    className="size-3.5 shrink-0 text-fx-ink-faint/60 rtl:rotate-180"
                  />
                ) : null}

                {crumb.path && !isLast ? (
                  <Link
                    href={crumb.path}
                    className={cn(
                      'rounded-fx-xs transition-colors duration-200 ease-fx hover:text-fx-ink',
                      'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fx-focus',
                      'motion-reduce:transition-none'
                    )}
                  >
                    {crumb.title}
                  </Link>
                ) : (
                  <span
                    {...(isLast ? { 'aria-current': 'page' as const } : {})}
                    className={cn('max-w-[60vw] truncate', isLast && 'text-fx-ink-soft')}
                  >
                    {crumb.title}
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
