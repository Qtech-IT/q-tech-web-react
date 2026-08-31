import { useMemo } from 'react'
import { Link } from '@inertiajs/react'
import { ArrowRight, ImageOff } from 'lucide-react'

import { NavIcon, isRegisteredNavIcon } from '@/Components/Public/NavIcon'
import { Section } from '@/Components/Public/Section'
import { fxButton } from '@/Components/Public/fxButton'
import { SafeImage } from '@/Components/UI/SafeImage'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
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
import type { CmsPageCard } from '@/Types/cms'
import type { SectionComponentProps } from '@/Types/sections'

const LAYOUTS = ['card', 'icon', 'list'] as const
const COLUMNS = ['2', '3', '4'] as const
const ALIGNMENTS = ['center', 'start'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const
const ACCENTS = ['brand', 'ink', 'amber', 'teal', 'violet', 'rose'] as const

type Accent = (typeof ACCENTS)[number]
type Layout = (typeof LAYOUTS)[number]

/** Cycled by position when a page carries no accent of its own. */
const ACCENT_CYCLE = ['brand', 'violet', 'teal', 'amber', 'rose', 'ink'] as const

function cycledAccent(index: number): Accent {
  return ACCENT_CYCLE[index % ACCENT_CYCLE.length] as Accent
}

/**
 * A page's stored `accent` is a loose VARCHAR — the column is deliberately not
 * an enum, so the design system can gain a colour without a migration. That
 * makes validating it the renderer's job: an unrecognised value falls back to
 * the positional cycle rather than indexing a class map with `undefined`.
 */
function accentOf(value: string | null, index: number): Accent {
  return ACCENTS.includes(value as Accent) ? (value as Accent) : cycledAccent(index)
}

/*
 * Static class maps, indexed by values already constrained above. Tailwind
 * compiles by scanning source text and never sees an assembled string.
 */

/** The icon tile. */
const ICON_CLASSES = {
  brand: 'bg-fx-mark-brand/12 text-fx-mark-brand',
  ink: 'bg-fx-mark-ink/10 text-fx-mark-ink',
  amber: 'bg-fx-mark-amber/12 text-fx-mark-amber',
  teal: 'bg-fx-mark-teal/12 text-fx-mark-teal',
  violet: 'bg-fx-mark-violet/12 text-fx-mark-violet',
  rose: 'bg-fx-mark-rose/12 text-fx-mark-rose',
} as const

/** The hairline that lights up along the card's top edge on hover. */
const EDGE_CLASSES = {
  brand: 'bg-fx-mark-brand',
  ink: 'bg-fx-mark-ink',
  amber: 'bg-fx-mark-amber',
  teal: 'bg-fx-mark-teal',
  violet: 'bg-fx-mark-violet',
  rose: 'bg-fx-mark-rose',
} as const

const COLUMN_CLASSES = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
} as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

function cardPreset(animation: (typeof ANIMATIONS)[number]) {
  return animation === 'rise' ? 'stagger' : animation
}

/**
 * One listed page.
 *
 * THE WHOLE CARD IS CLICKABLE, and it is done with a stretched pseudo-element
 * on the title link rather than by wrapping the card in an anchor. Wrapping
 * would fold the excerpt into the link's accessible name, so a screen reader
 * would announce the title plus two sentences of summary as one enormous link
 * label. This way the accessible name is the page title and the hit area is
 * still the card.
 */
function IndexCard({
  card,
  index,
  layout,
  preset,
  headingLevel,
}: {
  card: CmsPageCard
  index: number
  layout: Layout
  preset: 'none' | 'fade' | 'stagger'
  headingLevel: 'h2' | 'h3'
}) {
  const { t } = useTranslations()

  const accent = accentOf(card.accent, index)
  const excerpt = trimmed(card.excerpt)
  const media = card.media ?? null
  const icon = card.icon ?? undefined
  const Heading = headingLevel

  const compact = layout === 'list'
  // Image cards fall back to the icon treatment when the page has no artwork,
  // so a half-illustrated set still lines up instead of leaving holes.
  const showMedia = layout === 'card' && Boolean(media?.url)
  const showIcon = !showMedia && !compact

  return (
    <Reveal
      as="li"
      preset={preset}
      index={index}
      className={cn(
        'group/card relative isolate flex flex-col overflow-hidden',
        'rounded-fx-xl border border-fx-line bg-fx-surface fx-raise-1',
        'transition-[border-color,box-shadow,transform] duration-300 ease-fx',
        'hover:-translate-y-1 hover:border-fx-accent-line hover:fx-raise-3',
        'has-[a:focus-visible]:border-fx-accent-line has-[a:focus-visible]:fx-raise-3',
        'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        compact ? 'p-5' : 'p-0'
      )}
    >
      {/* The lit top edge. Decorative, so it is a span rather than a border —
          a border would shift the card's box by a pixel on hover. */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0',
          'transition-transform duration-300 ease-fx group-hover/card:scale-x-100',
          'motion-reduce:transition-none',
          EDGE_CLASSES[accent]
        )}
      />

      {showMedia && media ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-fx-surface-2">
          <SafeImage
            src={media.url}
            alt={media.alt_text ?? ''}
            {...(media.width ? { width: media.width } : {})}
            {...(media.height ? { height: media.height } : {})}
            loading="lazy"
            className={cn(
              'h-full w-full object-cover',
              'transform-gpu transition-transform duration-500 ease-fx',
              'group-hover/card:scale-105',
              'motion-reduce:transition-none motion-reduce:group-hover/card:scale-100'
            )}
          />
        </div>
      ) : null}

      <div
        className={cn(
          'flex flex-1 flex-col gap-3',
          compact ? 'p-0' : 'p-6',
          showMedia && 'pt-5'
        )}
      >
        {showIcon ? (
          <span
            aria-hidden="true"
            className={cn(
              'flex size-11 items-center justify-center rounded-fx-md',
              ICON_CLASSES[accent]
            )}
          >
            {isRegisteredNavIcon(icon) ? (
              <NavIcon name={icon} className="size-5" />
            ) : (
              // Not an error state — a page published before anyone chose an
              // icon. The initial keeps the tile the same size and shape as
              // its neighbours, which is what a missing glyph must not break.
              <span className="text-fx-body font-semibold">
                {[...(card.title ?? '')][0]?.toUpperCase() ?? ''}
              </span>
            )}
          </span>
        ) : null}

        <Heading className="text-fx-subheading font-semibold text-balance text-fx-ink">
          <Link
            href={card.path}
            // Stretches this one link over the whole card — see the note above
            // for why the card is not wrapped in an anchor.
            className={cn(
              'after:absolute after:inset-0 after:content-[""]',
              'rounded-fx-xs transition-colors duration-200 ease-fx',
              'group-hover/card:text-fx-accent-text',
              'focus-visible:outline-none',
              'motion-reduce:transition-none'
            )}
          >
            {card.title}
          </Link>
        </Heading>

        {excerpt ? (
          // Clamped rather than truncated server-side: the excerpt is stored
          // whole, so a wider card at a larger breakpoint simply shows more of
          // it, and nothing is lost if the design changes.
          <p className="line-clamp-3 text-fx-body-sm text-pretty text-fx-ink-soft">
            {excerpt}
          </p>
        ) : null}

        <span
          aria-hidden="true"
          className={cn(
            'mt-auto inline-flex items-center gap-1.5 pt-2',
            'text-fx-meta font-medium text-fx-ink-faint',
            'transition-colors duration-200 ease-fx',
            'group-hover/card:text-fx-accent-text',
            'motion-reduce:transition-none'
          )}
        >
          {t('Learn more')}
          <ArrowRight
            className={cn(
              'size-3.5 transition-transform duration-300 ease-fx rtl:rotate-180',
              'group-hover/card:translate-x-0.5',
              'motion-reduce:transition-none motion-reduce:group-hover/card:translate-x-0'
            )}
          />
        </span>
      </div>
    </Reveal>
  )
}

/**
 * The index band — a grid of other pages.
 *
 * The rows come from the server, resolved fresh on every request rather than
 * from the page cache, so publishing a service makes it appear here
 * immediately. See `PageRenderService::withCollections()`.
 *
 * THE EMPTY STATE IS A DECISION, not an oversight. Before the first service is
 * published there is nothing to list, and the editor chooses between two honest
 * outcomes: a sentence explaining that (`empty_message`), or the whole band
 * disappearing. What it must never do is render a heading over an empty grid.
 */
export function CollectionIndex({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const layout = readOption(settings, 'layout', LAYOUTS, 'card')
  const columns = readOption(settings, 'columns', COLUMNS, '3')
  const align = readOption(settings, 'align', ALIGNMENTS, 'center')
  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'lg')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'stagger')

  const preset = cardPreset(animation)
  const headerPreset = animation === 'stagger' ? 'fade' : preset

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const highlight = readString(section.data, 'heading_highlight')
  const emptyMessage = readString(section.data, 'empty_message')
  const cta = section.cta ?? null

  // Defensive: `collection` is attached server-side, but a section rendered in
  // the admin preview has never been through that step.
  const cards = useMemo(
    () => (Array.isArray(section.collection) ? section.collection : []),
    [section.collection]
  )

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)
  const isEmpty = cards.length === 0

  // Nothing to list and nothing to say about it — the band removes itself
  // rather than rendering a title over a void.
  if (isEmpty && !emptyMessage) {
    return null
  }

  if (!hasHeader && isEmpty && !cta) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  const sectionHeadingLevel: HeadingLevel = index === 0 ? 'h1' : 'h2'
  // A card title sits one level below the section's own heading, so the page
  // outline stays contiguous wherever an editor drags this band.
  const cardHeadingLevel = sectionHeadingLevel === 'h1' ? 'h2' : 'h3'

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Index') })}
    >
      <div className="flex flex-col gap-fx-stack-lg">
        {hasHeader ? (
          <SectionHeader
            eyebrow={eyebrow}
            heading={headingNode}
            subheading={subheading}
            headingLevel={sectionHeadingLevel}
            headingSize={sectionHeadingLevel}
            align={align}
            preset={headerPreset}
            {...(headingId ? { headingId } : {})}
          />
        ) : null}

        {isEmpty ? (
          <Reveal
            preset={headerPreset}
            className={cn(
              'flex flex-col items-center gap-3 rounded-fx-xl border border-dashed',
              'border-fx-line bg-fx-surface px-6 py-fx-stack-lg text-center'
            )}
          >
            <ImageOff
              aria-hidden="true"
              className="size-6 text-fx-ink-faint"
            />
            <p className="text-fx-body text-pretty text-fx-ink-soft">
              {emptyMessage}
            </p>
          </Reveal>
        ) : (
          <ul className={cn('grid grid-cols-1 gap-5', COLUMN_CLASSES[columns])}>
            {cards.map((card, position) => (
              <IndexCard
                key={card.uuid}
                card={card}
                index={position}
                layout={layout}
                preset={preset}
                headingLevel={cardHeadingLevel}
              />
            ))}
          </ul>
        )}

        {cta ? (
          <Reveal
            preset={headerPreset}
            className={cn('flex', align === 'center' && 'justify-center')}
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

export default CollectionIndex
