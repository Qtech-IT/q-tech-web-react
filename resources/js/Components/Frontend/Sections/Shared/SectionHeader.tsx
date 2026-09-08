import type { ReactNode } from 'react'

import { cn } from '@/Utils/helpers'
import { Reveal } from '@/Components/Frontend/Sections/Shared/Reveal'
import type { RevealPreset } from '@/Components/Frontend/Sections/Shared/Reveal'

export type HeadingLevel = 'h1' | 'h2' | 'h3'

export interface SectionHeaderProps {
  eyebrow?: string | undefined
  /** Pass a node when the heading needs inline treatment, e.g. accented words. */
  heading?: ReactNode
  subheading?: string | undefined
  /**
   * Position 0 on a page owns the `h1`. Passing this explicitly — rather than
   * hardcoding `h2` — is what keeps heading order correct when an editor
   * reorders sections.
   */
  headingLevel?: HeadingLevel | undefined
  /** Type scale for the heading. Independent of its semantic level. */
  headingSize?: 'display' | 'h1' | 'h2' | 'h3' | undefined
  align?: 'start' | 'center' | undefined
  preset?: RevealPreset | undefined
  trigger?: 'mount' | 'view' | undefined
  /** Anchor id for the heading, so a nav jump link lands on the title. */
  headingId?: string | undefined
  className?: string | undefined
}

/**
 * Semantic level and visual size are separate on purpose (an `h2` may need to
 * be the biggest thing on the page), so this maps the size vocabulary onto the
 * public type scale in `frontend.css` rather than onto the admin's.
 */
const HEADING_SIZES = {
  display: 'text-fx-display',
  h1: 'text-fx-title',
  h2: 'text-fx-heading',
  h3: 'text-fx-subheading',
} as const

/**
 * Eyebrow + heading + subheading, in the site's standard rhythm.
 *
 * Every region is independently optional and the whole component collapses to
 * `null` when nothing is set, so a section that has only repeater rows renders
 * the rows without an empty gap above them.
 */
export function SectionHeader({
  eyebrow,
  heading,
  subheading,
  headingLevel = 'h2',
  headingSize = 'h2',
  align = 'start',
  preset = 'rise',
  trigger = 'view',
  headingId,
  className,
}: SectionHeaderProps) {
  if (!eyebrow && !heading && !subheading) {
    return null
  }

  const Heading = headingLevel
  const centered = align === 'center'

  return (
    <Reveal
      preset={preset}
      trigger={trigger}
      className={cn(
        'flex flex-col gap-fx-stack-sm',
        centered && 'mx-auto max-w-3xl text-center items-center',
        className
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            'flex items-center gap-3 text-fx-eyebrow uppercase text-fx-ink-faint',
            centered && 'justify-center'
          )}
        >
          {/* Decorative rule. The kicker is set apart by scale, tracking and a
              hairline; the accent appears once, at its tip. */}
          <span
            aria-hidden="true"
            className="h-px w-8 bg-[linear-gradient(to_right,var(--fx-accent),transparent)]"
          />
          {eyebrow}
        </p>
      ) : null}

      {heading ? (
        <Heading
          {...(headingId ? { id: headingId } : {})}
          className={cn(
            HEADING_SIZES[headingSize],
            'text-balance text-fx-ink'
          )}
        >
          {heading}
        </Heading>
      ) : null}

      {subheading ? (
        <p
          className={cn(
            'text-fx-lead text-pretty text-fx-ink-soft',
            !centered && 'max-w-[58ch]'
          )}
        >
          {subheading}
        </p>
      ) : null}
    </Reveal>
  )
}

export default SectionHeader
