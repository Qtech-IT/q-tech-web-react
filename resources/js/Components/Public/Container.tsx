import * as React from 'react'
import { cva } from 'class-variance-authority'
import type { VariantProps } from 'class-variance-authority'

import { cn } from '@/Utils/helpers'

/**
 * Horizontal measure + gutters for every public surface.
 *
 * Widths and gutters come from the public design system's `--fx-measure-*` /
 * `--fx-gutter` tokens (see `resources/css/frontend.css`), so changing the
 * site's measure is a one-token edit instead of a find-and-replace across every
 * section — and so the marketing measure can be wider and airier than the
 * admin's without the two ever sharing a number.
 */
const containerVariants = cva('mx-auto w-full', {
  variants: {
    size: {
      /** 1320px — default reading/content width. */
      default: 'max-w-fx-page',
      /** 1440px — feature rows that need more air. */
      wide: 'max-w-fx-wide',
      /** 704px — prose measure; keeps line length near 72ch. */
      narrow: 'max-w-fx-prose',
      /** No clamp; the child manages its own width. */
      full: 'max-w-none',
    },
    gutter: {
      true: 'px-fx-gutter',
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
