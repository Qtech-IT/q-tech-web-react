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
  readBoolean,
  readOption,
  readString,
  trimmed,
} from '@/Components/Frontend/Sections/Shared/values'
import type { CmsSectionBlock } from '@/Types/cms'
import type { SectionComponentProps } from '@/Types/sections'

const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const
const ACCENTS = ['brand', 'ink', 'amber', 'teal', 'violet', 'rose'] as const

type Accent = (typeof ACCENTS)[number]

/** Cycled by position when a card has no `settings.accent`, as everywhere. */
const ACCENT_CYCLE = ['amber', 'violet', 'rose', 'brand', 'teal', 'ink'] as const

function cycledAccent(index: number): Accent {
  return ACCENT_CYCLE[index % ACCENT_CYCLE.length] as Accent
}

/*
 * Static class maps, indexed by values `readOption` has already constrained.
 * Tailwind scans source text, so none of these may be built at runtime.
 */

/** The pastel panel inside the card. */
const PANEL_CLASSES = {
  brand: 'bg-fx-mark-brand/10',
  ink: 'bg-fx-mark-ink/8',
  amber: 'bg-fx-mark-amber/10',
  teal: 'bg-fx-mark-teal/10',
  violet: 'bg-fx-mark-violet/10',
  rose: 'bg-fx-mark-rose/10',
} as const

/** The glyph on that panel. Full-strength hue as ink: >= 3:1 in both themes. */
const GLYPH_CLASSES = {
  brand: 'text-fx-mark-brand',
  ink: 'text-fx-mark-ink',
  amber: 'text-fx-mark-amber',
  teal: 'text-fx-mark-teal',
  violet: 'text-fx-mark-violet',
  rose: 'text-fx-mark-rose',
} as const

/** The disc that floats above the card. */
const DISC_CLASSES = {
  brand: 'bg-fx-mark-brand',
  ink: 'bg-fx-mark-ink',
  amber: 'bg-fx-mark-amber',
  teal: 'bg-fx-mark-teal',
  violet: 'bg-fx-mark-violet',
  rose: 'bg-fx-mark-rose',
} as const

/**
 * The tilt, by position.
 *
 * Alternating rather than random: a random angle per card cannot be reasoned
 * about, changes on every render, and puts two cards on the same lean as
 * often as not. Two degrees is enough to read as "scattered" and small enough
 * that the copy inside stays comfortable to read.
 */
const TILT_CLASSES = ['lg:-rotate-2', 'lg:rotate-2'] as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

function cardPreset(animation: (typeof ANIMATIONS)[number]) {
  return animation === 'rise' ? 'stagger' : animation
}

/** A repeater row worth rendering — has a title, a description, or both. */
function hasContent(block: CmsSectionBlock): boolean {
  return Boolean(trimmed(block.label) || trimmed(block.description))
}

/**
 * The dashed curve that runs from one card into the next.
 *
 * A hand-drawn SVG path in the gutter, NOT a measured line between two boxes.
 * Joining real element positions would mean a resize observer, an absolute
 * overlay above the grid and a re-measure on every reflow — a lot of moving
 * parts for a decoration. This costs one `<svg>` per card: it starts at the
 * card's own edge, curves down across the gutter, and lands at the height the
 * staggered neighbour begins. The grid's geometry is fixed at `lg` (two
 * columns, every second card dropped), so the two always meet.
 *
 * Mirrored with `-scale-x-100` for the right-hand column, so one path serves
 * both directions: left card curves right-down, right card curves left-down.
 *
 * Drawn in `--fx-line-strong` — a hairline in light, an alpha-white in dark —
 * so it re-tunes with the theme like every other rule on the site. `lg:` only
 * and `aria-hidden`: on a stacked phone layout there is no gutter to cross,
 * and a decorative line has nothing to say to a screen reader.
 */
function Connector({ side }: { side: 'left' | 'right' }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 120"
      fill="none"
      preserveAspectRatio="none"
      className={cn(
        'pointer-events-none absolute top-[58%] hidden h-28 w-16 lg:block',
        side === 'left' ? 'left-full' : 'right-full -scale-x-100'
      )}
    >
      <path
        d="M0 6 C 34 6, 30 114, 64 114"
        stroke="var(--fx-line-strong)"
        strokeWidth="2"
        strokeDasharray="7 9"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/**
 * One reason — a floating disc, a tilted white card, and a tinted panel with
 * the icon, title and copy inside it.
 *
 * THE TILT — this card is allowed to rotate on hover (it straightens) where
 * every other card section in this codebase is not, and the difference is
 * that a reason card carries NO LINK. The hover-flicker rule is about hit
 * areas: an element that owns the pointer target and moves under it makes
 * `:hover` oscillate. With nothing to click there is no target to lose, so
 * the gesture is safe here and only here.
 *
 * The tilt is `lg:` only. On a phone the cards are full width and stacked, and
 * a rotated full-width card either overflows the gutter or has to be scaled
 * down to fit — both worse than simply sitting straight.
 */
function ReasonCard({
  block,
  index,
  preset,
  tilt,
  connected,
  headingLevel,
}: {
  block: CmsSectionBlock
  index: number
  preset: 'none' | 'fade' | 'stagger'
  tilt: boolean
  /** Whether a card follows this one for the dashed curve to run into. */
  connected: boolean
  headingLevel: 'h2' | 'h3'
}) {
  const label = trimmed(block.label)
  const description = trimmed(block.description)
  const accent = readOption(block.settings, 'accent', ACCENTS, cycledAccent(index))
  const media = block.media ?? null
  const Heading = headingLevel

  return (
    <Reveal
      as="li"
      preset={preset}
      index={index}
      className={cn(
        'group relative flex pt-8',
        /* The staircase: every second card drops, so the pair reads as
           scattered rather than as a row. `lg:` only, for the same reason the
           tilt is. */
        tilt && index % 2 === 1 && 'lg:mt-20'
      )}
    >
      {/* Rendered on the `li`, not inside the card, so the curve starts at the
          card's edge and crosses the gutter without being clipped by the
          card's own rounded corners. */}
      {connected ? (
        <Connector side={index % 2 === 0 ? 'left' : 'right'} />
      ) : null}

      <div
        className={cn(
          'relative flex flex-1 flex-col rounded-fx-2xl border border-fx-line bg-fx-surface',
          'p-4 shadow-fx-3 sm:p-5',
          'transition-[transform,box-shadow] duration-500 ease-fx',
          'hover:shadow-fx-4 lg:hover:rotate-0',
          'motion-reduce:transition-none motion-reduce:lg:hover:rotate-0',
          tilt && TILT_CLASSES[index % TILT_CLASSES.length]
        )}
      >
        {/* The disc. Two circles rather than one: the smaller offset copy
            behind the main one is what gives it the stacked, slightly
            three-dimensional look the flat fill alone cannot. Decorative, so
            it repeats nothing to a screen reader. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-7 left-1/2 flex size-14 -translate-x-1/2"
        >
          <span
            className={cn(
              'absolute inset-0 rounded-full opacity-60',
              '-translate-x-2 translate-y-1',
              DISC_CLASSES[accent]
            )}
          />
          <span
            className={cn(
              'absolute inset-0 rounded-full shadow-fx-2',
              'transition-transform duration-500 ease-fx group-hover:-translate-y-1',
              'motion-reduce:transition-none motion-reduce:group-hover:translate-y-0',
              DISC_CLASSES[accent]
            )}
          />
        </span>

        <div
          className={cn(
            'flex flex-1 flex-col gap-3 rounded-fx-xl p-5 pt-8 sm:p-6 sm:pt-9',
            PANEL_CLASSES[accent]
          )}
        >
          <span
            aria-hidden="true"
            className={cn('flex size-8 items-center justify-center', GLYPH_CLASSES[accent])}
          >
            {media?.url ? (
              <SafeImage
                src={media.url}
                alt=""
                width={32}
                height={32}
                className="size-7 object-contain"
              />
            ) : isRegisteredNavIcon(block.icon ?? undefined) ? (
              <NavIcon name={block.icon ?? undefined} className="size-7" />
            ) : (
              <Sparkles className="size-7" />
            )}
          </span>

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
        </div>
      </div>
    </Reveal>
  )
}

/**
 * Why choose us — a centered statement over a scattered set of reason cards.
 *
 * COMPOSITION — every other card section in the registry is an inventory; this
 * one is an argument, and nobody scans four reasons hunting for a particular
 * one. So the layout is loose on purpose: two columns, every second card
 * dropped, each card leaning a couple of degrees, and no list, link or metric
 * to invite comparison. `settings.tilt` turns the whole effect off for a page
 * that needs to stay sober, which leaves the same content as a plain grid.
 *
 * The reference this follows also runs dashed curves between the cards. They
 * are not reproduced here: connecting arbitrary boxes needs their measured
 * positions, which means a resize observer and absolute overlays for a purely
 * decorative line. The stagger and the tilt already carry the "scattered"
 * reading, so the cost was not worth paying.
 *
 * COLOUR — each card takes a hue from the shared `--fx-mark-*` palette and
 * spends it three ways: the floating disc, the pastel panel and the glyph.
 * Title and copy stay on ink tokens over a 10% wash, so every text pairing
 * holds AA. The palette re-tunes per theme in `frontend.css`, so this file
 * carries no `dark:` class — the pastel panels become deep tinted panels and
 * the discs brighten on their own.
 *
 * Renders `null` when there is neither a header, nor a button, nor one
 * filled-in card.
 */
export function WhyChoose({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'lg')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'stagger')
  const tilt = readBoolean(settings, 'tilt', true)

  const preset = cardPreset(animation)
  const headerPreset = animation === 'stagger' ? 'fade' : preset

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const highlight = readString(section.data, 'heading_highlight')
  const cta = section.cta ?? null

  const reasons = useMemo(
    () => blocksOfType(section.blocks, 'reason').filter(hasContent),
    [section.blocks]
  )

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)

  if (!hasHeader && !cta && reasons.length === 0) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  const sectionHeadingLevel: HeadingLevel = index === 0 ? 'h1' : 'h2'
  const cardHeadingLevel: 'h2' | 'h3' = heading
    ? sectionHeadingLevel === 'h1'
      ? 'h2'
      : 'h3'
    : 'h2'

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Why choose us') })}
    >
      <div className="flex flex-col gap-fx-stack-xl">
        {hasHeader ? (
          <SectionHeader
            eyebrow={eyebrow}
            heading={headingNode}
            subheading={subheading}
            headingLevel={sectionHeadingLevel}
            headingSize={sectionHeadingLevel}
            align="center"
            preset={headerPreset}
            {...(headingId ? { headingId } : {})}
          />
        ) : null}

        {reasons.length > 0 ? (
          <ul
            className={cn(
              /* Two columns at most: the cards lean and overlap their own
                 gutters, and three of them across a page is a pile rather
                 than a composition. The generous gap is what keeps the tilt
                 from reading as a collision. */
              /* The x-gap is the canvas the connectors are drawn on, so it
                 is wider than a normal card gutter would be.

                 The y-gap TIGHTENS at `lg` rather than growing, which looks
                 wrong written down and is right on screen: every second card
                 already carries an 80px drop, so a generous row gap on top of
                 that breaks the cascade into separate rows. Closing it up is
                 what lets one row's left card sit alongside the previous
                 row's right card and read as a single descending zig-zag. */
              'mx-auto grid w-full max-w-5xl grid-cols-1 gap-x-10 gap-y-14 md:grid-cols-2 lg:gap-x-16 lg:gap-y-6',
              /* Without the tilt the staircase goes too, so the row closes up
                 to an ordinary grid rhythm. */
              !tilt && 'gap-y-10'
            )}
          >
            {reasons.map((reason, position) => (
              <ReasonCard
                key={reason.uuid}
                block={reason}
                index={position}
                preset={preset}
                tilt={tilt}
                /* No curve after the last card — a line running off into
                   nothing reads as a rendering bug, not as a flourish. And
                   none at all when the tilt is off: the dashes belong to the
                   scattered composition, so the sober variant drops both. */
                connected={tilt && position < reasons.length - 1}
                headingLevel={cardHeadingLevel}
              />
            ))}
          </ul>
        ) : null}

        {cta ? (
          <Reveal preset={headerPreset} className="flex justify-center">
            <SectionCta
              cta={cta}
              size="lg"
              fallbackVariant="default"
              buttonClassName={cn(
                fxButton({ tone: 'solid', scale: 'lg' }),
                'rounded-fx-pill px-9'
              )}
            />
          </Reveal>
        ) : null}
      </div>
    </Section>
  )
}

export default WhyChoose
