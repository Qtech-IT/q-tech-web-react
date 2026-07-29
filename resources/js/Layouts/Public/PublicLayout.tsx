import type { ReactNode } from 'react'
import { usePage } from '@inertiajs/react'

import { Footer } from '@/Components/Public/Footer'
import { Header } from '@/Components/Public/Header'
import { HotToaster } from '@/Components/UI/HotToast'
import { fallbackNavigation } from '@/Config/navigation'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import type { SiteNavigation } from '@/Types/navigation'

export interface PublicLayoutProps {
  children: ReactNode
  /**
   * Let the hero run under a transparent header. The page must then supply its
   * own top spacing — `PageWrapper` does this via its `offsetHeader` prop.
   */
  overlayHeader?: boolean
  className?: string
}

interface PublicSharedProps {
  navigation?: Partial<SiteNavigation>
  site_theme_settings?: Record<string, unknown>
  logos?: Record<string, string>
  copy_right_text?: string
  [key: string]: unknown
}

/**
 * Shell for every public page.
 *
 * Navigation resolution is per-region, not all-or-nothing: if the server sends
 * a primary menu but no footer columns, the footer still falls back rather
 * than disappearing. That keeps the site coherent while the CMS menu builder
 * is only partially populated.
 */
export default function PublicLayout({
  children,
  overlayHeader = false,
  className,
}: PublicLayoutProps) {
  const { t } = useTranslations()
  const { props: page, url } = usePage<PublicSharedProps>()

  const server = page.navigation
  const settings = page.site_theme_settings ?? {}

  const navigation: SiteNavigation = {
    primary: server?.primary?.length ? server.primary : fallbackNavigation.primary,
    ctas: server?.ctas?.length ? server.ctas : fallbackNavigation.ctas,
    footerColumns: server?.footerColumns?.length
      ? server.footerColumns
      : fallbackNavigation.footerColumns,
    legal: server?.legal?.length ? server.legal : fallbackNavigation.legal,
    social: server?.social?.length ? server.social : fallbackNavigation.social,
  }

  const siteName =
    typeof settings.company_name === 'string' ? settings.company_name : undefined
  const description =
    typeof settings.site_description === 'string'
      ? settings.site_description
      : undefined

  // `url` lives on the usePage() object, not on `.props`.
  const currentUrl = url

  return (
    <div className="flex min-h-svh flex-col bg-background text-foreground">
      {/* First focusable element on the page. Visually hidden until focused. */}
      <a
        href="#main-content"
        className="sr-only rounded-md bg-background px-4 py-2 text-sm font-medium ring-2 ring-ring focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[60]"
      >
        {t('Skip to content')}
      </a>

      {/* `getSiteLogo()` shares exactly two keys: `company_logo` and
          `favicon`. There is no dark-logo setting yet, so the header falls
          back to the wordmark in dark mode rather than pretending otherwise. */}
      <Header
        items={navigation.primary}
        ctas={navigation.ctas}
        currentUrl={currentUrl}
        siteName={siteName}
        logo={page.logos?.['company_logo']}
        overlay={overlayHeader}
      />

      <main
        id="main-content"
        tabIndex={-1}
        className={cn(
          'flex-1 focus:outline-none',
          // Reserve the sticky header's space unless the page opts into an
          // overlay hero. Uses the same token the header is sized from, so the
          // two can never drift apart.
          !overlayHeader && 'pt-(--header-height)',
          className
        )}
      >
        {children}
      </main>

      <Footer
        columns={navigation.footerColumns}
        legal={navigation.legal}
        social={navigation.social}
        siteName={siteName}
        description={description}
        copyright={page.copy_right_text}
      />

      <HotToaster />
    </div>
  )
}
