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
      sm: 'py-(--section-py-sm)',
      default: 'py-(--section-py)',
      lg: 'py-(--section-py-lg)',
    },
    background: {
      /** Inherits the page background. */
      default: '',
      /** Subtle band for alternating sections. */
      subtle: 'bg-(--surface-subtle)',
      /** Card-coloured band. */
      muted: 'bg-muted',
      /**
       * Flips to the opposite end of the scale in each theme. Sets `--` tokens
       * locally so nested components stay legible without prop drilling.
       */
      inverted:
        'bg-(--surface-inverted) text-(--surface-inverted-foreground) [--foreground:var(--surface-inverted-foreground)] [--muted-foreground:color-mix(in_oklab,var(--surface-inverted-foreground)_72%,transparent)] [--border:color-mix(in_oklab,var(--surface-inverted-foreground)_18%,transparent)]',
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
