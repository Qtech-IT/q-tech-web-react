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
import { RichText } from '@/Components/Frontend/Sections/Shared/RichText'
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
const SHAPES = ['landscape', 'square', 'portrait'] as const
const LIST_COLUMNS = ['1', '2'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const
const ACCENTS = ['brand', 'ink', 'amber', 'teal', 'violet', 'rose'] as const

type Accent = (typeof ACCENTS)[number]

/*
 * Static class maps, indexed by values `readOption` has already constrained.
 * Tailwind compiles by scanning source text, so none of these may be assembled
 * at runtime — `bg-fx-mark-${accent}` produces a class that exists in the DOM
 * and in no stylesheet.
 */

/** The tinted disc behind each checklist mark. */
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

/**
 * `aspect-ratio` on the FRAME, with `object-cover` on the image.
 *
 * The editor's chosen shape holds whatever they upload, and the box is reserved
 * before the file arrives — which is what keeps this section's contribution to
 * CLS at zero.
 */
const SHAPE_CLASSES = {
  landscape: 'aspect-[4/3]',
  square: 'aspect-square',
  portrait: 'aspect-[4/5]',
} as const

/**
 * Two columns only from `lg` up.
 *
 * Below that the text column is already narrow, and a two-up checklist there
 * gives every row about eighteen characters before it wraps — which reads as a
 * broken grid rather than as a denser one.
 */
const LIST_COLUMN_CLASSES = {
  '1': '',
  '2': 'lg:grid-cols-2',
} as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

function contentPreset(animation: (typeof ANIMATIONS)[number]) {
  return animation === 'rise' ? 'stagger' : animation
}

/** A row worth rendering — has a label. */
function hasContent(block: CmsSectionBlock): boolean {
  return Boolean(trimmed(block.label))
}

/**
 * One checklist row.
 *
 * The mark is a `Check` unless the editor chose an icon, so a list where only
 * some rows carry one still lines up on a single left edge. The mark is
 * `aria-hidden`: it is the same glyph on every row, and announcing "check,
 * check, check" before each item is noise. The `<ul>`/`<li>` already carry the
 * "this is a list of N things" semantics.
 */
function ChecklistItem({
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
 * The split band — an image beside an argument and a checklist.
 *
 * COMPOSITION. Source order is TEXT FIRST, always: a screen reader and a phone
 * both get the words before the picture, and `order` moves the image visually
 * only, and only where there are two columns to move it between. An editor
 * flipping `media_side` therefore changes the layout without changing the
 * reading order.
 *
 * Every region is independently optional. With no image the text takes the full
 * measure rather than leaving a hole where a picture was meant to be; with no
 * checklist the body copy simply ends. That is the difference between a section
 * that survives missing CMS data and one that merely does not crash.
 *
 * Renders `null` when there is neither a header, nor body copy, nor an image,
 * nor a button, nor one checklist row.
 */
export function ContentSplit({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const side = readOption(settings, 'media_side', SIDES, 'start')
  const shape = readOption(settings, 'media_shape', SHAPES, 'landscape')
  const listColumns = readOption(settings, 'list_columns', LIST_COLUMNS, '1')
  const accent = readOption(settings, 'accent', ACCENTS, 'brand')
  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'lg')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'stagger')

  const preset = contentPreset(animation)
  const headerPreset = animation === 'stagger' ? 'fade' : preset

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const highlight = readString(section.data, 'heading_highlight')
  const footnote = readString(section.data, 'footnote')
  const body = trimmed(section.body)
  const media = section.media ?? null
  const cta = section.cta ?? null
  const secondaryCta = section.secondary_cta ?? null

  const items = useMemo(
    () => blocksOfType(section.blocks, 'item').filter(hasContent),
    [section.blocks]
  )

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)

  if (!hasHeader && !body && !media && !cta && !secondaryCta && items.length === 0) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  const sectionHeadingLevel: HeadingLevel = index === 0 ? 'h1' : 'h2'

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Details') })}
    >
      <div className="flex flex-col gap-fx-stack-lg">
        <div
          className={cn(
            'grid items-center gap-fx-stack-lg',
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
              {/* The bloom. Behind and outside the frame, so the colour reads
                  as light coming off the picture rather than as a border.
                  `transform-gpu` keeps the blur on its own compositor layer —
                  a 48px blur repainted on the main thread is the most
                  expensive thing on a page like this. */}
              <span
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute -inset-4 -z-10 rounded-fx-2xl blur-3xl',
                  'transform-gpu opacity-50',
                  GLOW_CLASSES[accent]
                )}
              />

              <div
                className={cn(
                  'overflow-hidden rounded-fx-xl border border-fx-line',
                  'bg-fx-surface-2 fx-raise-2',
                  SHAPE_CLASSES[shape]
                )}
              >
                <SectionMedia
                  media={media}
                  fill
                  className="h-full w-full"
                  mediaClassName="h-full w-full object-cover"
                />
              </div>
            </Reveal>
          ) : null}

          <div
            className={cn(
              'flex flex-col gap-fx-stack-md',
              !media && 'max-w-3xl'
            )}
          >
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

            {body ? (
              <Reveal preset={headerPreset}>
                <RichText html={body} />
              </Reveal>
            ) : null}

            {items.length > 0 ? (
              <ul
                className={cn(
                  'grid gap-x-6 gap-y-4',
                  LIST_COLUMN_CLASSES[listColumns]
                )}
              >
                {items.map((item, position) => (
                  <ChecklistItem
                    key={item.uuid}
                    block={item}
                    index={position}
                    accent={accent}
                    preset={preset}
                  />
                ))}
              </ul>
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
        </div>

        {footnote ? (
          <p className="text-fx-meta text-fx-ink-faint">{footnote}</p>
        ) : null}
      </div>
    </Section>
  )
}

export default ContentSplit
