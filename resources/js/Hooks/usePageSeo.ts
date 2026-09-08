import { useMemo } from 'react'
import { usePage } from '@inertiajs/react'

import type { PageMeta } from '@/Components/Public/PageWrapper'
import type { CmsResolvedSeo } from '@/Types/sections'

interface SeoSharedProps {
  site_theme_settings?: Record<string, unknown>
  logos?: Record<string, string | null>
  [key: string]: unknown
}

/**
 * Absolute URL for a possibly-relative CMS value.
 *
 * `SeoService::resolve()` falls back to `$owner->path`, which is a root-relative
 * path like `/`. A relative `og:url` or `canonical` is legal HTML but is ignored
 * by most crawlers and every social scraper, so it is resolved against the
 * current origin. Guarded for the case where no `window` exists.
 */
export function toAbsoluteUrl(value: string | null | undefined): string | undefined {
  const path = value?.trim()

  if (!path) {
    return undefined
  }

  if (/^https?:\/\//i.test(path)) {
    return path
  }

  if (typeof window === 'undefined') {
    return undefined
  }

  return new URL(path, window.location.origin).toString()
}

export interface SiteIdentity {
  name: string | undefined
  logo: string | undefined
  origin: string | undefined
}

/** Site-level identity from the shared props. Used for Organization JSON-LD. */
export function useSiteIdentity(): SiteIdentity {
  const { props } = usePage<SeoSharedProps>()

  const rawName = props.site_theme_settings?.['company_name']
  const rawLogo = props.logos?.['company_logo']

  return {
    name: typeof rawName === 'string' && rawName.trim() !== '' ? rawName : undefined,
    logo: toAbsoluteUrl(typeof rawLogo === 'string' ? rawLogo : undefined),
    origin: typeof window === 'undefined' ? undefined : window.location.origin,
  }
}

export interface UsePageSeoOptions {
  /** `SeoService::resolve()` output, as shipped by `PageRenderService`. */
  seo?: CmsResolvedSeo | null | undefined
  /** Used when the SEO record has no title of its own. */
  fallbackTitle?: string | undefined
  /** JSON-LD to emit when the CMS record carries no schema of its own. */
  defaultSchema?: PageMeta['schema']
  /**
   * `PageRenderService`'s `alternates` — root-relative, locale-prefixed hrefs
   * for this page's other-locale versions. Absolutised here.
   */
  alternates?: Array<{ hreflang: string; href: string }> | null | undefined
}

/**
 * Map the resolved CMS SEO payload onto `PageWrapper`'s props.
 *
 * One place, because every public page needs the same mapping and the two
 * non-obvious decisions in it must not be re-litigated per page:
 *
 * - `title`, not `title_full`. `app.tsx` appends the site name through Inertia's
 *   `title` callback, so passing the pre-suffixed value would render
 *   "Home | QTECH | QTECH".
 * - CMS schema wins over the caller's default. An editor who has filled in a
 *   schema block has made an explicit decision; a page-level default is only a
 *   sensible starting point.
 *
 * Every field is omitted rather than emitted empty — `content=""` scores worse
 * than an absent tag, and `exactOptionalPropertyTypes` enforces the distinction.
 */
export function usePageSeo({
  seo,
  fallbackTitle,
  defaultSchema,
  alternates,
}: UsePageSeoOptions): PageMeta {
  return useMemo(() => {
    const title = seo?.title?.trim() || fallbackTitle?.trim()
    const description = seo?.description?.trim() || seo?.og_description?.trim()
    const canonical = toAbsoluteUrl(seo?.canonical)
    const image = toAbsoluteUrl(seo?.og_image ?? seo?.twitter_image)

    const resolvedAlternates = (alternates ?? [])
      .map((alt) => {
        const href = toAbsoluteUrl(alt.href)

        return href ? { hreflang: alt.hreflang, href } : null
      })
      .filter((alt): alt is { hreflang: string; href: string } => alt !== null)

    const cmsSchema =
      seo?.schema_data && Object.keys(seo.schema_data).length > 0
        ? {
            '@context': 'https://schema.org',
            ...(seo.schema_type ? { '@type': seo.schema_type } : {}),
            ...seo.schema_data,
          }
        : undefined

    const schema = cmsSchema ?? defaultSchema

    return {
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      ...(canonical ? { canonical } : {}),
      ...(image ? { image } : {}),
      // `robots_follow` has no separate expression in `PageWrapper`, which emits
      // the combined `noindex, nofollow`. Not-indexed implies not-followed for
      // our purposes; a follow-only page has no use case on this site.
      ...(seo && seo.robots_index === false ? { noindex: true } : {}),
      ...(seo?.og_type ? { ogType: seo.og_type } : {}),
      ...(schema ? { schema } : {}),
      ...(resolvedAlternates.length > 0 ? { alternates: resolvedAlternates } : {}),
    }
  }, [alternates, defaultSchema, fallbackTitle, seo])
}
