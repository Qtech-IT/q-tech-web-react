import { Suspense, useMemo } from 'react'

import { Section } from '@/Components/Public/Section'
import { cn } from '@/Utils/helpers'
import { normalizeSection, unwrapList } from '@/Utils/cms'
import { SectionBoundary } from '@/Components/Frontend/Sections/SectionBoundary'
import { resolveSectionComponent } from '@/Components/Frontend/Sections/registry'
import type { CmsPageSection } from '@/Types/cms'

export interface SectionRendererProps {
  /**
   * The `sections` payload. Accepted in raw form and normalised with
   * `unwrapList`, because a resource collection arrives as `{ data: [...] }`
   * when paginated and as a bare array when it is not.
   */
  sections: unknown
}

/** One shimmering bar. Never a fixed pixel width — always a fraction of its row. */
function Bar({ className }: { className?: string }) {
  return <div className={cn('rounded-fx-xs fx-shimmer', className)} />
}

/**
 * `section_type` → how many beats of "this is roughly what's coming" its
 * fallback should show. Grouped by SHAPE, not by exact type, because a new
 * hero variant should get the hero shape for free rather than falling back to
 * the generic three-bar placeholder every type used to share.
 *
 * This is the fix for the fallback flashing the wrong SIZE, not just the
 * wrong colour: `hero.*` reserves a tall, centered block; `service.grid`
 * reserves a header plus a card grid; everything else gets a compact header
 * band. Guessing badly here is what used to make the real component's chunk
 * arriving look like a layout jump instead of a reveal.
 */
function shapeFor(sectionType: string): 'hero' | 'grid' | 'band' {
  if (sectionType.startsWith('hero.')) {
    return 'hero'
  }

  if (sectionType === 'service.grid') {
    return 'grid'
  }

  return 'band'
}

/** Centered, generously spaced — reserves roughly what a hero occupies. */
function HeroFallback() {
  return (
    <div className="flex flex-col items-center gap-5">
      <Bar className="h-9 w-1/2 max-w-xl" />
      <Bar className="h-9 w-2/5 max-w-md" />
      <Bar className="h-4 w-3/5 max-w-lg" />
      <div className="mt-2 flex gap-3">
        <Bar className="h-11 w-32 rounded-fx-xs" />
        <Bar className="h-11 w-32 rounded-fx-xs" />
      </div>
    </div>
  )
}

/** A header band over a 3-column card grid — `service.grid`'s shape. */
function GridFallback() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <Bar className="h-8 w-2/5 max-w-sm" />
        <Bar className="h-4 w-3/5 max-w-md" />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }, (_, position) => (
          <Bar key={position} className="h-40 w-full rounded-fx-lg" />
        ))}
      </div>
    </div>
  )
}

/** A compact header band — the default shape for everything else. */
function BandFallback() {
  return (
    <div className="flex flex-col gap-fx-stack-sm">
      <Bar className="h-3 w-28" />
      <Bar className="h-10 w-full max-w-2xl" />
      <Bar className="h-4 w-full max-w-xl" />
    </div>
  )
}

const FALLBACKS = {
  hero: HeroFallback,
  grid: GridFallback,
  band: BandFallback,
} as const

/**
 * Placeholder for a section whose chunk is still downloading, shaped to
 * roughly match what that section type actually renders.
 *
 * Reserves a band of the right order of magnitude so the footer does not
 * jump up and then back down as chunks arrive — a generic one-size skeleton
 * under-reserved space for a tall hero and over-reserved it for a compact
 * band, so either direction still produced a jump. `aria-hidden` because it
 * is pure scaffolding — a screen reader announcing shimmering rectangles is
 * noise.
 */
function SectionFallback({ sectionType }: { sectionType: string }) {
  const shape = shapeFor(sectionType)
  const Fallback = FALLBACKS[shape]

  return (
    <Section spacing={shape === 'hero' ? 'lg' : 'default'} aria-hidden="true">
      <Fallback />
    </Section>
  )
}

/**
 * Renders a page's sections in editor order, through the client registry.
 *
 * Ordering is done here, once, rather than trusted from the payload: the server
 * does sort by `sort_order`, but a cached payload written before a reorder would
 * otherwise render stale. Sorting a handful of rows costs nothing.
 *
 * Each section gets its own `Suspense` boundary rather than sharing one, so a
 * slow chunk low on the page cannot hold back the hero, and its own
 * `SectionBoundary`, so one bad section cannot blank the page.
 */
export function SectionRenderer({ sections }: SectionRendererProps) {
  const ordered = useMemo(() => {
    const list = unwrapList<CmsPageSection>(sections)

    // Normalised here rather than in each section component. Nested API
    // Resources arrive individually wrapped (`blocks: { data: [...] }`), which
    // the `CmsPageSection` type does not describe — so the mismatch is
    // invisible to `tsc` and shows up as a section that silently renders
    // nothing. One boundary, one unwrap, every section type covered.
    return [...list]
      .map(normalizeSection)
      .sort((a, b) => a.sort_order - b.sort_order)
  }, [sections])

  if (ordered.length === 0) {
    return null
  }

  // Position is counted over rendered sections only, so an unknown type at the
  // top cannot leave the page without an `h1`.
  let position = -1

  return (
    <>
      {ordered.map((section) => {
        const Component = resolveSectionComponent(section.section_type)

        // Unknown type: render nothing at all. No placeholder, no console noise
        // for a visitor — the server already filtered these out, so reaching
        // here means the bundle is older than the backend.
        if (!Component) {
          return null
        }

        position += 1

        return (
          <SectionBoundary key={section.uuid} sectionType={section.section_type}>
            <Suspense fallback={<SectionFallback sectionType={section.section_type} />}>
              <Component section={section} index={position} />
            </Suspense>
          </SectionBoundary>
        )
      })}
    </>
  )
}

export default SectionRenderer
