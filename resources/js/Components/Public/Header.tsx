import { useEffect, useState } from 'react'
import { Link } from '@inertiajs/react'
import { useMotionValueEvent, useReducedMotion, useScroll } from 'motion/react'

import { Button } from '@/Components/UI/Button'
import { ThemeToggle } from '@/Components/UI/ThemeToggle'
import { Container } from '@/Components/Public/Container'
import { DesktopNav } from '@/Components/Public/DesktopNav'
import { MobileNav } from '@/Components/Public/MobileNav'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import type { NavCta, NavNode } from '@/Types/navigation'

export interface HeaderProps {
  items: NavNode[]
  ctas?: NavCta[] | undefined
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
 * Height is driven by `--header-height` / `--header-height-scrolled` rather
 * than utility classes, because `<html>` also uses `--header-height` for
 * `scroll-padding-top`. One token keeps the sticky header and anchor-link
 * offsets from drifting apart.
 *
 * The condense-on-scroll effect animates height and background only — never
 * `position` or `display` — so it cannot cause layout shift (CLS).
 */
export function Header({
  items,
  ctas,
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

  useMotionValueEvent(scrollY, 'change', (latest) => {
    // Hysteresis: separate thresholds stop the header flickering when the user
    // hovers right at the boundary.
    setScrolled((previous) => (previous ? latest > 8 : latest > 24))
  })

  // Cover a load that restores a mid-page scroll position.
  useEffect(() => {
    if (typeof window !== 'undefined' && window.scrollY > 24) setScrolled(true)
  }, [])

  const isSolid = scrolled || !overlay
  const brand = siteName?.trim() || 'QTECH'

  return (
    <header
      data-slot="site-header"
      data-scrolled={scrolled ? '' : undefined}
      className={cn(
        'fixed inset-x-0 top-0 z-50 w-full',
        'transition-[background-color,box-shadow,backdrop-filter] duration-300 motion-reduce:transition-none',
        isSolid
          ? 'border-b border-border/80 bg-background/85 backdrop-blur-md supports-[backdrop-filter]:bg-background/70'
          : 'border-b border-transparent bg-transparent',
        className
      )}
    >
      <Container>
        <div
          className={cn(
            'flex items-center justify-between gap-4',
            'h-(--header-height) transition-[height] duration-300 motion-reduce:transition-none'
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
            className="flex shrink-0 items-center gap-2 rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label={t('Go to homepage')}
          >
            {logo ? (
              <>
                <img
                  src={logo}
                  alt={brand}
                  className={cn('h-8 w-auto', logoDark && 'dark:hidden')}
                  width={120}
                  height={32}
                />
                {logoDark ? (
                  <img
                    src={logoDark}
                    alt={brand}
                    className="hidden h-8 w-auto dark:block"
                    width={120}
                    height={32}
                  />
                ) : null}
              </>
            ) : (
              <span className="text-lg font-semibold tracking-tight">{brand}</span>
            )}
          </Link>

          <DesktopNav
            items={items}
            currentUrl={currentUrl}
            className="hidden lg:block"
          />

          <div className="flex items-center gap-1 sm:gap-2">
            <ThemeToggle />

            {ctas && ctas.length > 0 ? (
              <div className="hidden items-center gap-2 lg:flex">
                {ctas.map((cta) => (
                  <Button
                    key={cta.href}
                    asChild
                    variant={cta.variant ?? 'default'}
                    size="sm"
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
              currentUrl={currentUrl}
              className="lg:hidden"
            />
          </div>
        </div>
      </Container>
    </header>
  )
}

export default Header
