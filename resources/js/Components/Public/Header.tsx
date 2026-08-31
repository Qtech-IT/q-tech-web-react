import { useCallback, useEffect, useState } from 'react'
import { Link } from '@inertiajs/react'
import { Search } from 'lucide-react'
import { useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'

import { Button } from '@/Components/UI/Button'
import { ThemeToggle } from '@/Components/UI/ThemeToggle'
import { Container } from '@/Components/Public/Container'
import { DesktopNav } from '@/Components/Public/DesktopNav'
import { MobileNav } from '@/Components/Public/MobileNav'
import { NavIcon } from '@/Components/Public/NavIcon'
import { ctaTone, fxButton } from '@/Components/Public/fxButton'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import type { NavCta, NavNode } from '@/Types/navigation'

export interface HeaderProps {
  items: NavNode[]
  ctas?: NavCta[] | undefined
  /**
   * Slim strip above the main bar. Renders only when an editor has actually
   * put items in it — an empty utility strip is 36px of dead chrome at the top
   * of every page, so there is no placeholder state for this region.
   */
  utility?: NavNode[] | undefined
  /**
   * Search affordance for the right cluster. A link, not a widget: this site
   * has no client-side search index, and an input that goes nowhere is worse
   * chrome than none. Absent unless an editor points it somewhere.
   */
  search?: NavNode | null | undefined
  currentUrl?: string | undefined
  siteName?: string | undefined
  logo?: string | undefined
  logoDark?: string | undefined
  /**
   * Sit transparently over a full-bleed hero until the user scrolls. The page
   * below is responsible for supplying its own top padding when this is set.
   */
  overlay?: boolean | undefined
  className?: string | undefined
}

/**
 * Sticky public header.
 *
 * LAYOUT
 * ------
 * Logo and nav are ONE left-aligned group, not two ends of a `justify-between`
 * bar. That is the single biggest structural difference between an enterprise
 * marketing header and an app shell: reading "brand → what they do" as one
 * continuous phrase is what makes the bar feel authored, whereas a logo pinned
 * hard left with nav floating in the middle reads as a toolbar. The commercial
 * cluster (theme, search, CTA) is then pushed right by `ms-auto`, so there is
 * exactly one large piece of whitespace in the bar and it sits between the
 * informational half and the transactional half.
 *
 * HEIGHT
 * ------
 * Driven by `--header-height` / `--header-height-scrolled` rather than utility
 * classes, because `<html>` also uses `--header-height` for `scroll-padding-top`.
 * One token keeps the sticky header and anchor-link offsets from drifting.
 * The condense-on-scroll effect animates height and background only — never
 * `position` or `display` — so it cannot cause layout shift.
 *
 * The bar itself is deliberately quiet: a hairline, a translucent veil, one
 * accent pill. All of the header's visual weight is spent on the mega panel,
 * which is where the decision actually happens.
 */
export function Header({
  items,
  ctas,
  utility,
  search,
  currentUrl,
  siteName,
  logo,
  logoDark,
  overlay = false,
  className,
}: HeaderProps) {
  const { t } = useTranslations()
  const { scrollY } = useScroll()
  const reduceMotion = useReducedMotion()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    // Hysteresis: separate thresholds stop the header flickering when the user
    // hovers right at the boundary.
    setScrolled((previous) => (previous ? latest > 8 : latest > 24))
  })

  // Cover a load that restores a mid-page scroll position.
  useEffect(() => {
    if (typeof window !== 'undefined' && window.scrollY > 24) setScrolled(true)
  }, [])

  const handleMenuOpenChange = useCallback((open: boolean) => {
    setMenuOpen(open)
  }, [])

  // An open panel forces the bar opaque: a translucent header with an opaque
  // full-bleed panel welded to its underside reads as a rendering fault.
  const isSolid = scrolled || menuOpen || !overlay
  const brand = siteName?.trim() || 'QTECH'
  const utilityItems = utility ?? []

  return (
    <header
      data-slot="site-header"
      data-scrolled={scrolled ? '' : undefined}
      className={cn(
        'fixed inset-x-0 top-0 z-50 w-full',
        // `backdrop-filter` is deliberately NOT in this list. It cannot
        // interpolate between `blur()` and `none`, so a browser resolves the
        // change discretely at the halfway point — which lands as a single
        // frame of sharp, un-blurred page showing through a bar that is still
        // half transparent. That one frame is the flash.
        //
        // 180ms, matching `panelTransition` and the scrim in `DesktopNav`
        // exactly — same duration, same curve. At 300ms the bar was still
        // travelling from veil to canvas for 120ms after the opaque panel had
        // finished drawing under it, so the two surfaces sat at visibly
        // different greys before the bar caught up.
        'transition-[background-color,box-shadow,border-color] duration-[180ms] ease-fx motion-reduce:transition-none',
        // An open mega panel is a flat, fully opaque canvas surface. The bar
        // matches it exactly rather than staying translucent, so the two read
        // as one object instead of two subtly different greys stacked.
        //
        // The blur stays applied while the panel is open even though an opaque
        // background hides it. Keeping the property identical across the two
        // lit states means opening a panel on a scrolled page animates exactly
        // one thing — the background colour — instead of also tearing the
        // backdrop layer down and building it again.
        menuOpen
          ? 'border-b border-transparent bg-fx-canvas backdrop-blur-xl'
          : isSolid
            ? 'border-b border-fx-line bg-fx-veil-solid backdrop-blur-xl supports-[backdrop-filter]:bg-fx-veil'
            : 'border-b border-transparent bg-transparent',
        // Only the condensed bar earns a shadow — an unscrolled header sitting
        // flush against the hero should not cast one.
        isSolid && scrolled && !menuOpen && 'shadow-fx-1',
        className
      )}
    >
      {/* Utility strip. Hidden below `lg` unconditionally: on a phone these
          links belong in the drawer with everything else, not in a 12px row
          competing with the logo for a 320px viewport. */}
      {utilityItems.length > 0 ? (
        <div
          className={cn(
            'hidden border-b border-fx-line/70 lg:block',
            // Collapses with the bar on scroll so the whole header condenses as
            // one object. Height + opacity only — never `display` — because
            // toggling display mid-transition snaps and drops the animation.
            'overflow-hidden transition-[height,opacity] duration-300 ease-fx motion-reduce:transition-none',
            scrolled && !reduceMotion ? 'h-0 opacity-0' : 'h-(--fx-utility-h) opacity-100'
          )}
          aria-hidden={scrolled && !reduceMotion ? true : undefined}
        >
          <Container size="wide">
            <nav
              aria-label={t('Secondary')}
              className="flex h-(--fx-utility-h) items-center justify-end"
            >
              <ul className="flex items-center gap-6">
                {utilityItems.map((item) =>
                  item.href ? (
                    <li key={item.id}>
                      <UtilityLink item={item} />
                    </li>
                  ) : null
                )}
              </ul>
            </nav>
          </Container>
        </div>
      ) : null}

      {/* Positioning context for the full-bleed mega panel. It must be the
          header itself, not the container, so the panel can span the viewport
          while its contents stay on the site's measure. */}
      <div className="relative">
        <Container size="wide">
          <div
            className={cn(
              'flex items-center gap-4',
              'h-(--header-height) transition-[height] duration-300 ease-fx motion-reduce:transition-none'
            )}
            style={
              scrolled && !reduceMotion
                ? { height: 'var(--header-height-scrolled)' }
                : undefined
            }
          >
            {/* Brand */}
            <Link
              href="/"
              className="fx-focus flex shrink-0 items-center gap-2 rounded-fx-sm"
              aria-label={t('Go to homepage')}
            >
              {logo ? (
                <>
                  <img
                    src={logo}
                    alt={brand}
                    className={cn(
                      'h-8 w-auto lg:h-9',
                      logoDark && 'dark:hidden'
                    )}
                    width={132}
                    height={36}
                  />
                  {logoDark ? (
                    <img
                      src={logoDark}
                      alt={brand}
                      className="hidden h-8 w-auto lg:h-9 dark:block"
                      width={132}
                      height={36}
                    />
                  ) : null}
                </>
              ) : (
                <span className="text-fx-subheading tracking-[-0.03em] text-fx-ink">
                  {brand}
                </span>
              )}
            </Link>

            {/* Pushed right of centre by its own `ms-auto`, with the
                commercial cluster following immediately after it. The bar
                therefore has exactly ONE large piece of whitespace and it sits
                between the brand and the navigation — which is what stops a
                marketing header reading as an app toolbar. */}
            <DesktopNav
              className="lg:ms-auto"
              items={items}
              onOpenChange={handleMenuOpenChange}
              {...(currentUrl ? { currentUrl } : {})}
            />

            {/* `ms-auto` below `lg` (where the nav is hidden and nothing else
                would push this cluster right); a fixed gap at `lg` and up,
                because the nav already owns the bar's free space. */}
            <div className="ms-auto flex items-center gap-1 sm:gap-2 lg:ms-6 xl:ms-10">
              {search?.href ? (
                <SearchAffordance item={search} />
              ) : null}

              <ThemeToggle className="rounded-fx-sm text-fx-ink-soft hover:bg-fx-surface-2 hover:text-fx-ink" />

              {ctas && ctas.length > 0 ? (
                <div className="ms-1 hidden items-center gap-2 lg:flex">
                  {ctas.map((cta, position) => (
                    <Button
                      key={cta.href}
                      asChild
                      /*
                       * The editor's "Button style" wins. Where they left it
                       * unset, the positional rule below is what applies:
                       *
                       * The first CTA is the page's commercial action and the
                       * only solid element in the bar; any others sit back.
                       *
                       * `inverse`, not `solid`: the bar's one filled pill is
                       * ink-on-canvas, which leaves the accent to mean exactly
                       * one thing in this header — "this is the open menu".
                       * Two accent-filled objects in a 72px bar and neither
                       * reads as the primary. Still fully token-driven; both
                       * tones come from `--fx-*` and neither is hardcoded.
                       */
                      className={fxButton({
                        tone: ctaTone(
                          cta.variant,
                          position === 0 ? 'inverse' : 'ghost'
                        ),
                        scale: 'sm',
                      })}
                    >
                      {cta.href.startsWith('/') && !cta.newTab ? (
                        <Link href={cta.href}>{t(cta.label)}</Link>
                      ) : (
                        <a
                          href={cta.href}
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

              <MobileNav
                items={items}
                ctas={ctas}
                className="lg:hidden"
                siteName={brand}
                {...(logo ? { logo } : {})}
                {...(logoDark ? { logoDark } : {})}
                {...(currentUrl ? { currentUrl } : {})}
              />
            </div>
          </div>
        </Container>
      </div>
    </header>
  )
}

/**
 * One utility-strip link.
 *
 * Meta-sized and faint by default so the strip reads as a footnote above the
 * header rather than a second navigation the eye has to triage.
 */
function UtilityLink({ item }: { item: NavNode }) {
  const { t } = useTranslations()
  const href = item.href as string
  const internal = href.startsWith('/') && !item.newTab

  const content = (
    <>
      <NavIcon name={item.icon} className="size-3.5" />
      {t(item.label)}
    </>
  )

  const className = cn(
    'fx-focus inline-flex items-center gap-1.5 rounded-fx-xs py-0.5',
    'text-fx-meta text-fx-ink-faint',
    'transition-colors duration-200 ease-fx hover:text-fx-ink motion-reduce:transition-none'
  )

  return internal ? (
    <Link href={href} className={className}>
      {content}
    </Link>
  ) : (
    <a
      href={href}
      className={className}
      {...(item.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {content}
      {item.newTab ? (
        <span className="sr-only"> {t('(opens in a new tab)')}</span>
      ) : null}
    </a>
  )
}

/**
 * Search entry point.
 *
 * Icon-only under `md` and icon + label above it, because at desktop widths
 * the word does more for discoverability than the glyph does. The label is the
 * editor's own, and it doubles as the `aria-label` in the icon-only state — so
 * the accessible name is never a string this file invented.
 */
function SearchAffordance({ item }: { item: NavNode }) {
  const { t } = useTranslations()
  const href = item.href as string
  const label = t(item.label)
  const internal = href.startsWith('/') && !item.newTab

  const className = cn(
    'fx-focus inline-flex h-10 items-center gap-2 rounded-fx-sm px-2.5 md:px-3',
    'text-fx-label text-fx-ink-soft',
    'transition-colors duration-200 ease-fx',
    'hover:bg-fx-surface-2 hover:text-fx-ink motion-reduce:transition-none'
  )

  const content = (
    <>
      <Search aria-hidden="true" className="size-4 shrink-0" />
      <span className="hidden md:inline">{label}</span>
    </>
  )

  return internal ? (
    <Link href={href} className={className} aria-label={label}>
      {content}
    </Link>
  ) : (
    <a
      href={href}
      className={className}
      aria-label={label}
      {...(item.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {content}
    </a>
  )
}

export default Header
