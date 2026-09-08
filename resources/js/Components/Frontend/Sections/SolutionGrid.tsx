import { useMemo } from 'react'
import { Check, Rocket } from 'lucide-react'

import { NavIcon, isRegisteredNavIcon } from '@/Components/Public/NavIcon'
import { Section } from '@/Components/Public/Section'
import { fxButton } from '@/Components/Public/fxButton'
import { SafeImage } from '@/Components/UI/SafeImage'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import { blocksOfType } from '@/Components/Frontend/Sections/Shared/blocks'
import { highlightHeading } from '@/Components/Frontend/Sections/Shared/highlight'
import { Reveal } from '@/Components/Frontend/Sections/Shared/Reveal'
import { SectionCta } from '@/Components/Frontend/Sections/Shared/SectionCta'
import { SectionHeader } from '@/Components/Frontend/Sections/Shared/SectionHeader'
import type { HeadingLevel } from '@/Components/Frontend/Sections/Shared/SectionHeader'
import {
  readOption,
  readString,
  trimmed,
} from '@/Components/Frontend/Sections/Shared/values'
import type { CmsSectionBlock } from '@/Types/cms'
import type { SectionComponentProps } from '@/Types/sections'

const COLUMNS = ['2', '3'] as const
const ALIGNMENTS = ['center', 'start'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const
const ACCENTS = ['brand', 'ink', 'amber', 'teal', 'violet', 'rose'] as const

type Accent = (typeof ACCENTS)[number]

/** Cycled by position when a card has no `settings.accent`, as everywhere. */
const ACCENT_CYCLE = ['brand', 'violet', 'amber', 'teal', 'rose', 'ink'] as const

function cycledAccent(index: number): Accent {
  return ACCENT_CYCLE[index % ACCENT_CYCLE.length] as Accent
}

const COLUMN_CLASSES = {
  '2': 'md:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
} as const

/** The wash across the head of the card, behind the icon and title. */
const WASH_CLASSES = {
  brand: 'from-fx-mark-brand/14',
  ink: 'from-fx-mark-ink/10',
  amber: 'from-fx-mark-amber/14',
  teal: 'from-fx-mark-teal/14',
  violet: 'from-fx-mark-violet/14',
  rose: 'from-fx-mark-rose/14',
} as const

/**
 * The icon ring and the tick glyphs.
 *
 * A ring rather than a filled tile: `service.grid` fills, `service.featured`
 * tints a floating tile, `industry.serve` uses a bare glyph — a fourth card
 * section on one palette needs its own shape or the site starts repeating
 * itself. Full-strength hue as ink on a near-white (or near-black) surface,
 * which clears 3:1 for non-text content in both themes.
 */
const RING_CLASSES = {
  brand: 'border-fx-mark-brand/35 text-fx-mark-brand',
  ink: 'border-fx-mark-ink/35 text-fx-mark-ink',
  amber: 'border-fx-mark-amber/35 text-fx-mark-amber',
  teal: 'border-fx-mark-teal/35 text-fx-mark-teal',
  violet: 'border-fx-mark-violet/35 text-fx-mark-violet',
  rose: 'border-fx-mark-rose/35 text-fx-mark-rose',
} as const

/** The tick glyphs. Just the ink — a border class on an `svg` is noise. */
const TICK_CLASSES = {
  brand: 'text-fx-mark-brand',
  ink: 'text-fx-mark-ink',
  amber: 'text-fx-mark-amber',
  teal: 'text-fx-mark-teal',
  violet: 'text-fx-mark-violet',
  rose: 'text-fx-mark-rose',
} as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

const CARD_LINK_CLASS = cn(
  'h-auto gap-2 whitespace-normal px-0 py-0 text-fx-label font-medium text-fx-ink',
  'underline-offset-4 group-hover:text-fx-accent-text',
  '[&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-fx',
  'group-hover:[&_svg]:translate-x-1',
  'transition-colors duration-200 ease-fx',
  'motion-reduce:transition-none motion-reduce:group-hover:[&_svg]:translate-x-0'
)

function cardPreset(animation: (typeof ANIMATIONS)[number]) {
  return animation === 'rise' ? 'stagger' : animation
}

/** `data.points`, split into bullets. Commas only, trimmed, empties dropped. */
function pointsOf(block: CmsSectionBlock): string[] {
  const raw = readString(block.data, 'points')

  if (!raw) {
    return []
  }

  return raw
    .split(',')
    .map((point) => point.trim())
    .filter((point) => point !== '')
}

/** A repeater row worth rendering — has a title, a summary, or both. */
function hasContent(block: CmsSectionBlock): boolean {
  return Boolean(trimmed(block.label) || trimmed(block.description))
}

/**
 * One solution card — icon ring, title, summary, and what is included.
 *
 * The tick list is the reason this card exists: a visitor deciding between
 * packaged offers is scanning for what they get, and three ticked lines do
 * that faster than a paragraph. Everything above the list is context for it.
 *
 * The card never translates on hover — it can carry a stretched link, and an
 * element that both owns the pointer target and moves under it makes
 * `:hover` oscillate. Same rule as the other card sections.
 */
function SolutionCard({
  block,
  index,
  preset,
  headingLevel,
}: {
  block: CmsSectionBlock
  index: number
  preset: 'none' | 'fade' | 'stagger'
  headingLevel: 'h2' | 'h3'
}) {
  const label = trimmed(block.label)
  const description = trimmed(block.description)
  const points = useMemo(() => pointsOf(block), [block])
  const accent = readOption(block.settings, 'accent', ACCENTS, cycledAccent(index))
  const media = block.media ?? null
  const cta = block.cta ?? null
  const Heading = headingLevel

  return (
    <Reveal
      as="li"
      preset={preset}
      index={index}
      className={cn(
        'group relative flex',
        'has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4',
        'has-[a:focus-visible]:outline-fx-focus has-[a:focus-visible]:rounded-fx-xl'
      )}
    >
      <div
        className={cn(
          'relative flex flex-1 flex-col gap-4 overflow-hidden rounded-fx-xl',
          'border border-fx-line bg-fx-surface p-6 sm:p-7 fx-raise-1',
          'transition-[border-color,box-shadow] duration-300 ease-fx',
          'group-hover:border-fx-accent-line group-hover:shadow-fx-3',
          'motion-reduce:transition-none'
        )}
      >
        {/* Colour gathers at the head of the card and lets go before the
            list, so the ticks are read as content rather than as decoration. */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b to-transparent',
            WASH_CLASSES[accent]
          )}
        />

        <span
          aria-hidden="true"
          className={cn(
            'relative flex size-12 items-center justify-center rounded-full border bg-fx-surface',
            RING_CLASSES[accent],
            'transition-transform duration-300 ease-fx group-hover:scale-105',
            'motion-reduce:transition-none motion-reduce:group-hover:scale-100'
          )}
        >
          {media?.url ? (
            <SafeImage
              src={media.url}
              alt=""
              width={32}
              height={32}
              className="size-6 object-contain"
            />
          ) : isRegisteredNavIcon(block.icon ?? undefined) ? (
            <NavIcon name={block.icon ?? undefined} className="size-6" />
          ) : (
            <Rocket className="size-6" />
          )}
        </span>

        {label ? (
          <Heading className="relative text-fx-subheading font-semibold text-balance text-fx-ink">
            {label}
          </Heading>
        ) : null}

        {description ? (
          <p className="relative text-fx-body-sm text-pretty text-fx-ink-soft">
            {description}
          </p>
        ) : null}

        {points.length > 0 ? (
          <ul className="relative flex flex-col gap-2 pt-1">
            {points.map((point, position) => (
              <li
                key={`${point}-${position}`}
                className="flex items-start gap-2.5 text-fx-body-sm text-fx-ink"
              >
                <Check
                  aria-hidden="true"
                  className={cn('mt-0.5 size-4 shrink-0', TICK_CLASSES[accent])}
                />
                <span>{point}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {cta ? (
          <div className="relative mt-auto pt-4">
            <SectionCta
              cta={cta}
              fallbackVariant="link"
              buttonClassName={CARD_LINK_CLASS}
              className="after:absolute after:inset-0 after:content-['']"
            />
          </div>
        ) : null}
      </div>
    </Reveal>
  )
}

/**
 * Solutions — packaged offers, each with a short list of what is included.
 *
 * A service is a discipline; a solution is something a visitor can buy. This
 * section is the second kind, which is why the card carries a tick list and
 * the service sections do not.
 *
 * COLOUR — each card takes a hue from the shared `--fx-mark-*` palette and
 * spends it on a wash at the head of the card, the icon ring and the ticks.
 * Body copy stays on ink tokens, so the grid is colourful and every text
 * pairing is still AA. The palette re-tunes per theme in `frontend.css`, so
 * there is no `dark:` class here.
 *
 * Renders `null` when there is neither a header, nor a button, nor one
 * filled-in card.
 */
export function SolutionGrid({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const columns = readOption(settings, 'columns', COLUMNS, '3')
  const align = readOption(settings, 'align', ALIGNMENTS, 'center')
  const theme = readOption(settings, 'theme', THEMES, 'subtle')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'default')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'stagger')

  const preset = cardPreset(animation)
  const headerPreset = animation === 'stagger' ? 'fade' : preset

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const highlight = readString(section.data, 'heading_highlight')
  const cta = section.cta ?? null

  const solutions = useMemo(
    () => blocksOfType(section.blocks, 'solution').filter(hasContent),
    [section.blocks]
  )

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)

  if (!hasHeader && !cta && solutions.length === 0) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  const sectionHeadingLevel: HeadingLevel = index === 0 ? 'h1' : 'h2'
  const cardHeadingLevel: 'h2' | 'h3' = heading
    ? sectionHeadingLevel === 'h1'
      ? 'h2'
      : 'h3'
    : 'h2'
  const centered = align === 'center'

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Solutions') })}
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

        {solutions.length > 0 ? (
          <ul className={cn('grid grid-cols-1 gap-5', COLUMN_CLASSES[columns])}>
            {solutions.map((solution, position) => (
              <SolutionCard
                key={solution.uuid}
                block={solution}
                index={position}
                preset={preset}
                headingLevel={cardHeadingLevel}
              />
            ))}
          </ul>
        ) : null}

        {cta ? (
          <Reveal
            preset={headerPreset}
            className={cn('flex', centered ? 'justify-center' : 'justify-start')}
          >
            <SectionCta
              cta={cta}
              size="lg"
              fallbackVariant="default"
              buttonClassName={fxButton({ tone: 'solid', scale: 'lg' })}
            />
          </Reveal>
        ) : null}
      </div>
    </Section>
  )
}

export default SolutionGrid
