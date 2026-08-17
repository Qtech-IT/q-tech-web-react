import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/Utils/helpers'
import { Container } from '@/Components/Public/Container'
import type { ContainerProps } from '@/Components/Public/Container'

/**
 * Semantic wrapper for a public page section.
 *
 * Every CMS-driven section renders inside one of these, which is what makes
 * vertical rhythm and background banding consistent by construction rather
 * than by discipline. The variant names map 1:1 to fields the CMS section
 * editor will expose (spacing, background), so the editor can drive this
 * directly without a translation layer.
 */
const sectionVariants = cva('relative w-full', {
  variants: {
    spacing: {
      none: '',
      sm: 'py-fx-band-sm',
      default: 'py-fx-band',
      lg: 'py-fx-band-lg',
    },
    background: {
      /** Inherits the page background. */
      default: '',
      /**
       * Subtle band for alternating sections.
       *
       * `--fx-canvas` is rebound for the same reason `inverted` rebinds it:
       * the token means "the surface behind me", and a band that paints a
       * different surface without saying so makes every consumer of it lie.
       * A gradient feathering into the canvas — the split hero's panel edge,
       * its bottom horizon — was drawing near-white over a grey band and
       * reading as a smear rather than dissolving into anything.
       *
       * Only the paint token moves; ink, lines and accents are unchanged
       * because `surface-2` is a step, not a flip, and still carries the
       * canvas contrast ratios.
       */
      subtle: 'bg-fx-surface-2 [--fx-canvas:var(--fx-surface-2)]',
      /** Raised-surface band. Same reasoning as `subtle`. */
      muted: 'bg-fx-surface-3 [--fx-canvas:var(--fx-surface-3)]',
      /**
       * Flips to the opposite end of the scale in each theme.
       *
       * Rather than restating colours on every descendant, the band rebinds the
       * public ink and line tokens *locally*. Anything nested inside — a stat,
       * a caption, a hairline — stays legible with no prop drilling and no
       * `dark:` branch, because it is still asking for `--fx-ink` and simply
       * getting the inverted value.
       */
      inverted: [
        'bg-fx-inverse text-fx-inverse-ink',
        // `--fx-canvas` flips too, so anything asking for "the surface behind
        // me" (a knocked-out button label, a scrim) gets the right answer.
        '[--fx-canvas:var(--fx-inverse)]',
        '[--fx-ink:var(--fx-inverse-ink)]',
        '[--fx-ink-soft:color-mix(in_oklab,var(--fx-inverse-ink)_74%,transparent)]',
        '[--fx-ink-faint:color-mix(in_oklab,var(--fx-inverse-ink)_60%,transparent)]',
        '[--fx-line:color-mix(in_oklab,var(--fx-inverse-ink)_16%,transparent)]',
        '[--fx-line-strong:color-mix(in_oklab,var(--fx-inverse-ink)_28%,transparent)]',
        '[--fx-surface:color-mix(in_oklab,var(--fx-inverse-ink)_7%,transparent)]',
        '[--fx-surface-2:color-mix(in_oklab,var(--fx-inverse-ink)_11%,transparent)]',
        // The accent and the focus ring have to flip too, or the one coloured
        // element on the band becomes the only thing that fails contrast.
        '[--fx-accent-text:var(--fx-accent-on-inverse)]',
        '[--fx-focus:var(--fx-accent-on-inverse)]',
        // Buttons are admin-authored for the CANVAS. The default primary fill
        // is near-black, which on a near-black band would be an invisible
        // control, so the band takes its buttons back from the settings and
        // paints them from its own ink/fill pair — the same reasoning as
        // `--fx-accent-on-inverse` above, and the same result the `inverse`
        // tone produces by hand.
        //
        // The hover cuts are restated rather than inherited on purpose: a
        // custom property is substituted where it is DECLARED, so the root's
        // `--fx-btn-primary-hover` was already resolved against the root's
        // fill and would not follow these rebindings on its own.
        '[--fx-btn-primary:var(--fx-inverse-ink)]',
        '[--fx-btn-primary-ink:var(--fx-inverse)]',
        '[--fx-btn-primary-hover:color-mix(in_oklab,var(--fx-inverse-ink)_88%,var(--fx-inverse))]',
        '[--fx-btn-secondary:transparent]',
        '[--fx-btn-secondary-ink:var(--fx-inverse-ink)]',
        '[--fx-btn-secondary-hover:color-mix(in_oklab,var(--fx-inverse-ink)_10%,transparent)]',
      ].join(' '),
    },
    /** Clips decorative overflow (gradients, blurred orbs) to the section. */
    clip: {
      true: 'overflow-hidden',
      false: '',
    },
  },
  defaultVariants: {
    spacing: 'default',
    background: 'default',
    clip: false,
  },
})

type SectionVariants = VariantProps<typeof sectionVariants>

export type SectionProps = React.HTMLAttributes<HTMLElement> &
  SectionVariants & {
    as?: React.ElementType
    /**
     * Wrap children in a `Container`. Set `false` for full-bleed content that
     * manages its own measure (carousels, edge-to-edge media).
     */
    contained?: boolean
    containerSize?: ContainerProps['size']
    containerClassName?: string
    /**
     * Anchor target. Also what a CMS "jump link" menu item points at, so it
     * must render even when the section has no heading.
     */
    id?: string
  }

export function Section({
  className,
  spacing,
  background,
  clip,
  as: Comp = 'section',
  contained = true,
  containerSize,
  containerClassName,
  children,
  ...props
}: SectionProps) {
  return (
    <Comp
      data-slot="section"
      className={cn(sectionVariants({ spacing, background, clip }), className)}
      {...props}
    >
      {contained ? (
        <Container size={containerSize} className={containerClassName}>
          {children}
        </Container>
      ) : (
        children
      )}
    </Comp>
  )
}

export { sectionVariants }
