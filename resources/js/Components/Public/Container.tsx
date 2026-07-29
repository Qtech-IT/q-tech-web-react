import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/Utils/helpers'

/**
 * Horizontal measure + gutters for every public surface.
 *
 * Widths and gutters come from the `--container-*` / `--gutter` tokens rather
 * than Tailwind's breakpoint scale, so changing the site's measure is a
 * one-token edit instead of a find-and-replace across every section.
 */
const containerVariants = cva('mx-auto w-full', {
  variants: {
    size: {
      /** 1280px — default reading/content width. */
      default: 'max-w-(--container-max)',
      /** 1440px — feature rows that need more air. */
      wide: 'max-w-(--container-wide)',
      /** 768px — prose measure; keeps line length readable. */
      narrow: 'max-w-(--container-narrow)',
      /** No clamp; the child manages its own width. */
      full: 'max-w-none',
    },
    gutter: {
      true: 'px-(--gutter)',
      false: '',
    },
  },
  defaultVariants: {
    size: 'default',
    gutter: true,
  },
})

type ContainerVariants = VariantProps<typeof containerVariants>

export type ContainerProps = React.HTMLAttributes<HTMLElement> &
  ContainerVariants & {
    /** Render as a different element without adding a wrapper node. */
    as?: React.ElementType
  }

export function Container({
  className,
  size,
  gutter,
  as: Comp = 'div',
  ...props
}: ContainerProps) {
  return (
    <Comp
      data-slot="container"
      className={cn(containerVariants({ size, gutter }), className)}
      {...props}
    />
  )
}

export { containerVariants }
