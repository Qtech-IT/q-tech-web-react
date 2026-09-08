import { useMemo } from 'react'
import { Sparkles } from 'lucide-react'

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

const COLUMNS = ['2', '3', '4'] as const
const ALIGNMENTS = ['center', 'start'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const
const ACCENTS = ['brand', 'ink', 'amber', 'teal', 'violet', 'rose'] as const

type Accent = (typeof ACCENTS)[number]

/**
 * The fallback hue order for a card with no `settings.accent`.
 *
 * Fourth section to share this palette, and the fourth to cycle rather than
 * default to one colour — see `ServiceGrid.ACCENT_CYCLE` for the reasoning.
 * The order opens warm and alternates temperature so that a four-up row never
 * puts two neighbouring hues side by side.
 */
const ACCENT_CYCLE = ['rose', 'teal', 'brand', 'amber', 'violet', 'ink'] as const

function cycledAccent(index: number): Accent {
  return ACCENT_CYCLE[index % ACCENT_CYCLE.length] as Accent
}

/*
 * Static class maps, indexed by values `readOption` has already constrained.
 * Tailwind scans source text, so none of these may be assembled at runtime.
 */

const COLUMN_CLASSES = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
} as const

/**
 * The floating mark: a wash of the hue with the hue itself as the glyph.
 *
 * Deliberately NOT `ServiceGrid`'s solid fill. Both sections draw on the same
 * `--fx-mark-*` palette, but this one spends it as a tint so the two read as
 * one family without looking like the same component twice on one site — and
 * because a mark that floats off the card needs to feel light rather than
 * stamped on.
 *
 * The glyph is the full-strength hue on a 12% wash of itself, which clears
 * 3:1 (non-text contrast, WCAG 1.4.11) in both themes: the palette's light
 * values are tuned for white to sit ON them, so as INK on a near-white
 * surface they are darker still, and the dark theme re-tunes them upward
 * against a near-black surface.
 */
const MARK_CLASSES = {
  brand: 'bg-fx-mark-brand/12 text-fx-mark-brand',
  ink: 'bg-fx-mark-ink/12 text-fx-mark-ink',
  amber: 'bg-fx-mark-amber/12 text-fx-mark-amber',
  teal: 'bg-fx-mark-teal/12 text-fx-mark-teal',
  violet: 'bg-fx-mark-violet/12 text-fx-mark-violet',
  rose: 'bg-fx-mark-rose/12 text-fx-mark-rose',
} as const

/** The soft bloom under the mark, which is what makes it read as floating. */
const GLOW_CLASSES = {
  brand: 'bg-fx-mark-brand/35',
  ink: 'bg-fx-mark-ink/25',
  amber: 'bg-fx-mark-amber/35',
  teal: 'bg-fx-mark-teal/35',
  violet: 'bg-fx-mark-violet/35',
  rose: 'bg-fx-mark-rose/35',
} as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

/**
 * The card's own "read more" link. Inline text with an arrow that travels on
 * hover of the WHOLE card, because the whole card is the hit area.
 */
const READ_MORE_CLASS = cn(
  'h-auto gap-2 whitespace-normal px-0 py-0 text-fx-label font-medium text-fx-ink',
  'underline-offset-4 group-hover:text-fx-accent-text',
  '[&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-fx',
  'group-hover:[&_svg]:translate-x-1',
  'transition-colors duration-200 ease-fx',
  'motion-reduce:transition-none motion-reduce:group-hover:[&_svg]:translate-x-0'
)

/** The header rises as one unit while the cards stagger. */
function cardPreset(animation: (typeof ANIMATIONS)[number]) {
  return animation === 'rise' ? 'stagger' : animation
}

/** A repeater row worth rendering — has a title, a description, or both. */
function hasContent(block: CmsSectionBlock): boolean {
  return Boolean(trimmed(block.label) || trimmed(block.description))
}

/**
 * One service card.
 *
 * THE MARK — sits OUTSIDE the card's top-left corner and overlaps it, which is
 * the whole signature of this composition: it turns a rectangle into something
 * with a foreground, and it gives each card an object the eye can catch before
 * it reads a word. It is absolutely positioned against the card, so it costs
 * no layout; the card simply reserves head room with its top padding, and the
 * `li` — not the card — is the positioning context, so the mark can hang past
 * the card edge without a clipped corner.
 *
 * THE HOVER — border, shadow and the mark's own lift. Nothing that owns hit
 * area moves: the card carries a stretched link, and an element that both
 * owns the pointer target and translates under it makes `:hover` oscillate —
 * the pointer falls out of the moved box, the state drops, the box returns.
 * (`ServiceGrid` and `PortfolioGrid` carry the same note; it is the one
 * hover rule this codebase has learned the hard way.)
 */
function ServiceCard({
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
        'group relative flex pt-7',
        'has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4',
        'has-[a:focus-visible]:outline-fx-focus has-[a:focus-visible]:rounded-fx-xl'
      )}
    >
      {/* The mark. Rendered before the card so the card's own background can
          never paint over the bloom, and `aria-hidden` because it repeats the
          title's meaning rather than adding to it. */}
      <div aria-hidden="true" className="absolute top-0 left-5 z-10 sm:left-6">
        <span
          className={cn(
            'pointer-events-none absolute -inset-2 rounded-fx-xl blur-lg',
            'opacity-70 transition-opacity duration-300 ease-fx group-hover:opacity-100',
            'motion-reduce:transition-none',
            GLOW_CLASSES[accent]
          )}
        />

        <span
          className={cn(
            'relative flex size-14 items-center justify-center rounded-fx-lg',
            'border border-fx-line bg-fx-surface fx-raise-1',
            'transition-transform duration-300 ease-fx',
            'group-hover:-translate-y-1 group-hover:scale-105',
            'motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:scale-100'
          )}
        >
          {/* The wash and the glyph share one element so the tint can never
              drift out of register with the icon inside it. */}
          <span
            className={cn(
              'flex size-full items-center justify-center rounded-fx-lg',
              MARK_CLASSES[accent]
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
              <Sparkles className="size-6" />
            )}
          </span>
        </span>
      </div>

      <div
        className={cn(
          'flex flex-1 flex-col gap-3 rounded-fx-xl border border-fx-line bg-fx-surface',
          'px-6 pt-12 pb-6 fx-raise-1',
          'transition-[border-color,box-shadow] duration-300 ease-fx',
          'group-hover:border-fx-accent-line group-hover:shadow-fx-3',
          'motion-reduce:transition-none'
        )}
      >
        {label ? (
          <Heading className="text-fx-subheading font-semibold text-balance text-fx-ink">
            {label}
          </Heading>
        ) : null}

        {description ? (
          <p className="text-fx-body-sm text-pretty text-fx-ink-soft">
            {description}
          </p>
        ) : null}

        {cta ? (
          <div className="mt-auto pt-5">
            <SectionCta
              cta={cta}
              fallbackVariant="link"
              buttonClassName={READ_MORE_CLASS}
              // Stretches the anchor over the whole card. The `li` is the
              // nearest positioned ancestor and it never moves, so the hit
              // area is stable however the card's contents animate.
              className="after:absolute after:inset-0 after:content-['']"
            />
          </div>
        ) : null}
      </div>
    </Reveal>
  )
}

/**
 * Featured services — a centered statement, a row of cards with floating icon
 * marks, and one button.
 *
 * COMPOSITION — this is the persuasive cousin of `service.grid`. Four cards
 * rather than a catalogue, centered rather than left-aligned, each card ending
 * in its own "read more" and the section ending in a single button. The
 * headline can emphasise one word (`data.heading_highlight`), drawn with the
 * same swash `HeroSplit` uses, which is what gives the band its title-card
 * quality without a second font or a second colour.
 *
 * RESPONSIVE — one column on a phone (each card full width, mark still
 * hanging off its corner), two from `sm`, and the editor's column count from
 * `lg`. The marks never overlap a neighbouring card because each one is
 * positioned against its own `li`, not against the row.
 *
 * COLOUR — each card takes a hue from the shared `--fx-mark-*` palette (its
 * own `settings.accent`, else its position in `ACCENT_CYCLE`) and spends it on
 * the mark's wash, its glyph and its bloom. Body copy and the read-more link
 * stay on ink tokens, so the row is colourful at a glance and every text
 * pairing is still AA. The palette is re-tuned per theme in `frontend.css`, so
 * this file carries no `dark:` class.
 *
 * HEADING ORDER — a card title sits one level below whatever heading actually
 * rendered above it, falling back to `h2` when an editor cleared the section
 * heading but kept the cards.
 *
 * Renders `null` when there is neither a header, nor a button, nor one
 * filled-in card.
 */
export function ServiceFeature({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const columns = readOption(settings, 'columns', COLUMNS, '4')
  const align = readOption(settings, 'align', ALIGNMENTS, 'center')
  const theme = readOption(settings, 'theme', THEMES, 'subtle')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'lg')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'stagger')

  const preset = cardPreset(animation)
  const headerPreset = animation === 'stagger' ? 'fade' : preset

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const highlight = readString(section.data, 'heading_highlight')
  const cta = section.cta ?? null

  const services = useMemo(
    () => blocksOfType(section.blocks, 'service').filter(hasContent),
    [section.blocks]
  )

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)

  if (!hasHeader && !cta && services.length === 0) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  /** Position 0 owns the page's single `h1`; every other section starts at `h2`. */
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
        : { 'aria-label': t('Our services') })}
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

        {services.length > 0 ? (
          <ul
            className={cn(
              /* `gap-y` is larger than `gap-x` on purpose: each mark hangs
                 above its own card, so a wrapped row needs head room that a
                 single symmetric gap would either starve or waste. */
              'grid grid-cols-1 gap-x-6 gap-y-12',
              COLUMN_CLASSES[columns]
            )}
          >
            {services.map((service, position) => (
              <ServiceCard
                key={service.uuid}
                block={service}
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

export default ServiceFeature
