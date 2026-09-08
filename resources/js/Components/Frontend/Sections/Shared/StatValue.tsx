import { useLayoutEffect, useMemo, useRef } from 'react'
import { animate, useInView, useReducedMotion } from 'motion/react'

import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'

export interface StatValueProps {
  /**
   * `blocks[].value`, always a string: "500", "99.9", "24/7" and "1,200" are
   * all legitimate editor input, so this component decides whether the value
   * is countable rather than assuming it.
   */
  value: string
  /** `blocks[].data.prefix` — never animated, so "$" does not count up. */
  prefix?: string | undefined
  /** `blocks[].data.suffix` — never animated, so "+" and "%" stay put. */
  suffix?: string | undefined
  /** `settings.animate`. Ignored when the user prefers reduced motion. */
  animateCounter?: boolean | undefined
  className?: string | undefined
}

interface ParsedValue {
  target: number
  decimals: number
}

/**
 * The numeric target behind an editor-entered value, or `null`.
 *
 * Grouped integers are handled explicitly because `Number('1,200')` is `NaN`
 * and a naive comma-to-dot rewrite would turn it into `1.2`.
 */
function parseNumeric(raw: string): ParsedValue | null {
  const value = raw.trim()

  if (/^-?\d{1,3}(?:,\d{3})+$/.test(value)) {
    return { target: Number(value.replace(/,/g, '')), decimals: 0 }
  }

  if (/^-?\d+$/.test(value)) {
    return { target: Number(value), decimals: 0 }
  }

  const fractional = /^-?\d+\.(\d+)$/.exec(value)

  if (fractional) {
    return { target: Number(value), decimals: fractional[1]?.length ?? 0 }
  }

  return null
}

/**
 * A statistic's value, counted up once when it first enters the viewport.
 *
 * Three behaviours are load-bearing:
 *
 * 1. **Counts once.** `useInView(..., { once: true })` latches, so scrolling
 *    back up does not restart the count — a number that re-animates every time
 *    it passes the fold reads as a bug, not a flourish.
 * 2. **Reduced motion means no count.** The final value is written
 *    immediately; there is no shortened animation, because a counting number
 *    *is* the motion a user disabled it to avoid.
 * 3. **Non-numeric values are never animated.** "24/7" has no numeric target,
 *    so it renders as typed instead of being coerced to `NaN`.
 *
 * The count is driven through `textContent` on a ref rather than React state:
 * a 1.4s animation at 60fps is ~84 renders per stat otherwise, and the value is
 * a leaf text node that nothing else depends on. Assistive technology reads the
 * static `sr-only` copy, so it never hears a stream of intermediate numbers.
 */
export function StatValue({
  value,
  prefix,
  suffix,
  animateCounter = true,
  className,
}: StatValueProps) {
  const { locale } = useTranslations()
  const reduceMotion = useReducedMotion()
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const numberRef = useRef<HTMLSpanElement>(null)
  const inView = useInView(wrapperRef, { once: true, amount: 0.4 })

  const parsed = useMemo(() => parseNumeric(value), [value])

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat(locale || undefined, {
        minimumFractionDigits: parsed?.decimals ?? 0,
        maximumFractionDigits: parsed?.decimals ?? 0,
      }),
    [locale, parsed?.decimals]
  )

  const finalText = parsed ? formatter.format(parsed.target) : value
  const shouldCount = Boolean(parsed) && animateCounter && !reduceMotion

  // Layout effect, not effect: writing the starting value after paint would
  // show the final number for one frame and then visibly snap back to zero.
  useLayoutEffect(() => {
    const node = numberRef.current

    if (!node || !parsed) {
      return
    }

    if (!shouldCount) {
      node.textContent = finalText

      return
    }

    if (!inView) {
      node.textContent = formatter.format(0)

      return
    }

    const controls = animate(0, parsed.target, {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (current: number) => {
        node.textContent = formatter.format(current)
      },
    })

    return () => controls.stop()
  }, [finalText, formatter, inView, parsed, shouldCount])

  const spoken = `${prefix ?? ''}${finalText}${suffix ?? ''}`

  return (
    <span ref={wrapperRef} className={cn('tabular-nums', className)}>
      {/* Hidden from assistive tech: the animated node's text changes ~84
          times, which some screen readers would announce on every mutation. */}
      <span aria-hidden="true">
        {prefix ? <span>{prefix}</span> : null}
        {/* Rendered with the final value so first paint, and any environment
            where the effect never runs, still shows a real number. */}
        <span ref={numberRef}>{finalText}</span>
        {suffix ? <span>{suffix}</span> : null}
      </span>
      <span className="sr-only">{spoken}</span>
    </span>
  )
}

export default StatValue
