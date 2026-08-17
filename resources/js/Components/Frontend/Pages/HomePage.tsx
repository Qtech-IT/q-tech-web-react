import { useMemo } from 'react'

import { PageWrapper } from '@/Components/Public/PageWrapper'
import { SectionRenderer } from '@/Components/Frontend/Sections'
import { usePageSeo, useSiteIdentity } from '@/Hooks/usePageSeo'
import { useTranslations } from '@/Hooks/useTranslations'
import type { CmsResolvedSeo, CmsSectionDescriptor } from '@/Types/sections'

export interface HomePageProps {
  /** `$page->title`, or the translated fallback when no homepage exists. */
  title?: string | undefined
  page?: {
    uuid: string
    title: string
    path: string
    locale: string
  } | null
  /** `PageSectionResource::collection()` — array, or `{ data: [...] }`. */
  sections?: unknown
  /**
   * `section_type` → `{ key, label, component }`.
   *
   * Not used to resolve components — that is `registry.ts`, which must be a
   * static map for Vite to code-split it. Kept on the contract because it is
   * what the server ships and because a future preview mode will need it.
   */
  sectionTypes?: Record<string, CmsSectionDescriptor> | CmsSectionDescriptor[]
  seo?: CmsResolvedSeo | null
}

/**
 * Homepage wrapper.
 *
 * The page file stays thin; everything that is actually a decision lives here:
 * head tags, structured data, and handing the section list to the registry.
 *
 * There is no hardcoded content. If the CMS has no homepage, or a homepage with
 * no published sections, this renders the head tags and an empty main — the
 * header, navigation and footer still work, so the site is navigable before any
 * content exists. That is the state a fresh install is in, and it must not look
 * like a crash.
 */
export function HomePage({ title, page, sections, seo }: HomePageProps) {
  const { t } = useTranslations()
  const { name, logo, origin } = useSiteIdentity()

  /**
   * Default structured data for the homepage.
   *
   * `WebSite` + `Organization` as a `@graph`, which is the correct pair for a
   * site's root: `WebSite` describes the property, `Organization` describes who
   * publishes it, and the two cross-reference by `@id`. Emitted only when the
   * CMS has no `schema_data` of its own, and only from real values — a graph
   * padded with invented fields is worse than a small accurate one.
   */
  const defaultSchema = useMemo(() => {
    if (!origin || !name) {
      return undefined
    }

    const websiteId = `${origin}/#website`
    const organizationId = `${origin}/#organization`

    return {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'WebSite',
          '@id': websiteId,
          url: `${origin}/`,
          name,
          ...(seo?.description ? { description: seo.description } : {}),
          ...(page?.locale ? { inLanguage: page.locale } : {}),
          publisher: { '@id': organizationId },
        },
        {
          '@type': 'Organization',
          '@id': organizationId,
          name,
          url: `${origin}/`,
          ...(logo ? { logo } : {}),
        },
      ],
    }
  }, [logo, name, origin, page?.locale, seo?.description])

  const meta = usePageSeo({
    seo,
    fallbackTitle: title ?? t('Home'),
    ...(defaultSchema ? { defaultSchema } : {}),
  })

  return (
    <PageWrapper {...meta}>
      <SectionRenderer sections={sections} />
    </PageWrapper>
  )
}

export default HomePage
