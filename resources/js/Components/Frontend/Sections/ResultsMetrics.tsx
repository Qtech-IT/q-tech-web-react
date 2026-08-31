import { useMemo } from 'react'

import { NavIcon, isRegisteredNavIcon } from '@/Components/Public/NavIcon'
import { Section } from '@/Components/Public/Section'
import { fxButton } from '@/Components/Public/fxButton'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import { blocksOfType } from '@/Components/Frontend/Sections/Shared/blocks'
import { highlightHeading } from '@/Components/Frontend/Sections/Shared/highlight'
import { Reveal } from '@/Components/Frontend/Sections/Shared/Reveal'
import { SectionCta } from '@/Components/Frontend/Sections/Shared/SectionCta'
import { SectionHeader } from '@/Components/Frontend/Sections/Shared/SectionHeader'
import type { HeadingLevel } from '@/Components/Frontend/Sections/Shared/SectionHeader'
import { StatValue } from '@/Components/Frontend/Sections/Shared/StatValue'
import {
  readBoolean,
  readOption,
  readString,
  trimmed,
} from '@/Components/Frontend/Sections/Shared/values'
import type { CmsSectionBlock } from '@/Types/cms'
import type { SectionComponentProps } from '@/Types/sections'

const COLUMNS = ['2', '3', '4', '5'] as const
const ALIGNMENTS = ['center', 'start'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const
const ACCENTS = ['brand', 'ink', 'amber', 'teal', 'violet', 'rose'] as const

type Accent = (typeof ACCENTS)[number]

/** Cycled by position when a metric has no `settings.accent`, as everywhere. */
const ACCENT_CYCLE = ['brand', 'violet', 'teal', 'amber', 'rose', 'ink'] as const

function cycledAccent(index: number): Accent {
  return ACCENT_CYCLE[index % ACCENT_CYCLE.length] as Accent
}

/*
 * Static class maps, indexed by values `readOption` has already constrained —
 * Tailwind scans source text, so none of these may be assembled at runtime.
 */

/**
 * The rail across the top of the card.
 *
 * The one place the hue is spent at full strength. It is 3px of decoration
 * with no text on it, so it carries no contrast obligation and can stay
 * saturated on every band, including `inverted`.
 */
const RAIL_CLASSES = {
  brand: 'bg-gradient-to-r from-fx-mark-brand to-fx-mark-brand/30',
  ink: 'bg-gradient-to-r from-fx-mark-ink to-fx-mark-ink/30',
  amber: 'bg-gradient-to-r from-fx-mark-amber to-fx-mark-amber/30',
  teal: 'bg-gradient-to-r from-fx-mark-teal to-fx-mark-teal/30',
  violet: 'bg-gradient-to-r from-fx-mark-violet to-fx-mark-violet/30',
  rose: 'bg-gradient-to-r from-fx-mark-rose to-fx-mark-rose/30',
} as const

/**
 * The icon tile.
 *
 * FILLED with the hue and the glyph knocked out of it, rather than the hue
 * used as ink on a wash. That is deliberate and it is what makes this section
 * safe on the `inverted` band: `--fx-mark-*` are defined once at `:root` per
 * colour scheme and do NOT rebind inside an inverted `Section`, so a hue used
 * as ink would keep its light-theme value on a near-black band. Used as a
 * fill with `--fx-mark-glyph` on top, the pair is legible on any background.
 */
const TILE_CLASSES = {
  brand: 'bg-fx-mark-brand text-fx-mark-brand-glyph',
  ink: 'bg-fx-mark-ink text-fx-mark-ink-glyph',
  amber: 'bg-fx-mark-amber text-fx-mark-glyph',
  teal: 'bg-fx-mark-teal text-fx-mark-glyph',
  violet: 'bg-fx-mark-violet text-fx-mark-glyph',
  rose: 'bg-fx-mark-rose text-fx-mark-glyph',
} as const

/** The wash that blooms from the card's foot on hover. Decoration only. */
const BLOOM_CLASSES = {
  brand: 'bg-[radial-gradient(80%_70%_at_50%_100%,var(--fx-mark-brand),transparent_70%)]',
  ink: 'bg-[radial-gradient(80%_70%_at_50%_100%,var(--fx-mark-ink),transparent_70%)]',
  amber: 'bg-[radial-gradient(80%_70%_at_50%_100%,var(--fx-mark-amber),transparent_70%)]',
  teal: 'bg-[radial-gradient(80%_70%_at_50%_100%,var(--fx-mark-teal),transparent_70%)]',
  violet: 'bg-[radial-gradient(80%_70%_at_50%_100%,var(--fx-mark-violet),transparent_70%)]',
  rose: 'bg-[radial-gradient(80%_70%_at_50%_100%,var(--fx-mark-rose),transparent_70%)]',
} as const

/**
 * Five is the interesting case: it must not become a five-across row on a
 * laptop, and it must not leave one orphan on a tablet. Three at `lg` and five
 * at `xl` keeps the last row full at both widths for the five-metric set this
 * section was designed around.
 */
const COLUMN_CLASSES = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
  '5': 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5',
} as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

function cardPreset(animation: (typeof ANIMATIONS)[number]) {
  return animation === 'rise' ? 'stagger' : animation
}

/** A row worth rendering — has a number, a label, or both. */
function hasContent(block: CmsSectionBlock): boolean {
  return Boolean(trimmed(block.value) || trimmed(block.label))
}

/**
 * One metric.
 *
 * The numeral stays on `--fx-ink` rather than on the card's hue: it is the
 * largest piece of text in the section and the only one a visitor is meant to
 * read from across the room, so it takes the band's highest-contrast ink and
 * lets the rail, the tile and the bloom carry the colour.
 */
function MetricCard({
  block,
  index,
  preset,
  animateCounter,
}: {
  block: CmsSectionBlock
  index: number
  preset: 'none' | 'fade' | 'stagger'
  animateCounter: boolean
}) {
  const value = trimmed(block.value)
  const label = trimmed(block.label)
  const description = trimmed(block.description)
  const prefix = readString(block.data, 'prefix')
  const suffix = readString(block.data, 'suffix')
  const accent = readOption(block.settings, 'accent', ACCENTS, cycledAccent(index))

  return (
    <Reveal as="li" preset={preset} index={index} className="group/metric flex">
      <div
        className={cn(
          'relative isolate flex flex-1 flex-col gap-3 overflow-hidden',
          'rounded-fx-xl border border-fx-line bg-fx-surface p-6 fx-raise-1',
          'transition-[border-color,box-shadow,transform] duration-300 ease-fx',
          'hover:-translate-y-1 hover:border-fx-accent-line hover:shadow-fx-3',
          'motion-reduce:transition-none motion-reduce:hover:translate-y-0'
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 h-1',
            RAIL_CLASSES[accent]
          )}
        />

        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 -z-10 opacity-0',
            'transition-opacity duration-500 ease-fx',
            'group-hover/metric:opacity-[0.10] motion-reduce:transition-none',
            BLOOM_CLASSES[accent]
          )}
        />

        {isRegisteredNavIcon(block.icon ?? undefined) ? (
          <span
            aria-hidden="true"
            className={cn(
              'mt-1 flex size-10 items-center justify-center rounded-fx-md shadow-fx-1',
              TILE_CLASSES[accent]
            )}
          >
            <NavIcon name={block.icon ?? undefined} className="size-5" />
          </span>
        ) : null}

        {value ? (
          <StatValue
            value={value}
            prefix={prefix}
            suffix={suffix}
            animateCounter={animateCounter}
            className="fx-numerals block text-fx-stat text-fx-ink"
          />
        ) : null}

        {label ? (
          <span className="block text-fx-body font-semibold text-balance text-fx-ink">
            {label}
          </span>
        ) : null}

        {description ? (
          <p className="text-fx-body-sm text-pretty text-fx-ink-soft">
            {description}
          </p>
        ) : null}
      </div>
    </Reveal>
  )
}

/**
 * Results & Metrics — the numbers a buyer checks before they read anything.
 *
 * WHY THE NUMBER IS SPLIT FROM ITS AFFIXES — an editor typing "5M+" into one
 * field gets a string with no numeric target, and `StatValue` correctly
 * refuses to animate it. Split into `value: "5"` + `suffix: "M+"`, the numeral
 * counts and the affixes sit still, which is also the only version that reads
 * right: a "+" counting up alongside the number is a visual bug. Non-numeric
 * values ("24/7") still render exactly as typed.
 *
 * ACCESSIBILITY — the counting node is `aria-hidden` and every card carries a
 * static `sr-only` copy of its final value (see `StatValue`), so assistive
 * tech hears "5M+ users served" once rather than eighty intermediate numbers.
 * Under `prefers-reduced-motion` nothing counts and nothing rises; the final
 * values are painted immediately.
 *
 * Renders `null` when there is neither a header, nor a button, nor one metric
 * with something in it.
 */
export function ResultsMetrics({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const columns = readOption(settings, 'columns', COLUMNS, '5')
  const align = readOption(settings, 'align', ALIGNMENTS, 'center')
  const theme = readOption(settings, 'theme', THEMES, 'inverted')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'default')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'stagger')
  const animateCounter = readBoolean(settings, 'animate', true)

  const preset = cardPreset(animation)
  const headerPreset = animation === 'stagger' ? 'fade' : preset

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const highlight = readString(section.data, 'heading_highlight')
  const footnote = readString(section.data, 'footnote')
  const cta = section.cta ?? null

  const metrics = useMemo(
    () => blocksOfType(section.blocks, 'metric').filter(hasContent),
    [section.blocks]
  )

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)

  if (!hasHeader && !cta && metrics.length === 0) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  const sectionHeadingLevel: HeadingLevel = index === 0 ? 'h1' : 'h2'
  const centered = align === 'center'

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      clip
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Results and metrics') })}
    >
      <div className="flex flex-col gap-fx-stack-xl">
        {hasHeader ? (
          <SectionHeader
            eyebrow={eyebrow}
            heading={headingNode}
            subheading={subheading}
            headingLevel={sectionHeadingLevel}
            headingSize={sectionHeadingLevel}
            align={centered ? 'center' : 'start'}
            preset={headerPreset}
            {...(centered ? {} : { className: 'max-w-3xl' })}
            {...(headingId ? { headingId } : {})}
          />
        ) : null}

        {metrics.length > 0 ? (
          <ul className={cn('grid grid-cols-1 gap-5', COLUMN_CLASSES[columns])}>
            {metrics.map((metric, position) => (
              <MetricCard
                key={metric.uuid}
                block={metric}
                index={position}
                preset={preset}
                animateCounter={animateCounter}
              />
            ))}
          </ul>
        ) : null}

        {footnote ? (
          <p
            className={cn(
              'text-fx-meta text-fx-ink-faint',
              centered && 'text-center'
            )}
          >
            {footnote}
          </p>
        ) : null}

        {cta ? (
          <Reveal
            preset={headerPreset}
            className={cn('flex', centered ? 'justify-center' : 'justify-start')}
          >
            <SectionCta
              cta={cta}
              size="lg"
              fallbackVariant="outline"
              buttonClassName={fxButton({ tone: 'outline', scale: 'lg' })}
            />
          </Reveal>
        ) : null}
      </div>
    </Section>
  )
}

export default ResultsMetrics
