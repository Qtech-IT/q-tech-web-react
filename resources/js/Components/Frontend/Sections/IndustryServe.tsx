import { useMemo } from 'react'
import { ArrowRight, Building2 } from 'lucide-react'

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
import {
  readBoolean,
  readOption,
  readString,
  trimmed,
} from '@/Components/Frontend/Sections/Shared/values'
import type { CmsSectionBlock } from '@/Types/cms'
import type { SectionComponentProps } from '@/Types/sections'

const COLUMNS = ['2', '3'] as const
const SIDES = ['right', 'left'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const
const ACCENTS = ['brand', 'ink', 'amber', 'teal', 'violet', 'rose'] as const

type Accent = (typeof ACCENTS)[number]

/**
 * The fallback hue order for a card with no `settings.accent`.
 *
 * Fifth section on this palette, fifth to cycle instead of defaulting — see
 * `ServiceGrid.ACCENT_CYCLE`. These cards sit in a tight two-column stack
 * where diagonal neighbours are as visible as horizontal ones, so the order
 * moves a long way round the wheel on each step rather than nudging.
 */
const ACCENT_CYCLE = ['teal', 'rose', 'brand', 'amber', 'violet', 'ink'] as const

function cycledAccent(index: number): Accent {
  return ACCENT_CYCLE[index % ACCENT_CYCLE.length] as Accent
}

/*
 * Static class maps, indexed by values `readOption` has already constrained.
 * Tailwind scans source text, so none of these may be built at runtime.
 */

const COLUMN_CLASSES = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 xl:grid-cols-3',
} as const

/**
 * The glyph itself, in the card's hue.
 *
 * No tile, unlike the two service sections — `service.grid` stamps a solid
 * one and `service.featured` floats a tinted one, so dropping the container
 * entirely is what keeps a third card section on the same palette from
 * reading as the same component again.
 *
 * A glyph is non-text content (WCAG 1.4.11, 3:1). Every hue in this palette
 * is tuned so white sits on it at 4.5:1, which means as INK on a near-white
 * surface it is darker still; the dark theme re-tunes the same hues upward
 * against a near-black surface. Both directions clear the bar with room.
 */
const GLYPH_CLASSES = {
  brand: 'text-fx-mark-brand',
  ink: 'text-fx-mark-ink',
  amber: 'text-fx-mark-amber',
  teal: 'text-fx-mark-teal',
  violet: 'text-fx-mark-violet',
  rose: 'text-fx-mark-rose',
} as const

/** The bloom behind the glyph. Blurred, so alpha does all the work. */
const GLOW_CLASSES = {
  brand: 'bg-fx-mark-brand/30',
  ink: 'bg-fx-mark-ink/20',
  amber: 'bg-fx-mark-amber/30',
  teal: 'bg-fx-mark-teal/30',
  violet: 'bg-fx-mark-violet/30',
  rose: 'bg-fx-mark-rose/30',
} as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

/** The quiet accent link above the button. */
const TEXT_LINK_CLASS = cn(
  'h-auto gap-2 whitespace-normal px-0 py-0 text-fx-body-sm font-medium text-fx-accent-text',
  'underline-offset-4 hover:underline',
  'transition-colors duration-200 ease-fx motion-reduce:transition-none'
)

/** The header and copy move as one unit while the cards stagger. */
function cardPreset(animation: (typeof ANIMATIONS)[number]) {
  return animation === 'rise' ? 'stagger' : animation
}

/** A repeater row worth rendering — has a title, a description, or both. */
function hasContent(block: CmsSectionBlock): boolean {
  return Boolean(trimmed(block.label) || trimmed(block.description))
}

/**
 * One industry card — glyph, name, one line.
 *
 * Small and centered on purpose: this stack is a texture that says "many
 * sectors", not a list to be compared row by row, so the card gives up the
 * tag pills, the metric and the read-more that the service sections carry.
 *
 * The hover response is border, shadow and the glyph's own lift. The card
 * never translates: it can carry a stretched link, and an element that both
 * owns the pointer target and moves under it makes `:hover` oscillate — the
 * pointer falls out of the moved box, the state drops, the box returns. Same
 * rule, same note, as the other three card sections.
 */
function IndustryCard({
  block,
  index,
  preset,
  offset,
  headingLevel,
}: {
  block: CmsSectionBlock
  index: number
  preset: 'none' | 'fade' | 'stagger'
  /** Whether this card takes the staggered column's drop. */
  offset: boolean
  headingLevel: 'h2' | 'h3'
}) {
  const { t } = useTranslations()

  const label = trimmed(block.label)
  const description = trimmed(block.description)
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
        /* The drop that turns two aligned columns into a staggered stack.
           Applied by position rather than by `nth-child` so it stays correct
           whatever the column count, and only from `sm` up — an offset in a
           single-column phone layout is just an inconsistent gap. */
        offset && 'sm:mt-10',
        'has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4',
        'has-[a:focus-visible]:outline-fx-focus has-[a:focus-visible]:rounded-fx-lg'
      )}
    >
      <div
        className={cn(
          'flex flex-1 flex-col items-center gap-3 rounded-fx-lg text-center',
          'border border-fx-line bg-fx-surface px-5 py-7 fx-raise-1',
          'transition-[border-color,box-shadow] duration-300 ease-fx',
          'group-hover:border-fx-accent-line group-hover:shadow-fx-3',
          'motion-reduce:transition-none'
        )}
      >
        <span aria-hidden="true" className="relative flex size-10 items-center justify-center">
          <span
            className={cn(
              'pointer-events-none absolute inset-0 rounded-full blur-lg',
              'opacity-60 transition-opacity duration-300 ease-fx group-hover:opacity-100',
              'motion-reduce:transition-none',
              GLOW_CLASSES[accent]
            )}
          />

          <span
            className={cn(
              'relative flex items-center justify-center',
              GLYPH_CLASSES[accent],
              'transition-transform duration-300 ease-fx group-hover:-translate-y-0.5 group-hover:scale-110',
              'motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:scale-100'
            )}
          >
            {media?.url ? (
              <SafeImage
                src={media.url}
                alt=""
                width={40}
                height={40}
                className="size-8 object-contain"
              />
            ) : isRegisteredNavIcon(block.icon ?? undefined) ? (
              <NavIcon name={block.icon ?? undefined} className="size-8" />
            ) : (
              <Building2 className="size-8" />
            )}
          </span>
        </span>

        {label ? (
          <Heading className="text-fx-body font-semibold text-balance text-fx-ink">
            {label}
          </Heading>
        ) : null}

        {description ? (
          <p className="text-fx-body-sm text-pretty text-fx-ink-soft">
            {description}
          </p>
        ) : null}

        {cta ? (
          /*
           * A VISIBLE affordance, not just a hit area.
           *
           * This was `sr-only`: the whole card was already a link and its
           * accessible name was correct, but nothing was painted — so a
           * sighted visitor had no way to know the card was clickable at all.
           * A hover shadow is not an affordance; it is only discoverable by
           * someone who already guessed.
           *
           * The label stays `sr-only` (it names the destination for a screen
           * reader — "Explore Healthcare") while the arrow is drawn, so the
           * accessible name is unchanged and the visual gains a cue. The card
           * remains ONE link with one name rather than growing a second
           * focusable target.
           */
          <span
            aria-hidden="true"
            className={cn(
              'mt-auto inline-flex items-center gap-1.5 pt-2',
              'text-fx-meta font-medium',
              GLYPH_CLASSES[accent],
              'transition-transform duration-300 ease-fx',
              'group-hover:translate-x-0.5',
              'motion-reduce:transition-none motion-reduce:group-hover:translate-x-0'
            )}
          >
            {t('Explore')}
            <ArrowRight className="size-3.5 rtl:rotate-180" />
          </span>
        ) : null}

        {cta ? (
          /* The hit area. `sr-only` on the button so only the accessible name
             survives; the stretched pseudo-element makes the whole card the
             target. Never `hidden` — that would remove it from the
             accessibility tree and leave the link with no name at all. */
          <SectionCta
            cta={cta}
            fallbackVariant="link"
            buttonClassName="h-auto p-0 sr-only"
            className="after:absolute after:inset-0 after:content-['']"
          />
        ) : null}
      </div>
    </Reveal>
  )
}

/**
 * The outlined word set vertically between the cards and the copy.
 *
 * Drawn with `-webkit-text-stroke` in a LINE token rather than as an image or
 * a low-opacity fill: it stays crisp at any size, it re-tunes with the theme
 * for free (the stroke is `--fx-line-strong`, which is a hairline colour in
 * light and an alpha-white in dark), and it costs nothing to translate.
 *
 * Large screens only, and `aria-hidden`. It is a graphic that happens to be
 * made of letters — repeating it to a screen reader would announce a stray
 * word between a heading and a list with no context, and hiding it costs a
 * sighted user nothing because the same word is in the heading beside it.
 */
function Watermark({ word }: { word: string }) {
  return (
    <div
      aria-hidden="true"
      className="hidden shrink-0 items-center justify-center lg:flex"
    >
      <span
        className={cn(
          'select-none [writing-mode:vertical-rl] rotate-180',
          'text-[clamp(3.5rem,6vw,6rem)] font-semibold uppercase tracking-[0.14em]',
          'text-transparent [-webkit-text-stroke:1px_var(--fx-line-strong)]'
        )}
      >
        {word}
      </span>
    </div>
  )
}

/**
 * Industries we serve — a staggered card stack beside a statement.
 *
 * COMPOSITION — a split, not a header-over-grid. On a large screen the cards
 * take seven columns and the copy five, with the outlined word standing
 * between them; `settings.content_side` swaps which side is which without
 * touching the DOM order, so the reading order stays heading-then-cards for
 * assistive technology whichever way it is laid out.
 *
 * RESPONSIVE — the phone layout inverts the desktop's priority: the copy
 * comes first (it is the argument, and a column of small cards with no
 * context above them is meaningless), then the cards run one per row. The
 * vertical word and the column stagger both belong to wide viewports only —
 * an offset with one column is just an uneven gap.
 *
 * COLOUR — each card takes a hue from the shared `--fx-mark-*` palette and
 * spends it on the glyph and the bloom behind it. Nothing else in the card is
 * saturated, so a dozen cards read as one texture rather than a fruit bowl,
 * and every text pairing stays on ink tokens. The palette is re-tuned per
 * theme in `frontend.css`, so this file carries no `dark:` class.
 *
 * HEADING ORDER — the section owns `h2` (or `h1` at position 0) and every
 * card title is exactly one level below it, so the outline never skips.
 *
 * Renders `null` when there is neither a heading, nor copy, nor a button, nor
 * one filled-in card.
 */
export function IndustryServe({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const columns = readOption(settings, 'columns', COLUMNS, '2')
  const contentSide = readOption(settings, 'content_side', SIDES, 'right')
  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'lg')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'stagger')
  const stagger = readBoolean(settings, 'offset', true)

  const preset = cardPreset(animation)
  const copyPreset = animation === 'stagger' ? 'fade' : preset

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const paragraph = trimmed(section.subheading)
  const highlight = readString(section.data, 'heading_highlight')
  const watermark = readString(section.data, 'watermark')
  const cta = section.cta ?? null
  const textLink = section.secondary_cta ?? null

  const industries = useMemo(
    () => blocksOfType(section.blocks, 'industry').filter(hasContent),
    [section.blocks]
  )

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const hasCopy = Boolean(eyebrow || heading || paragraph || cta || textLink)

  if (!hasCopy && industries.length === 0) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  const sectionHeadingLevel = index === 0 ? 'h1' : 'h2'
  const SectionHeading = sectionHeadingLevel
  /** One level below whatever the section itself rendered, never skipping. */
  const cardHeadingLevel: 'h2' | 'h3' =
    sectionHeadingLevel === 'h1' ? 'h2' : 'h3'
  /** Cards drop by column: every second one in a 2-up, every third in a 3-up. */
  const offsetEvery = columns === '3' ? 3 : 2

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Industries we serve') })}
    >
      <div
        className={cn(
          'flex flex-col gap-fx-stack-xl',
          /* DOM order is copy-then-cards so the heading is read first; the
             visual order is flipped at `lg`, where the cards lead. Never the
             other way round — a screen reader must not meet a list of sector
             names before the heading that explains them. */
          'lg:flex-row lg:items-center lg:gap-fx-stack-lg',
          contentSide === 'right' ? 'lg:flex-row-reverse' : 'lg:flex-row'
        )}
      >
        {hasCopy ? (
          <Reveal
            preset={copyPreset}
            className="flex flex-col gap-fx-stack-md lg:w-5/12 lg:shrink-0"
          >
            {eyebrow ? (
              <p className="flex items-center gap-3 text-fx-eyebrow uppercase text-fx-ink-faint">
                <span
                  aria-hidden="true"
                  className="h-px w-8 bg-[linear-gradient(to_right,var(--fx-accent),transparent)]"
                />
                {eyebrow}
              </p>
            ) : null}

            {headingNode ? (
              <SectionHeading
                {...(headingId ? { id: headingId } : {})}
                className="text-fx-heading text-balance text-fx-ink"
              >
                {headingNode}
              </SectionHeading>
            ) : null}

            {paragraph ? (
              <p className="text-fx-body text-pretty text-fx-ink-soft">
                {paragraph}
              </p>
            ) : null}

            {textLink ? (
              <SectionCta
                cta={textLink}
                fallbackVariant="link"
                buttonClassName={TEXT_LINK_CLASS}
                className="self-start"
              />
            ) : null}

            {cta ? (
              <div className="pt-2">
                <SectionCta
                  cta={cta}
                  size="lg"
                  fallbackVariant="default"
                  buttonClassName={cn(
                    fxButton({ tone: 'solid', scale: 'lg' }),
                    'rounded-fx-pill px-9'
                  )}
                />
              </div>
            ) : null}
          </Reveal>
        ) : null}

        {watermark ? <Watermark word={watermark} /> : null}

        {industries.length > 0 ? (
          <ul
            className={cn(
              'grid grid-cols-1 gap-5 lg:flex-1',
              COLUMN_CLASSES[columns]
            )}
          >
            {industries.map((industry, position) => (
              <IndustryCard
                key={industry.uuid}
                block={industry}
                index={position}
                preset={preset}
                offset={stagger && position % offsetEvery === 1}
                headingLevel={cardHeadingLevel}
              />
            ))}
          </ul>
        ) : null}
      </div>
    </Section>
  )
}

export default IndustryServe
