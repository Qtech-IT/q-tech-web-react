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
