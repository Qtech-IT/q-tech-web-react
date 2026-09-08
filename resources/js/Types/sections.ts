import type { CmsPageSection } from '@/Types/cms'

/**
 * The contract every public section component implements.
 *
 * Deliberately just the section row plus its render position: a section must
 * never need to know what page it is on, or what sits above it, or it stops
 * being reusable across pages and inside global blocks.
 */
export interface SectionComponentProps {
  /** One row of the `sections` payload, already publish-filtered server-side. */
  section: CmsPageSection
  /**
   * Zero-based position in the rendered list.
   *
   * Drives two things only: heading level (position 0 owns the page's single
   * `h1`) and entrance-animation ordering. Never content.
   */
  index: number
}

/**
 * One entry of the `sectionTypes` payload.
 *
 * `PageRenderService::payload()` ships a deliberately minimal descriptor —
 * the admin's field schemas are useless to a visitor — so this is NOT
 * `CmsSectionType`.
 */
export interface CmsSectionDescriptor {
  key: string
  label: string | null
  /** Path under `resources/js/Components`, e.g. `Frontend/Sections/HeroSplit`. */
  component: string | null
}

/** `SeoService::resolve()` — the flat, already-resolved head payload. */
export interface CmsResolvedSeo {
  title: string | null
  title_full: string | null
  description: string | null
  keywords: string | null
  canonical: string | null
  robots_index: boolean
  robots_follow: boolean
  robots_advanced: string | null
  og_title: string | null
  og_description: string | null
  og_type: string | null
  og_image: string | null
  twitter_card: string | null
  twitter_title: string | null
  twitter_image: string | null
  schema_type: string | null
  schema_data: Record<string, unknown> | null
  locale: string | null
  alias: string | null
}
