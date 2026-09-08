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
import { SectionMedia } from '@/Components/Frontend/Sections/Shared/SectionMedia'
import {
  readOption,
  readString,
  trimmed,
} from '@/Components/Frontend/Sections/Shared/values'
import type { CmsSectionBlock } from '@/Types/cms'
import type { SectionComponentProps } from '@/Types/sections'

const LAYOUTS = ['split', 'stacked'] as const
const PILLAR_COLUMNS = ['2', '3'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const
const ACCENTS = ['brand', 'ink', 'amber', 'teal', 'violet', 'rose'] as const

type Accent = (typeof ACCENTS)[number]

/**
 * Fallback hue order for a pillar with no `settings.accent`. Cycled by
 * position — the same reasoning as every other section on this palette: one
 * default hue would make every mark identical until an editor changed each by
 * hand. Opens warm and alternates temperature so no two neighbours match.
 */
const ACCENT_CYCLE = ['brand', 'teal', 'violet', 'amber', 'rose', 'ink'] as const

function cycledAccent(index: number): Accent {
  return ACCENT_CYCLE[index % ACCENT_CYCLE.length] as Accent
}

/*
 * Static class maps, indexed by values `readOption` has already constrained.
 * Tailwind scans source text, so none of these may be assembled at runtime.
 */

/** The icon tile: a wash of the hue with the hue itself as the glyph. */
const MARK_CLASSES = {
  brand: 'bg-fx-mark-brand/12 text-fx-mark-brand',
  ink: 'bg-fx-mark-ink/10 text-fx-mark-ink',
  amber: 'bg-fx-mark-amber/12 text-fx-mark-amber',
  teal: 'bg-fx-mark-teal/12 text-fx-mark-teal',
  violet: 'bg-fx-mark-violet/12 text-fx-mark-violet',
  rose: 'bg-fx-mark-rose/12 text-fx-mark-rose',
} as const

/** The hairline that lights up along the card's top edge on hover. */
const RAIL_CLASSES = {
  brand: 'before:bg-fx-mark-brand',
  ink: 'before:bg-fx-mark-ink',
  amber: 'before:bg-fx-mark-amber',
  teal: 'before:bg-fx-mark-teal',
  violet: 'before:bg-fx-mark-violet',
  rose: 'before:bg-fx-mark-rose',
} as const

const PILLAR_COLUMN_CLASSES = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
} as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

/**
 * The argument, split into paragraphs on blank lines.
 *
 * A plain textarea, not rich text — the same rule `about.story` uses. `\r\n` is
 * handled because a paste from a document arrives that way.
 */
function paragraphsOf(body: string | undefined): string[] {
  if (!body) {
    return []
  }

  return body
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph !== '')
}

/** A pillar worth rendering — has a title, a description, or both. */
function hasContent(block: CmsSectionBlock): boolean {
  return Boolean(trimmed(block.label) || trimmed(block.description))
}

/**
 * One capability card.
 *
 * The icon tile is filled with a tint of the hue and the glyph knocked out in
 * the hue at full strength — the same treatment `service.featured` uses, so the
 * two service bands read as one family. The top rail is a `::before` hairline
 * that grows from nothing to full width on hover; nothing that owns hit area
 * moves.
 */
function PillarCard({
  block,
  index,
  preset,
  headingLevel,
}: {
  block: CmsSectionBlock
  index: number
  preset: 'none' | 'fade' | 'stagger'
  headingLevel: 'h2' | 'h3' | 'h4'
}) {
  const label = trimmed(block.label)
  const description = trimmed(block.description)
  const accent = readOption(block.settings, 'accent', ACCENTS, cycledAccent(index))
  const Heading = headingLevel

  return (
    <Reveal
      as="li"
      preset={preset}
      index={index}
      className={cn(
        'group relative isolate flex flex-col gap-3 overflow-hidden',
        'rounded-fx-xl border border-fx-line bg-fx-surface p-6 fx-raise-1',
        'transition-[border-color,box-shadow,transform] duration-300 ease-fx',
        'hover:-translate-y-1 hover:border-fx-accent-line hover:shadow-fx-3',
        'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        "before:absolute before:inset-x-0 before:top-0 before:h-0.5 before:origin-left",
        'before:scale-x-0 before:transition-transform before:duration-300 before:ease-fx',
        'group-hover:before:scale-x-100 motion-reduce:before:transition-none',
        RAIL_CLASSES[accent]
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          'flex size-11 items-center justify-center rounded-fx-lg',
          MARK_CLASSES[accent]
        )}
      >
        {isRegisteredNavIcon(block.icon ?? undefined) ? (
          <NavIcon name={block.icon ?? undefined} className="size-5" />
        ) : (
          <Sparkles className="size-5" />
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
    </Reveal>
  )
}

/**
 * Service Overview — the professional opening of a service page.
 *
 * COMPOSITION. A headline and a two- or three-paragraph argument for the
 * discipline, set against a grid of the capability cards that make up the
 * offer. On `split` the argument and the cards sit side by side on `lg`
 * (2fr / 3fr), which is the premium two-column band a services page opens
 * with; on `stacked` the header runs full measure and the cards sit beneath
 * it. An optional image carries a caption and a soft frame.
 *
 * WHY NO RICH TEXT. The argument is a plain textarea split on blank lines. A
 * service page's copy has to stay on-brand and match the editor exactly, and a
 * rich-text field stored the editor's own classes into the HTML — which the
 * public renderer then stripped. Structure that a designer wants lives in real
 * fields (the emphasised word, the cards, the image), each rendered in the
 * site's design every time.
 *
 * COLOUR. Each card takes a hue from the shared `--fx-mark-*` palette — its own
 * `settings.accent`, else its position in `ACCENT_CYCLE` — spent on the icon
 * tile and the hover rail. Body copy stays on ink tokens, so every pairing is
 * AA and the palette re-tunes per theme in `frontend.css` with no `dark:`
 * class here.
 *
 * HEADING ORDER. Position 0 owns the page's `h1`; a card title sits one level
 * below whatever heading actually rendered above it.
 *
 * Renders `null` when there is neither a header, nor an argument, nor an image,
 * nor a button, nor one filled-in card.
 */
export function ContentOverview({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const layout = readOption(settings, 'layout', LAYOUTS, 'split')
  const pillarColumns = readOption(settings, 'pillar_columns', PILLAR_COLUMNS, '2')
  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'lg')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'stagger')

  const cardPreset = animation === 'rise' ? 'stagger' : animation
  const headerPreset = animation === 'stagger' ? 'fade' : cardPreset

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const highlight = readString(section.data, 'heading_highlight')
  const caption = readString(section.data, 'media_caption')
  const media = section.media ?? null
  const cta = section.cta ?? null
  const secondaryCta = section.secondary_cta ?? null

  const paragraphs = useMemo(
    () => paragraphsOf(trimmed(section.body)),
    [section.body]
  )

  const pillars = useMemo(
    () => blocksOfType(section.blocks, 'pillar').filter(hasContent),
    [section.blocks]
  )

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)
  const hasArgument = paragraphs.length > 0 || Boolean(media) || Boolean(cta || secondaryCta)

  if (!hasHeader && !hasArgument && pillars.length === 0) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  const sectionHeadingLevel: HeadingLevel = index === 0 ? 'h1' : 'h2'
  const cardHeadingLevel: 'h2' | 'h3' | 'h4' = hasHeader
    ? sectionHeadingLevel === 'h1'
      ? 'h2'
      : 'h3'
    : 'h2'

  const isSplit = layout === 'split'

  const argument = (
    <div className="flex flex-col gap-fx-stack-md">
      {hasHeader ? (
        <SectionHeader
          eyebrow={eyebrow}
          heading={headingNode}
          subheading={subheading}
          headingLevel={sectionHeadingLevel}
          headingSize={sectionHeadingLevel}
          align="start"
          preset={headerPreset}
          {...(headingId ? { headingId } : {})}
        />
      ) : null}

      {paragraphs.length > 0 ? (
        <Reveal preset={headerPreset} className="flex flex-col gap-fx-stack-sm">
          {paragraphs.map((paragraph, position) => (
            <p
              key={position}
              className="text-fx-body text-pretty text-fx-ink-soft"
            >
              {paragraph}
            </p>
          ))}
        </Reveal>
      ) : null}

      {media ? (
        <Reveal preset={headerPreset}>
          <figure className="flex flex-col gap-3">
            <div className="overflow-hidden rounded-fx-lg border border-fx-line bg-fx-surface-2 fx-raise-1">
              <SectionMedia
                media={media}
                fallbackRatio="16 / 9"
                mediaClassName="h-full w-full object-cover"
              />
            </div>

            {caption ? (
              <figcaption className="text-fx-meta text-fx-ink-faint">
                {caption}
              </figcaption>
            ) : null}
          </figure>
        </Reveal>
      ) : null}

      {cta || secondaryCta ? (
        <Reveal preset={headerPreset} className="flex flex-wrap gap-3 pt-1">
          <SectionCta
            cta={cta}
            size="lg"
            fallbackVariant="default"
            buttonClassName={fxButton({ tone: 'solid', scale: 'lg' })}
          />
          <SectionCta
            cta={secondaryCta}
            size="lg"
            fallbackVariant="outline"
            buttonClassName={fxButton({ tone: 'outline', scale: 'lg' })}
          />
        </Reveal>
      ) : null}
    </div>
  )

  const cardGrid =
    pillars.length > 0 ? (
      <ul
        className={cn(
          'grid grid-cols-1 gap-5',
          isSplit ? 'sm:grid-cols-2' : PILLAR_COLUMN_CLASSES[pillarColumns]
        )}
      >
        {pillars.map((pillar, position) => (
          <PillarCard
            key={pillar.uuid}
            block={pillar}
            index={position}
            preset={cardPreset}
            headingLevel={cardHeadingLevel}
          />
        ))}
      </ul>
    ) : null

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Service overview') })}
    >
      {isSplit && cardGrid ? (
        <div className="grid gap-fx-stack-xl lg:grid-cols-[2fr_3fr] lg:items-start lg:gap-12">
          {argument}
          {cardGrid}
        </div>
      ) : (
        <div className="flex flex-col gap-fx-stack-xl">
          <div className={cn(!cardGrid && 'max-w-3xl')}>{argument}</div>
          {cardGrid}
        </div>
      )}
    </Section>
  )
}

export default ContentOverview
