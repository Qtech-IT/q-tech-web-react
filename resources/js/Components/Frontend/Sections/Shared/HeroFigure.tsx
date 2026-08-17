import { useId } from 'react'

import { StatValue } from '@/Components/Frontend/Sections/Shared/StatValue'
import { readString, trimmed } from '@/Components/Frontend/Sections/Shared/values'
import { NavIcon, isRegisteredNavIcon } from '@/Components/Public/NavIcon'
import { cn } from '@/Utils/helpers'
import type { CmsSectionBlock } from '@/Types/cms'

export interface HeroFigureProps {
  /** `stat` blocks. The figure is meaningless without them and renders null. */
  stats: CmsSectionBlock[]
  /** Accessible name for the figure's data. Supplied by the caller via `t()`. */
  label: string
  className?: string | undefined
}

/**
 * Horizontal offsets that make the cards read as *floating* rather than as a
 * stacked list.
 *
 * A static tuple, not a computed transform: the values are design decisions,
 * and indexing a frozen array is also what keeps Tailwind able to see the
 * classes at build time. Cards past the third repeat the cycle, so an editor
 * adding a fourth statistic gets a sensible layout instead of a broken one.
 */
const CARD_OFFSETS = [
  'self-start',
  'self-end me-2 sm:me-6',
  'self-start ms-4 sm:ms-10',
] as const

/**
 * The hero's media column when the CMS has no asset for it.
 *
 * WHY THIS EXISTS
 * ---------------
 * A split hero with an empty second column looks like a bug, and filling it
 * with a stock photograph is the exact thing the design brief forbids. So the
 * column is composed from the page's own material: the statistics the editor
 * already wrote, floated on a field built entirely from design tokens.
 *
 * COMPOSITION — four layers, back to front:
 *   1. `fx-accent-field`: three offset gradients keyed to `--fx-accent`, so the
 *      field rebrands with the accent instead of being a fixed picture.
 *   2. `fx-fine-grid`: a 36px hairline grid, masked to fade out downward, which
 *      gives the field a sense of plane and depth.
 *   3. An original SVG trace — one ascending curve, its area softly filled,
 *      with a node on each inflection. Drawn here in code; no asset, no
 *      external library, nothing traced from anywhere.
 *   4. The statistic cards.
 *
 * ACCESSIBILITY — layers 1–3 are decoration and are `aria-hidden`. The cards
 * are NOT: they carry the numbers, so they stay a real labelled list that a
 * screen reader reads as content. The figure is not an `<img>` and has no alt
 * text, because there is no image and nothing is being described.
 *
 * LAYOUT SHIFT — the frame declares an aspect ratio at every breakpoint, so its
 * height is reserved on first paint exactly as a sized image would be.
 */
export function HeroFigure({ stats, label, className }: HeroFigureProps) {
  const gradientId = useId()

  const visible = stats.filter(
    (stat) => trimmed(stat.value) || trimmed(stat.label)
  )

  if (visible.length === 0) {
    return null
  }

  return (
    <div className={cn('relative', className)}>
      {/* Offset tint behind the frame. One layer of depth is what makes the
          figure read as an object on the page rather than a bordered box. */}
      <div
        aria-hidden="true"
        className="absolute inset-x-5 -top-3 -bottom-3 rounded-fx-2xl bg-fx-accent-soft opacity-70"
      />

      <div
        className={cn(
          'relative overflow-hidden rounded-fx-xl border border-fx-line',
          'fx-accent-field fx-raise-4',
          // Reserved height at every breakpoint — the figure occupies exactly
          // the same box before and after its contents settle.
          'aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/5]'
        )}
      >
        <div aria-hidden="true" className="absolute inset-0">
          <div className="fx-fine-grid absolute inset-0 opacity-60" />

          {/* Original trace. `preserveAspectRatio="none"` lets one path fill
              any frame the responsive ratios produce, so the curve never
              letterboxes inside its own container. */}
          <svg
            viewBox="0 0 400 400"
            preserveAspectRatio="none"
            className="absolute inset-0 size-full"
            role="presentation"
          >
            <defs>
              <linearGradient id={`${gradientId}-fill`} x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="0%"
                  stopColor="var(--fx-accent)"
                  stopOpacity="0.22"
                />
                <stop
                  offset="100%"
                  stopColor="var(--fx-accent)"
                  stopOpacity="0"
                />
              </linearGradient>
            </defs>

            <path
              d="M0 318 C 62 306, 96 268, 150 250 S 232 226, 268 176 S 340 104, 400 78 L 400 400 L 0 400 Z"
              fill={`url(#${gradientId}-fill)`}
            />
            <path
              d="M0 318 C 62 306, 96 268, 150 250 S 232 226, 268 176 S 340 104, 400 78"
              fill="none"
              stroke="var(--fx-accent)"
              strokeOpacity="0.5"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              strokeLinecap="round"
            />
          </svg>

          {/* Nodes sit in their own absolutely-positioned layer rather than in
              the SVG, because the SVG is stretched by `preserveAspectRatio` and
              circles inside it would render as ellipses. */}
          <span className="absolute top-[62%] left-[37%] size-2.5 rounded-full bg-fx-accent shadow-fx-2" />
          <span className="absolute top-[44%] left-[67%] size-2 rounded-full bg-fx-accent opacity-70" />
          <span className="absolute top-[19%] left-[93%] size-1.5 rounded-full bg-fx-accent opacity-50" />
        </div>

        <ul
          aria-label={label}
          className="relative flex size-full flex-col justify-between gap-3 p-5 sm:p-7"
        >
          {visible.map((stat, position) => {
            const value = trimmed(stat.value)
            const statLabel = trimmed(stat.label)
            const icon = stat.icon ?? undefined

            return (
              <li
                key={stat.uuid}
                className={cn(
                  'inline-flex max-w-[15rem] items-center gap-3.5',
                  'rounded-fx-md border border-fx-line bg-fx-surface/92 px-4 py-3',
                  'backdrop-blur-sm fx-raise-3',
                  CARD_OFFSETS[position % CARD_OFFSETS.length]
                )}
              >
                {isRegisteredNavIcon(icon) ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'flex size-9 shrink-0 items-center justify-center rounded-fx-sm',
                      'border border-fx-accent-line bg-fx-accent-soft text-fx-accent-text'
                    )}
                  >
                    <NavIcon name={icon} className="size-4.5" />
                  </span>
                ) : null}

                <span className="min-w-0">
                  {value ? (
                    <StatValue
                      value={value}
                      prefix={readString(stat.data, 'prefix')}
                      suffix={readString(stat.data, 'suffix')}
                      className="fx-numerals block text-fx-subheading text-fx-ink"
                    />
                  ) : null}

                  {statLabel ? (
                    <span className="mt-0.5 block text-fx-meta text-pretty text-fx-ink-soft">
                      {statLabel}
                    </span>
                  ) : null}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default HeroFigure
