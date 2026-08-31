import { useMemo } from 'react'
import { Sparkles } from 'lucide-react'

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
import {
  readBoolean,
  readOption,
  readString,
  trimmed,
} from '@/Components/Frontend/Sections/Shared/values'
import type { CmsSectionBlock } from '@/Types/cms'
import type { SectionComponentProps } from '@/Types/sections'

const LAYOUTS = ['grid', 'bento'] as const
const COLUMNS = ['2', '3'] as const
const ALIGNMENTS = ['center', 'start'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const
const ACCENTS = ['brand', 'ink', 'amber', 'teal', 'violet', 'rose'] as const

type Accent = (typeof ACCENTS)[number]

/**
 * Cycled by position when a card has no `settings.accent`.
 *
 * Violet and teal lead because this band is the site's one saturated moment
 * and those two are the furthest from the neutral brand ink — an editor who
 * sets nothing still gets a section that reads as "AI" rather than as another
 * grey card grid.
 */
const ACCENT_CYCLE = ['violet', 'teal', 'brand', 'rose', 'amber', 'ink'] as const

function cycledAccent(index: number): Accent {
  return ACCENT_CYCLE[index % ACCENT_CYCLE.length] as Accent
}

/*
 * Static class maps, indexed by values `readOption` has already constrained.
 * Tailwind compiles by scanning source text, so none of these may be built at
 * runtime — `bg-fx-mark-${accent}` is a class that exists in the DOM and in no
 * stylesheet.
 */

/** The icon tile: a gradient in the card's hue, glyph knocked out of it. */
const TILE_CLASSES = {
  brand: 'bg-gradient-to-br from-fx-mark-brand to-fx-mark-brand/70 text-fx-mark-brand-glyph',
  ink: 'bg-gradient-to-br from-fx-mark-ink to-fx-mark-ink/70 text-fx-mark-ink-glyph',
  amber: 'bg-gradient-to-br from-fx-mark-amber to-fx-mark-amber/70 text-fx-mark-glyph',
  teal: 'bg-gradient-to-br from-fx-mark-teal to-fx-mark-teal/70 text-fx-mark-glyph',
  violet: 'bg-gradient-to-br from-fx-mark-violet to-fx-mark-violet/70 text-fx-mark-glyph',
  rose: 'bg-gradient-to-br from-fx-mark-rose to-fx-mark-rose/70 text-fx-mark-glyph',
} as const

/**
 * The wash that blooms from the card's top-left corner on hover.
 *
 * A radial gradient on a pseudo-layer rather than a `box-shadow` glow: a
 * shadow in a saturated hue bleeds outside the card and stacks with the
 * neighbour's, which at three-across turns the grid into a smear.
 */
const BLOOM_CLASSES = {
  brand: 'bg-[radial-gradient(70%_60%_at_0%_0%,var(--fx-mark-brand),transparent_70%)]',
  ink: 'bg-[radial-gradient(70%_60%_at_0%_0%,var(--fx-mark-ink),transparent_70%)]',
  amber: 'bg-[radial-gradient(70%_60%_at_0%_0%,var(--fx-mark-amber),transparent_70%)]',
  teal: 'bg-[radial-gradient(70%_60%_at_0%_0%,var(--fx-mark-teal),transparent_70%)]',
  violet: 'bg-[radial-gradient(70%_60%_at_0%_0%,var(--fx-mark-violet),transparent_70%)]',
  rose: 'bg-[radial-gradient(70%_60%_at_0%_0%,var(--fx-mark-rose),transparent_70%)]',
} as const

/** The outcome chip. Hue as ink on a wash of itself — never a filled block. */
const CHIP_CLASSES = {
  brand: 'bg-fx-mark-brand/12 text-fx-mark-brand',
  ink: 'bg-fx-mark-ink/10 text-fx-mark-ink',
  amber: 'bg-fx-mark-amber/12 text-fx-mark-amber',
  teal: 'bg-fx-mark-teal/12 text-fx-mark-teal',
  violet: 'bg-fx-mark-violet/12 text-fx-mark-violet',
  rose: 'bg-fx-mark-rose/12 text-fx-mark-rose',
} as const

/**
 * The stack pills.
 *
 * Hue on the BORDER, label on ink — the same call `TechStack` makes: a pill is
 * text, and tinting six tool names per card would put the whole list on a
 * borderline contrast ratio to decorate something the border already groups.
 */
const PILL_CLASSES = {
  brand: 'border-fx-mark-brand/30 hover:border-fx-mark-brand/60',
  ink: 'border-fx-mark-ink/25 hover:border-fx-mark-ink/50',
  amber: 'border-fx-mark-amber/30 hover:border-fx-mark-amber/60',
  teal: 'border-fx-mark-teal/30 hover:border-fx-mark-teal/60',
  violet: 'border-fx-mark-violet/30 hover:border-fx-mark-violet/60',
  rose: 'border-fx-mark-rose/30 hover:border-fx-mark-rose/60',
} as const

/** The card's link, in its own hue. */
const LINK_CLASSES = {
  brand: 'text-fx-mark-brand',
  ink: 'text-fx-mark-ink',
  amber: 'text-fx-mark-amber',
  teal: 'text-fx-mark-teal',
  violet: 'text-fx-mark-violet',
  rose: 'text-fx-mark-rose',
} as const

const GRID_CLASSES = {
  '2': 'md:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
} as const

/** Where the bento's first card gets its extra column from. */
const FEATURE_SPAN_CLASSES = {
  '2': 'md:col-span-2',
  '3': 'sm:col-span-2',
} as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

function cardPreset(animation: (typeof ANIMATIONS)[number]) {
  return animation === 'rise' ? 'stagger' : animation
}

/** `data.items`, split into pills. Commas only, trimmed, empties dropped. */
function itemsOf(block: CmsSectionBlock): string[] {
  const raw = readString(block.data, 'items')

  if (!raw) {
    return []
  }

  return raw
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item !== '')
}

/** A row worth rendering — has a title, a description, or a stack. */
function hasContent(block: CmsSectionBlock): boolean {
  return Boolean(
    trimmed(block.label) || trimmed(block.description) || itemsOf(block).length > 0
  )
}

/**
 * One AI capability.
 *
 * The card is a plain container even when it has a link: the hit area is the
 * visible "Learn more" row, stretched over the card with an `after` pseudo-
 * element. Wrapping the whole card in an `<a>` instead would swallow the pills
 * into the link's accessible name and read out six tool names before the
 * destination.
 */
function CapabilityCard({
  block,
  index,
  featureSpan,
  preset,
  headingLevel,
}: {
  block: CmsSectionBlock
  index: number
  /** The double-width class for this grid, or `undefined` for a normal cell. */
  featureSpan: string | undefined
  preset: 'none' | 'fade' | 'stagger'
  headingLevel: 'h2' | 'h3'
}) {
  const label = trimmed(block.label)
  const description = trimmed(block.description)
  const outcome = trimmed(block.value)
  const items = useMemo(() => itemsOf(block), [block])
  const accent = readOption(block.settings, 'accent', ACCENTS, cycledAccent(index))
  const cta = block.cta ?? null
  const Heading = headingLevel

  return (
    <Reveal
      as="li"
      preset={preset}
      index={index}
      className={cn('flex', featureSpan)}
    >
      <div
        className={cn(
          'group/card relative isolate flex flex-1 flex-col gap-4 overflow-hidden',
          'rounded-fx-xl border border-fx-line bg-fx-surface p-6 fx-raise-1',
          featureSpan && 'sm:p-8',
          'transition-[border-color,box-shadow,transform] duration-300 ease-fx',
          'hover:-translate-y-1 hover:border-fx-accent-line hover:shadow-fx-3',
          'has-[a:focus-visible]:border-fx-accent-line',
          'motion-reduce:transition-none motion-reduce:hover:translate-y-0'
        )}
      >
        {/* Decorative bloom. Opacity only, so it costs no layout and cannot
            shift anything when it fades in. */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 -z-10 opacity-0',
            'transition-opacity duration-500 ease-fx',
            'group-hover/card:opacity-[0.10] group-has-[a:focus-visible]/card:opacity-[0.10]',
            'motion-reduce:transition-none',
            BLOOM_CLASSES[accent]
          )}
        />

        <div className="flex items-start justify-between gap-4">
          <span
            aria-hidden="true"
            className={cn(
              'flex size-12 shrink-0 items-center justify-center rounded-fx-md shadow-fx-1',
              'transition-transform duration-300 ease-fx',
              'group-hover/card:-rotate-6 group-hover/card:scale-105',
              'motion-reduce:transition-none motion-reduce:group-hover/card:rotate-0',
              'motion-reduce:group-hover/card:scale-100',
              TILE_CLASSES[accent]
            )}
          >
            {isRegisteredNavIcon(block.icon ?? undefined) ? (
              <NavIcon name={block.icon ?? undefined} className="size-6" />
            ) : (
              <Sparkles className="size-6" />
            )}
          </span>

          {outcome ? (
            <span
              className={cn(
                'rounded-fx-pill px-3 py-1 text-fx-meta font-semibold',
                CHIP_CLASSES[accent]
              )}
            >
              {outcome}
            </span>
          ) : null}
        </div>

        <div className="flex flex-col gap-2">
          {label ? (
            <Heading
              className={cn(
                'font-semibold text-balance text-fx-ink',
                featureSpan ? 'text-fx-subheading' : 'text-fx-body'
              )}
            >
              {label}
            </Heading>
          ) : null}

          {description ? (
            <p className="text-fx-body-sm text-pretty text-fx-ink-soft">
              {description}
            </p>
          ) : null}
        </div>

        {items.length > 0 ? (
          <ul className="mt-auto flex flex-wrap gap-2 pt-2">
            {items.map((item, position) => (
              <li
                key={`${item}-${position}`}
                className={cn(
                  'rounded-fx-pill border bg-fx-surface-2 px-3 py-1',
                  'text-fx-body-sm font-medium text-fx-ink',
                  'transition-colors duration-200 ease-fx motion-reduce:transition-none',
                  PILL_CLASSES[accent]
                )}
              >
                {item}
              </li>
            ))}
          </ul>
        ) : null}

        {cta ? (
          <SectionCta
            cta={cta}
            fallbackVariant="link"
            size="sm"
            buttonClassName={cn(
              fxButton({ tone: 'ghost', scale: 'sm' }),
              'h-auto self-start bg-transparent px-0 hover:bg-transparent',
              LINK_CLASSES[accent],
              '[&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-fx',
              'hover:[&_svg]:translate-x-1 motion-reduce:hover:[&_svg]:translate-x-0'
            )}
            // The whole card is the hit area; the link is where it is
            // announced. The card is `relative`, so `inset-0` resolves to it.
            className="after:absolute after:inset-0 after:content-['']"
          />
        ) : null}
      </div>
    </Reveal>
  )
}

/**
 * AI & Innovation — the band that says what the team actually builds with AI.
 *
 * COLOUR is the point of this section and the reason it is not `service.grid`
 * with different copy: every card takes a hue from the shared `--fx-mark-*`
 * palette and spends it in four places — the icon tile, the outcome chip, the
 * pill borders and a bloom that only appears on hover. Body copy stays on
 * `--fx-ink` throughout, so the band is colourful without a single line of
 * text dropping below AA.
 *
 * MOTION is opacity and transform only: cards rise in on a spring, the icon
 * tile tilts on hover, the bloom fades. Nothing animates a layout property, so
 * the section contributes zero CLS, and every gesture is dropped outright
 * under `prefers-reduced-motion` rather than shortened.
 *
 * Renders `null` when there is neither a header, nor a button, nor one
 * capability with something in it — the section's live state on a fresh
 * install, where an editor has added it but not filled it in.
 */
export function AiInnovation({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const layout = readOption(settings, 'layout', LAYOUTS, 'bento')
  const columns = readOption(settings, 'columns', COLUMNS, '3')
  const align = readOption(settings, 'align', ALIGNMENTS, 'center')
  const theme = readOption(settings, 'theme', THEMES, 'subtle')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'lg')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'stagger')
  const glow = readBoolean(settings, 'glow', true)

  const preset = cardPreset(animation)
  const headerPreset = animation === 'stagger' ? 'fade' : preset

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const highlight = readString(section.data, 'heading_highlight')
  const footnote = readString(section.data, 'footnote')
  const cta = section.cta ?? null

  const capabilities = useMemo(
    () => blocksOfType(section.blocks, 'capability').filter(hasContent),
    [section.blocks]
  )

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)

  if (!hasHeader && !cta && capabilities.length === 0) {
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

  // Only the first card, only in bento, and only when a second card exists to
  // sit beside it — a lone double-width card is just a wide card.
  const featureFirst = layout === 'bento' && capabilities.length > 1

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      clip
      // `isolate`, not decoration: `Section` is `position: relative` with
      // `z-index: auto`, which is NOT a stacking context — so the aurora's
      // `-z-10` would paint behind the band's own background and disappear
      // on every theme except `default`. Isolating the section puts the
      // negative layer above that background and still below the content.
      className="isolate"
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('AI and innovation') })}
    >
      {glow ? (
        /*
         * The aurora. Two blurred fields at the band's shoulders, drawn from
         * the same palette the cards use so it reads as one system rather than
         * as a stock gradient.
         *
         * `Container` is not positioned, so `absolute` here resolves to the
         * `<Section>` — the wash spans the full band while the content stays
         * on the page measure. It is behind everything (`-z-10`), clipped by
         * the section (`clip`), and invisible to assistive tech.
         */
        <span aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <span className="absolute -top-24 -left-24 size-[28rem] rounded-full bg-fx-mark-violet/20 blur-3xl" />
          <span className="absolute -right-24 -bottom-32 size-[26rem] rounded-full bg-fx-mark-teal/20 blur-3xl" />
        </span>
      ) : null}

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

        {capabilities.length > 0 ? (
          <ul className={cn('grid grid-cols-1 gap-5', GRID_CLASSES[columns])}>
            {capabilities.map((capability, position) => (
              <CapabilityCard
                key={capability.uuid}
                block={capability}
                index={position}
                featureSpan={
                  featureFirst && position === 0
                    ? FEATURE_SPAN_CLASSES[columns]
                    : undefined
                }
                preset={preset}
                headingLevel={cardHeadingLevel}
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
              fallbackVariant="default"
              buttonClassName={fxButton({ tone: 'solid', scale: 'lg' })}
            />
          </Reveal>
        ) : null}
      </div>
    </Section>
  )
}

export default AiInnovation
