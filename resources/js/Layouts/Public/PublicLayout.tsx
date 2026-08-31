import { useEffect, useMemo } from 'react'
import type { CSSProperties, ReactNode } from 'react'
import { usePage } from '@inertiajs/react'

import { CookieConsent } from '@/Components/Public/CookieConsent'
import { Footer } from '@/Components/Public/Footer'
import { Header } from '@/Components/Public/Header'
import { partitionHeaderItems } from '@/Components/Public/navSlots'
import { SiteLoader } from '@/Components/Public/SiteLoader'
import { HotToaster } from '@/Components/UI/HotToast'
import { fallbackNavigation } from '@/Config/navigation'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import type { BrandTokens } from '@/Types/brand'
import type { PublicLanguage } from '@/Components/Public/LanguageSwitcher'
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
  brand?: BrandTokens | null
  /** Shared by `HandleInertiaRequests`. Drives the footer's switcher. */
  language_settings?: {
    available_languages?: unknown
    current_language?: string
  }
  [key: string]: unknown
}

/** A non-empty trimmed setting value, or `undefined`. */
function settingText(
  settings: Record<string, unknown>,
  key: string
): string | undefined {
  const raw = settings[key]

  if (typeof raw !== 'string') {
    return undefined
  }

  const value = raw.trim()

  return value === '' ? undefined : value
}

/**
 * The languages the footer switcher may offer.
 *
 * `available_languages` arrives as a resource collection, which is a bare
 * array when it is not paginated and `{ data: [...] }` when it is — the same
 * ambiguity `unwrapList` exists for on the section payload. Narrowed here
 * rather than in the switcher so the component takes a plain, typed list and
 * has no opinion about how the server shipped it.
 */
function publicLanguages(raw: unknown): PublicLanguage[] {
  const list = Array.isArray(raw)
    ? raw
    : Array.isArray((raw as { data?: unknown })?.data)
      ? ((raw as { data: unknown[] }).data)
      : []

  return list.flatMap((entry) => {
    if (typeof entry !== 'object' || entry === null) {
      return []
    }

    const language = entry as { code?: unknown; name?: unknown; direction?: unknown }

    if (typeof language.code !== 'string' || language.code.trim() === '') {
      return []
    }

    return [
      {
        code: language.code,
        name:
          typeof language.name === 'string' && language.name.trim() !== ''
            ? language.name
            : language.code.toUpperCase(),
        direction:
          typeof language.direction === 'string' ? language.direction : null,
      },
    ]
  })
}

/**
 * Map the `brand` prop onto the `--fx-brand-*` inputs `frontend.css` reads.
 *
 * WHY BOTH THEMES ARE WRITTEN AT ONCE
 * -----------------------------------
 * `.dark` sits on `<html>`; `data-site="public"` sits on this div. The dark
 * cascade block therefore targets the same element this inline style lands on,
 * and inline declarations beat every selector — so writing `--fx-accent`
 * directly would pin the light colour into dark mode with no way to override.
 *
 * Publishing light and dark under separate names lets the stylesheet choose.
 * There is one React render, no `useTheme()` dependency, no second code path,
 * and toggling the theme is a pure CSS transition with no re-render at all.
 *
 * A missing token is omitted rather than emitted empty, because every consumer
 * reads it as `var(--fx-brand-x, <literal default>)` and a declared-but-empty
 * custom property is NOT the same as an absent one — it suppresses the
 * fallback and computes to nothing. Omitting is what makes the fallback fire.
 */
function brandStyle(brand: BrandTokens | null | undefined): CSSProperties {
  if (!brand) {
    return {}
  }

  const inputs: Array<[string, string | undefined]> = [
    ['--fx-brand-accent', brand.accent],
    ['--fx-brand-accent-ink', brand.accentInk],
    ['--fx-brand-accent-dark', brand.accentDark],
    ['--fx-brand-accent-ink-dark', brand.accentInkDark],
    ['--fx-brand-radius', brand.radius],
    ['--fx-brand-btn-primary', brand.buttonPrimary],
    ['--fx-brand-btn-primary-ink', brand.buttonPrimaryInk],
    ['--fx-brand-btn-secondary', brand.buttonSecondary],
    ['--fx-brand-btn-secondary-ink', brand.buttonSecondaryInk],
  ]

  const style: Record<string, string> = {}

  for (const [name, value] of inputs) {
    if (typeof value === 'string' && value.trim() !== '') {
      style[name] = value.trim()
    }
  }

  return style as CSSProperties
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

  // Memoised on the prop identity so a navigation that does not change the
  // brand does not hand React a fresh style object and re-commit the root.
  const brandTokens = useMemo(() => brandStyle(page.brand), [page.brand])

  /*
   * The layout is the composition root, so it — not the header — decides which
   * primary items belong to which header region. The header renders regions;
   * it does not discover them. That split matters for one concrete reason:
   * `<main>` has to reserve the utility strip's height, and `<main>` is the
   * header's SIBLING. If the header partitioned the menu privately, the layout
   * could not know whether to reserve 0 or 36px and the first section would
   * slide under the bar the moment an editor added a utility link.
   */
  const regions = useMemo(
    () => partitionHeaderItems(navigation.primary),
    [navigation.primary]
  )

  const hasUtility = regions.utility.length > 0

  const languages = useMemo(
    () => publicLanguages(page.language_settings?.available_languages),
    [page.language_settings?.available_languages]
  )

  /*
   * The cookie policy link, found in the legal menu rather than configured
   * twice. Matching on the HREF and not on the label is what makes it work in
   * every language: a translated "Politique de cookies" would never match an
   * English needle, but `/cookie-policy` is the same string in all of them.
   * Privacy is the fallback because a site without a dedicated cookie page
   * almost always covers it there.
   */
  const cookiePolicy = useMemo(() => {
    const items = navigation.legal ?? []
    const byHref = (needle: string) =>
      items.find((item) => item.href?.toLowerCase().includes(needle))

    return byHref('cookie') ?? byHref('privacy')
  }, [navigation.legal])

  const rootStyle = useMemo<CSSProperties>(
    () =>
      // `--fx-utility-h` defaults to 0 in `frontend.css`; it is raised only
      // when the strip actually renders, so the header bar, the strip and
      // `<main>`'s reserved space are all driven off one number and cannot
      // disagree. The cast is unavoidable — `CSSProperties` has no index
      // signature for custom properties, though React sets them correctly.
      hasUtility
        ? ({ ...brandTokens, '--fx-utility-h': '2.25rem' } as CSSProperties)
        : brandTokens,
    [brandTokens, hasUtility]
  )

  /*
   * Mirror the brand inputs onto <html> as well as this div.
   *
   * Radix portals `SheetContent` (the mobile drawer), dialogs and popovers to
   * `document.body` — OUTSIDE this subtree. Those portals re-apply
   * `data-site="public"`, which restores the `--fx-*` token DEFINITIONS from
   * `frontend.css`, but definitions are not values: `--fx-btn-primary` reads
   * `var(--fx-brand-btn-primary, var(--fx-ink))`, and the input it needs was
   * only ever an inline style on this element, which a portal cannot inherit.
   *
   * The result was a mobile CTA that ignored the configured button colour and
   * silently fell back to near-black ink, while the identical button on the
   * page behind it was correctly branded. Publishing the inputs on the root
   * element is the same fix `BaseLayout` already uses for the admin, and for
   * exactly the same reason.
   *
   * Only the brand inputs move. `--fx-utility-h` stays on the div because it
   * describes this layout's own geometry, not the brand.
   */
  useEffect(() => {
    const root = document.documentElement
    const names = Object.keys(brandTokens)

    if (names.length === 0) {
      return
    }

    for (const name of names) {
      root.style.setProperty(name, (brandTokens as Record<string, string>)[name] as string)
    }

    return () => {
      for (const name of names) {
        root.style.removeProperty(name)
      }
    }
  }, [brandTokens])

  return (
    // `data-site="public"` is what activates the entire public design system.
    // Every `--fx-*` token in `resources/css/frontend.css` is scoped to this
    // attribute, so the marketing identity exists exactly as long as this
    // subtree is mounted and can never reach an admin screen — which matters
    // because admin and site are one Inertia SPA sharing one stylesheet.
    <div
      data-site="public"
      // The admin-authored accent and radius enter the design system here and
      // nowhere else. `frontend.css` derives hover, text, focus, soft fill,
      // hairline and on-inverse cuts from them, so this handful of properties
      // repaints the entire public site.
      style={rootStyle}
      className="flex min-h-svh flex-col text-fx-ink text-fx-body antialiased"
    >
      {/* The site's ambient backdrop. `fixed` rather than a child of the flow,
          so it reads as atmosphere behind the whole page — header, every
          section, footer — rather than as one more scrolling layer, and so a
          very tall page never stretches or repeats the blooms. `-z-10` keeps
          it beneath content without needing every section to opt in. */}
      <div aria-hidden="true" className="fixed inset-0 z-0 fx-mesh-canvas" />

      <SiteLoader siteName={siteName} />

      {/* First focusable element on the page. Visually hidden until focused. */}
      <a
        href="#main-content"
        className="sr-only rounded-fx-md border border-fx-line bg-fx-surface px-5 py-3 text-fx-label text-fx-ink fx-raise-2 focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[60] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fx-focus"
      >
        {t('Skip to content')}
      </a>

      {/* `getSiteLogo()` shares exactly two keys: `company_logo` and
          `favicon`. There is no dark-logo setting yet, so the header falls
          back to the wordmark in dark mode rather than pretending otherwise. */}
      <Header
        items={regions.nav}
        utility={regions.utility}
        search={regions.search}
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
          // `relative z-10`: the backdrop is a `position: fixed` sibling, and
          // a positioned element always paints above the page's normal-flow
          // content at the same stacking level regardless of DOM order — so
          // without an explicit stack of its own, `<main>` rendered BELOW the
          // backdrop and every section vanished under a solid wash. Content
          // needs its own explicit position to out-rank it on purpose.
          'relative z-10 flex-1 focus:outline-none',
          // Reserve the sticky header's space unless the page opts into an
          // overlay hero. Uses the same tokens the header is sized from, so
          // the two can never drift apart — including the utility strip, which
          // is inside the fixed header and therefore contributes to the space
          // `<main>` has to leave for it.
          !overlayHeader &&
            'pt-[calc(var(--header-height)+var(--fx-utility-h))]',
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
        logo={page.logos?.['company_logo']}
        address={settingText(settings, 'address')}
        phone={settingText(settings, 'company_phone')}
        email={settingText(settings, 'company_email')}
        languages={languages}
        currentLocale={page.language_settings?.current_language}
      />

      {/*
       * Mounted at the layout, not inside the footer: it is `position: fixed`
       * chrome that must survive a page navigation, and the footer's "Cookie
       * settings" control reaches it through a window event precisely so the
       * two do not have to be in the same tree.
       */}
      <CookieConsent
        {...(cookiePolicy?.href ? { policyHref: cookiePolicy.href } : {})}
        {...(cookiePolicy?.label ? { policyLabel: t(cookiePolicy.label) } : {})}
      />

      <HotToaster />
    </div>
  )
}
