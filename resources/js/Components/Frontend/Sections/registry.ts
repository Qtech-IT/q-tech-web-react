import { lazy } from 'react'
import type { ComponentType, LazyExoticComponent } from 'react'

import type { SectionComponentProps } from '@/Types/sections'

export type SectionComponent = LazyExoticComponent<
  ComponentType<SectionComponentProps>
>

/**
 * `section_type` → public component.
 *
 * The client half of the section registry. The server already refuses to ship a
 * section whose type it does not know (`PageRenderService::payload()` filters on
 * `SectionTypeRegistry::has()`), and `php artisan cms:validate-registry` fails
 * the build if a `previewComponent()` stops resolving to a file — so this map is
 * the third leg of that contract, not the only one.
 *
 * Every entry is `React.lazy` on purpose. A long page can carry a dozen section
 * types, and a static import map would put every one of them in the entry chunk
 * whether the page renders them or not; Vite splits each `import()` into its own
 * chunk, so a visitor downloads exactly the sections they were served.
 *
 * Keys must match `SectionTypeContract::key()` and values must point at the file
 * named by `previewComponent()`.
 */
export const sectionRegistry: Record<string, SectionComponent> = {
  'hero.split': lazy(() => import('@/Components/Frontend/Sections/HeroSplit')),
  'hero.flow': lazy(() => import('@/Components/Frontend/Sections/HeroFlow')),
  'hero.centered': lazy(
    () => import('@/Components/Frontend/Sections/HeroCentered')
  ),
  'stats.counter': lazy(
    () => import('@/Components/Frontend/Sections/StatsCounter')
  ),
  'cta.band': lazy(() => import('@/Components/Frontend/Sections/CtaBand')),
  'service.grid': lazy(
    () => import('@/Components/Frontend/Sections/ServiceGrid')
  ),
  'process.timeline': lazy(
    () => import('@/Components/Frontend/Sections/ProcessTimeline')
  ),
  'why.choose': lazy(
    () => import('@/Components/Frontend/Sections/WhyChoose')
  ),
  'solution.grid': lazy(
    () => import('@/Components/Frontend/Sections/SolutionGrid')
  ),
  'tech.stack': lazy(
    () => import('@/Components/Frontend/Sections/TechStack')
  ),
  'industry.serve': lazy(
    () => import('@/Components/Frontend/Sections/IndustryServe')
  ),
  'service.featured': lazy(
    () => import('@/Components/Frontend/Sections/ServiceFeature')
  ),
  'portfolio.grid': lazy(
    () => import('@/Components/Frontend/Sections/PortfolioGrid')
  ),
  'work.showcase': lazy(
    () => import('@/Components/Frontend/Sections/WorkShowcase')
  ),
  'ai.innovation': lazy(
    () => import('@/Components/Frontend/Sections/AiInnovation')
  ),
  'results.metrics': lazy(
    () => import('@/Components/Frontend/Sections/ResultsMetrics')
  ),
  'testimonial.wall': lazy(
    () => import('@/Components/Frontend/Sections/TestimonialWall')
  ),
  'faq.accordion': lazy(
    () => import('@/Components/Frontend/Sections/FaqAccordion')
  ),
  'team.grid': lazy(() => import('@/Components/Frontend/Sections/TeamGrid')),
  'award.wall': lazy(() => import('@/Components/Frontend/Sections/AwardWall')),
  'about.story': lazy(
    () => import('@/Components/Frontend/Sections/AboutStory')
  ),
  'article.header': lazy(
    () => import('@/Components/Frontend/Sections/ArticleHeader')
  ),
  'content.html': lazy(
    () => import('@/Components/Frontend/Sections/ContentHtml')
  ),
  'content.prose': lazy(
    () => import('@/Components/Frontend/Sections/ContentProse')
  ),
  'content.split': lazy(
    () => import('@/Components/Frontend/Sections/ContentSplit')
  ),
  'collection.index': lazy(
    () => import('@/Components/Frontend/Sections/CollectionIndex')
  ),
  'media.gallery': lazy(
    () => import('@/Components/Frontend/Sections/MediaGallery')
  ),
  'newsletter.signup': lazy(
    () => import('@/Components/Frontend/Sections/NewsletterSignup')
  ),
  'cta.final': lazy(() => import('@/Components/Frontend/Sections/CtaFinal')),
}

/**
 * The component for a section type, or `null`.
 *
 * Returning `null` — rather than throwing or rendering a placeholder — is the
 * belt-and-braces half of the contract: a type that reaches the client without a
 * component is a deployment skew (new backend, cached old bundle), and a visitor
 * should see the rest of the page rather than an error or a debug box.
 */
export function resolveSectionComponent(
  sectionType: string | null | undefined
): SectionComponent | null {
  if (!sectionType) {
    return null
  }

  return sectionRegistry[sectionType] ?? null
}

/** Whether a type will render. Useful for counting renderable sections. */
export function isRenderableSection(sectionType: string | null | undefined): boolean {
  return resolveSectionComponent(sectionType) !== null
}
