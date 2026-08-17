import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/Utils/helpers'

/** Mirrors the `animation` setting every section type exposes. */
export type RevealPreset = 'none' | 'fade' | 'rise' | 'stagger'

export const REVEAL_PRESETS = ['none', 'fade', 'rise', 'stagger'] as const

const MOTION_TAGS = {
  div: motion.div,
  li: motion.li,
  span: motion.span,
  p: motion.p,
} as const

export type RevealTag = keyof typeof MOTION_TAGS

export interface RevealProps {
  children: ReactNode
  /** From `settings.animation`. Unknown values are normalised by `readOption`. */
  preset?: RevealPreset | undefined
  /** Stagger position. Only has an effect for the `stagger` preset. */
  index?: number | undefined
  /**
   * `mount` for above-the-fold content — a hero that waits for an intersection
   * observer flashes empty on first paint. `view` for everything else.
   */
  trigger?: 'mount' | 'view' | undefined
  as?: RevealTag | undefined
  className?: string | undefined
}

/**
 * The one entrance-animation primitive every section uses.
 *
 * Under `prefers-reduced-motion`, or the `none` preset, this renders a plain
 * element with **no motion component at all** — not a zero-duration animation.
 * That distinction matters: a motion component still writes `transform` and
 * `opacity` inline, which is exactly what a user asking for reduced motion is
 * trying to avoid, and it also promotes the node to its own compositor layer
 * for no reason.
 *
 * MOTION FEEL — a spring, not a tween. `rise`/`stagger` pair a small upward
 * translate with a very subtle scale-in (0.98 → 1): scale alone reads as a
 * pop, translate alone reads as a slide, and the combination is what gives a
 * reveal a sense of settling into place rather than just appearing — the
 * quality a duration-based ease can approximate but a spring produces for
 * free. `stiffness`/`damping` are tuned to settle in ~450-500ms with no
 * overshoot bounce, so the effect reads as considered rather than playful.
 * `fade` skips the transform entirely for content that should not move at
 * all (e.g. a backdrop layer). Every preset stays opacity/transform only, so
 * none of them can introduce layout shift.
 */
export function Reveal({
  children,
  preset = 'rise',
  index = 0,
  trigger = 'view',
  as = 'div',
  className,
}: RevealProps) {
  const reduceMotion = useReducedMotion()

  if (reduceMotion || preset === 'none') {
    const Tag = as

    return <Tag className={cn(className)}>{children}</Tag>
  }

  const Motion = MOTION_TAGS[as]

  const hidden =
    preset === 'fade' ? { opacity: 0 } : { opacity: 0, y: 16, scale: 0.98 }
  const shown =
    preset === 'fade' ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }
  // Capped at 8 rather than 12: a spring's settle time does not shrink the
  // way a tween's fixed duration would, so a long cascade compounds into a
  // multi-second wait rather than staying snappy.
  const delay = preset === 'stagger' ? Math.min(index, 8) * 0.06 : 0

  return (
    <Motion
      className={cn(className)}
      initial={hidden}
      {...(trigger === 'mount'
        ? { animate: shown }
        : {
            whileInView: shown,
            viewport: { once: true, amount: 0.2, margin: '0px 0px -10% 0px' },
          })}
      transition={{
        type: 'spring',
        stiffness: 220,
        damping: 26,
        mass: 0.9,
        delay,
      }}
    >
      {children}
    </Motion>
  )
}

export default Reveal
