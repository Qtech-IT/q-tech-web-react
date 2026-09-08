import { Fragment, useMemo } from 'react'
import type { ElementType } from 'react'
import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/Utils/helpers'

export interface WordRevealProps {
  /** Plain text. Never markup — an editor's heading is not a template. */
  text: string
  as?: ElementType
  className?: string | undefined
  /** Seconds before the first word starts. */
  delay?: number | undefined
  /** Skip the effect and render plain text (the `none` animation setting). */
  disabled?: boolean | undefined
  id?: string | undefined
}

/**
 * A headline that arrives one word at a time — each word rising and
 * un-blurring into place, ~55ms apart.
 *
 * WHY WORDS AND NOT LETTERS
 * -------------------------
 * A per-letter stagger on a 40-character headline is 40 animated nodes and
 * roughly a second of cascade, and it reads as a gimmick on a sentence (it
 * belongs on a short wordmark — which is exactly where `SiteLoader` uses
 * it). Per-word keeps the count in single digits, finishes in ~400ms, and
 * reads as the sentence assembling itself.
 *
 * WHY THE BLUR
 * ------------
 * Opacity alone reads as a fade; a small blur released alongside it reads as
 * the text *focusing*, which is the thing that makes this feel current
 * rather than like a 2015 fade-up. It is a filter, so it never affects
 * layout and cannot shift the page.
 *
 * ACCESSIBILITY — the text is split into `<span>`s for animation only, so
 * the whole heading is wrapped in a single visually-hidden-free structure:
 * screen readers still read one continuous string because the spans are
 * inline and separated by real spaces. Under `prefers-reduced-motion` (or
 * `disabled`) it renders as plain text with no spans at all.
 */
export function WordReveal({
  text,
  as: Tag = 'span',
  className,
  delay = 0,
  disabled = false,
  id,
}: WordRevealProps) {
  const reduceMotion = useReducedMotion()
  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text])

  if (reduceMotion || disabled || words.length === 0) {
    return (
      <Tag {...(id ? { id } : {})} className={cn(className)}>
        {text}
      </Tag>
    )
  }

  return (
    <Tag {...(id ? { id } : {})} className={cn(className)}>
      {words.map((word, position) => (
        <Fragment key={`${word}-${position}`}>
          {/*
            `inline-block` is what makes `y` and `filter` apply at all — an
            inline box ignores transforms.

            The separating space is a plain text node HERE, as a direct child
            of the heading, and never inside the span. Whitespace at the edge
            of an inline-block box is collapsed away by the inline layout
            algorithm, so a trailing space within the span renders as nothing
            — which is exactly how the headline first shipped as
            "ShippingReliableSoftware". Between two inline-blocks it is a
            real, non-collapsible gap, and it keeps the heading selectable
            and copyable as an ordinary sentence.
          */}
          <motion.span
            className="inline-block will-change-[transform,filter,opacity]"
            initial={{ opacity: 0, y: '0.35em', filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: '0em', filter: 'blur(0px)' }}
            transition={{
              duration: 0.62,
              delay: delay + position * 0.055,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {word}
          </motion.span>
          {position < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </Tag>
  )
}

export default WordReveal
