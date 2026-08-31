import { useMemo } from 'react'
import type { ReactNode } from 'react'

import { Breadcrumbs } from '@/Components/Public/Breadcrumbs'
import type { Crumb } from '@/Components/Public/Breadcrumbs'
import { PageWrapper } from '@/Components/Public/PageWrapper'
import { SectionRenderer } from '@/Components/Frontend/Sections'
import { toAbsoluteUrl, usePageSeo, useSiteIdentity } from '@/Hooks/usePageSeo'
import { useTranslations } from '@/Hooks/useTranslations'
import { unwrapList } from '@/Utils/cms'
import type { CmsResolvedSeo, CmsSectionDescriptor } from '@/Types/sections'

export interface ContentPageProps {
  /** `$page->title`, or a translated fallback when the page is missing. */
  title?: string | undefined
  page?: {
    uuid: string
    title: string
    path: string
    locale: string
    page_type?: string | null
  } | null
  /** `PageSectionResource::collection()` — array, or `{ data: [...] }`. */
  sections?: unknown
  /** Shipped for parity with the home payload; components resolve via `registry.ts`. */
  sectionTypes?: Record<string, CmsSectionDescriptor> | CmsSectionDescriptor[]
  seo?: CmsResolvedSeo | null
  /** `PageRenderService::breadcrumbs()`. Empty for the homepage. */
  breadcrumbs?: Crumb[] | null
  /**
   * Rendered INSTEAD of the section list when the page has no published
   * sections.
   *
   * Almost every page should leave this undefined: a content page with nothing
   * on it is a page mid-build, and an apology in its place would be wrong. The
   * 404 is the exception — a blank one reads as a second failure stacked on the
   * first — which is why the slot exists rather than the empty state being
   * baked in here.
   */
  emptyState?: ReactNode
}

/**
 * Every public page that is not the homepage.
 *
 * ONE wrapper for the whole content tree. A service page, a technology page and
 * a privacy policy differ only in which sections an editor put on them, so
 * giving each its own wrapper would be three files that must be kept in sync on
 * head tags, structured data and breadcrumbs — the three things that are most
 * damaging to get subtly different per page.
 *
 * There is no content here. If the page has no published sections this renders
 * the head tags, the trail and an empty main; the shell still works, which is
 * the state a page is in between "created" and "built".
 */
export function ContentPage({
  title,
  page,
  sections,
  seo,
  breadcrumbs,
  emptyState,
}: ContentPageProps) {
  const { t } = useTranslations()
  const { name, origin } = useSiteIdentity()

  const isEmpty = unwrapList(sections).length === 0

  /**
   * Default structured data.
   *
   * `WebPage` plus a `BreadcrumbList`, which is the correct pair for an interior
   * page — the homepage's `WebSite`/`Organization` graph describes the property
   * and belongs only at the root. `BreadcrumbList` is the one that earns the
   * trail in a search result, and it is built from the SAME array the visible
   * breadcrumb renders, so the two can never disagree. Google treats a mismatch
   * between visible and marked-up breadcrumbs as a structured-data violation.
   *
   * Emitted only from real values, and only when the CMS record carries no
   * `schema_data` of its own — an editor who filled that in has made a
   * decision. A graph padded with invented fields is worse than a small
   * accurate one.
   */
  const defaultSchema = useMemo(() => {
    if (!origin) {
      return undefined
    }

    const url = toAbsoluteUrl(page?.path)

    const crumbs = (breadcrumbs ?? []).filter((crumb) => crumb?.title)

    const graph: Array<Record<string, unknown>> = [
      {
        '@type': 'WebPage',
        ...(url ? { '@id': url, url } : {}),
        ...(page?.title ? { name: page.title } : {}),
        ...(seo?.description ? { description: seo.description } : {}),
        ...(page?.locale ? { inLanguage: page.locale } : {}),
        ...(name ? { isPartOf: { '@id': `${origin}/#website` } } : {}),
      },
    ]

    // A one-item trail is the homepage, which has no breadcrumb to describe.
    if (crumbs.length > 1) {
      graph.push({
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.title,
          // The last crumb is the current page and carries no `item`, which is
          // exactly what the spec asks for.
          ...(crumb.path ? { item: toAbsoluteUrl(crumb.path) } : {}),
        })),
      })
    }

    return { '@context': 'https://schema.org', '@graph': graph }
  }, [breadcrumbs, name, origin, page?.locale, page?.path, page?.title, seo?.description])

  const meta = usePageSeo({
    seo,
    fallbackTitle: title ?? page?.title ?? t('Page'),
    ...(defaultSchema ? { defaultSchema } : {}),
  })

  return (
    <PageWrapper {...meta}>
      <Breadcrumbs items={breadcrumbs} />

      {isEmpty && emptyState ? emptyState : <SectionRenderer sections={sections} />}
    </PageWrapper>
  )
}

export default ContentPage
