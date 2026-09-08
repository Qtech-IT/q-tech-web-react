import { useMemo } from 'react'
import { Check } from 'lucide-react'

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

const SIDES = ['start', 'end'] as const
const LIST_COLUMNS = ['1', '2'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const
const ACCENTS = ['brand', 'ink', 'amber', 'teal', 'violet', 'rose'] as const

type Accent = (typeof ACCENTS)[number]

/*
 * Static class maps, indexed by values `readOption` has already constrained.
 * Tailwind scans source text, so none of these may be assembled at runtime.
 */

/** The tinted disc behind each delivered-item mark. */
const MARK_CLASSES = {
  brand: 'bg-fx-mark-brand/12 text-fx-mark-brand',
  ink: 'bg-fx-mark-ink/10 text-fx-mark-ink',
  amber: 'bg-fx-mark-amber/12 text-fx-mark-amber',
  teal: 'bg-fx-mark-teal/12 text-fx-mark-teal',
  violet: 'bg-fx-mark-violet/12 text-fx-mark-violet',
  rose: 'bg-fx-mark-rose/12 text-fx-mark-rose',
} as const

/** The bloom behind the image — light coming off it, not a border. */
const GLOW_CLASSES = {
  brand: 'bg-fx-mark-brand/25',
  ink: 'bg-fx-mark-ink/20',
  amber: 'bg-fx-mark-amber/25',
  teal: 'bg-fx-mark-teal/25',
  violet: 'bg-fx-mark-violet/25',
  rose: 'bg-fx-mark-rose/25',
} as const

/** The rule down the side of the chapter label. */
const RULE_CLASSES = {
  brand: 'bg-fx-mark-brand',
  ink: 'bg-fx-mark-ink',
  amber: 'bg-fx-mark-amber',
  teal: 'bg-fx-mark-teal',
  violet: 'bg-fx-mark-violet',
  rose: 'bg-fx-mark-rose',
} as const

const LIST_COLUMN_CLASSES = {
  '1': '',
  '2': 'sm:grid-cols-2',
} as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

type Segment =
  | { kind: 'heading'; text: string }
  | { kind: 'paragraph'; text: string }

/**
 * The narrative, split on blank lines. A line opening with `## ` is a
 * sub-heading; everything else is a paragraph. `\r\n` is handled because a
 * paste from a document arrives that way — the same rule `about.story` uses,
 * plus the one markdown affordance the old rich text was actually used for.
 */
function segmentsOf(body: string | undefined): Segment[] {
  if (!body) {
    return []
  }

  return body
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.trim())
    .filter((block) => block !== '')
    .map((block): Segment => {
      const heading = block.match(/^#{1,3}\s+(.*)$/s)

      return heading
        ? { kind: 'heading', text: (heading[1] ?? '').trim() }
        : { kind: 'paragraph', text: block.replace(/\s*\n\s*/g, ' ') }
    })
}

/** A delivered item worth rendering — has a label. */
function hasContent(block: CmsSectionBlock): boolean {
  return Boolean(trimmed(block.label))
}

/**
 * One delivered-item row.
 *
 * The mark is a `Check` unless the editor chose an icon, so a mixed list still
 * lines up on one left edge. `aria-hidden` — the `<ul>`/`<li>` already carry
 * "a list of N things" and announcing "check" before each is noise.
 */
function DeliveredItem({
  block,
  index,
  accent,
  preset,
}: {
  block: CmsSectionBlock
  index: number
  accent: Accent
  preset: 'none' | 'fade' | 'stagger'
}) {
  const label = trimmed(block.label)
  const note = trimmed(block.description)
  const icon = block.icon ?? undefined

  return (
    <Reveal as="li" preset={preset} index={index} className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className={cn(
          'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-fx-sm',
          MARK_CLASSES[accent]
        )}
      >
        {isRegisteredNavIcon(icon) ? (
          <NavIcon name={icon} className="size-3.5" />
        ) : (
          <Check className="size-3.5" strokeWidth={3} />
        )}
      </span>

      <span className="flex flex-col gap-1">
        <span className="text-fx-body font-medium text-fx-ink">{label}</span>

        {note ? (
          <span className="text-fx-body-sm text-pretty text-fx-ink-soft">
            {note}
          </span>
        ) : null}
      </span>
    </Reveal>
  )
}

/**
 * Case Study Chapter — one movement of the story: the problem, the approach,
 * or the outcome.
 *
 * COMPOSITION. A chapter label with a coloured rule beside it, a headline, an
 * optional lead, then the narrative as plain paragraphs (a `##` line becomes a
 * sub-heading). A "what we delivered" list sits beneath — one column beside an
 * image, or the editor's column count when there is none. The image, when set,
 * takes the opposite column at `lg` with a soft accent bloom; source order is
 * always text first, so a screen reader and a phone get the words before the
 * picture and `media_side` only moves the visual.
 *
 * WHY NO RICH TEXT. A case study's copy has to stay on-brand and match the
 * editor exactly. Rich text stored the editor's own classes into the HTML,
 * which the public renderer then stripped — the copy never rendered as shown.
 * Structure lives in real fields: the label, the sub-headings, the delivered
 * list, the image.
 *
 * COLOUR. One `settings.accent` runs through the whole band — the list marks,
 * the label rule, the image bloom — and an editor sets the case study's own
 * colour on every chapter so the page reads as one piece. The palette re-tunes
 * per theme in `frontend.css`; no `dark:` class here.
 *
 * HEADING ORDER. Position 0 would own the page's `h1`; in practice this band
 * always follows an `article.header`, so it renders `h2` and its sub-headings
 * are `h3`.
 *
 * Renders `null` when there is neither a header, nor a narrative, nor an
 * image, nor a delivered item, nor a button.
 */
export function CaseNarrative({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const side = readOption(settings, 'media_side', SIDES, 'end')
  const listColumns = readOption(settings, 'list_columns', LIST_COLUMNS, '1')
  const accent = readOption(settings, 'accent', ACCENTS, 'brand')
  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'default')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'fade')

  const contentPreset = animation === 'rise' ? 'stagger' : animation
  const headerPreset = animation === 'stagger' ? 'fade' : contentPreset

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const highlight = readString(section.data, 'heading_highlight')
  const caption = readString(section.data, 'media_caption')
  const listHeading = readString(section.data, 'list_heading')
  const media = section.media ?? null
  const cta = section.cta ?? null

  const segments = useMemo(
    () => segmentsOf(trimmed(section.body)),
    [section.body]
  )

  const points = useMemo(
    () => blocksOfType(section.blocks, 'point').filter(hasContent),
    [section.blocks]
  )

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)

  if (
    !hasHeader &&
    segments.length === 0 &&
    !media &&
    points.length === 0 &&
    !cta
  ) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  const sectionHeadingLevel: HeadingLevel = index === 0 ? 'h1' : 'h2'
  const SubHeading: 'h2' | 'h3' = sectionHeadingLevel === 'h1' ? 'h2' : 'h3'

  const listColumnClass = media ? '' : LIST_COLUMN_CLASSES[listColumns]

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Case study chapter') })}
    >
      <div
        className={cn(
          'grid items-start gap-fx-stack-lg',
          media && 'lg:grid-cols-2 lg:gap-12'
        )}
      >
        {media ? (
          <Reveal
            preset={headerPreset}
            className={cn(
              'relative isolate',
              // Visual position only — the text stays first in source order.
              side === 'start' ? 'lg:order-first' : 'lg:order-last'
            )}
          >
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute -inset-4 -z-10 rounded-fx-2xl blur-3xl',
                'transform-gpu opacity-50',
                GLOW_CLASSES[accent]
              )}
            />

            <figure className="flex flex-col gap-3">
              <div className="relative overflow-hidden rounded-fx-xl border border-fx-line bg-fx-surface-2 fx-raise-2">
                <SectionMedia
                  media={media}
                  fallbackRatio="4 / 3"
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

        <div className={cn('flex flex-col gap-fx-stack-md', !media && 'max-w-3xl')}>
          {hasHeader ? (
            <div className="flex flex-col gap-fx-stack-sm">
              {eyebrow ? (
                <p className="flex items-center gap-3 text-fx-eyebrow uppercase text-fx-ink-faint">
                  <span
                    aria-hidden="true"
                    className={cn('h-px w-8 shrink-0', RULE_CLASSES[accent])}
                  />
                  {eyebrow}
                </p>
              ) : null}

              <SectionHeader
                heading={headingNode}
                subheading={subheading}
                headingLevel={sectionHeadingLevel}
                headingSize={sectionHeadingLevel}
                align="start"
                preset={headerPreset}
                {...(headingId ? { headingId } : {})}
              />
            </div>
          ) : null}

          {segments.length > 0 ? (
            <Reveal preset={headerPreset} className="flex flex-col gap-fx-stack-sm">
              {segments.map((segment, position) =>
                segment.kind === 'heading' ? (
                  <SubHeading
                    key={position}
                    className="mt-fx-stack-sm text-fx-subheading font-semibold text-fx-ink"
                  >
                    {segment.text}
                  </SubHeading>
                ) : (
                  <p
                    key={position}
                    className="text-fx-body text-pretty text-fx-ink-soft"
                  >
                    {segment.text}
                  </p>
                )
              )}
            </Reveal>
          ) : null}

          {points.length > 0 ? (
            <div className="mt-fx-stack-sm flex flex-col gap-fx-stack-sm">
              {listHeading ? (
                <p className="text-fx-label font-semibold uppercase text-fx-ink-faint">
                  {listHeading}
                </p>
              ) : null}

              <ul className={cn('grid gap-x-6 gap-y-4', listColumnClass)}>
                {points.map((point, position) => (
                  <DeliveredItem
                    key={point.uuid}
                    block={point}
                    index={position}
                    accent={accent}
                    preset={contentPreset}
                  />
                ))}
              </ul>
            </div>
          ) : null}

          {cta ? (
            <Reveal preset={headerPreset} className="flex pt-1">
              <SectionCta
                cta={cta}
                size="lg"
                fallbackVariant="outline"
                buttonClassName={fxButton({ tone: 'outline', scale: 'lg' })}
              />
            </Reveal>
          ) : null}
        </div>
      </div>
    </Section>
  )
}

export default CaseNarrative
