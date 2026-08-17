/**
 * Public entry point for the section registry.
 *
 * Deliberately does NOT re-export `HeroSplit`, `StatsCounter` or `CtaBand`. A
 * barrel that names them would turn every `React.lazy` in `registry.ts` into a
 * static import through this file and put all three chunks in the entry bundle —
 * which is exactly the code splitting the registry exists to get.
 */
export { SectionRenderer } from '@/Components/Frontend/Sections/SectionRenderer'
export type { SectionRendererProps } from '@/Components/Frontend/Sections/SectionRenderer'

export { SectionBoundary } from '@/Components/Frontend/Sections/SectionBoundary'

export {
  isRenderableSection,
  resolveSectionComponent,
  sectionRegistry,
} from '@/Components/Frontend/Sections/registry'
export type { SectionComponent } from '@/Components/Frontend/Sections/registry'
