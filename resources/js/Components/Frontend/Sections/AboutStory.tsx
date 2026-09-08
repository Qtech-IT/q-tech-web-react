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
import { SectionMedia } from '@/Components/Frontend/Sections/Shared/SectionMedia'
import {
  readOption,
  readString,
  trimmed,
} from '@/Components/Frontend/Sections/Shared/values'
import type { CmsSectionBlock } from '@/Types/cms'
import type { SectionComponentProps } from '@/Types/sections'

const LAYOUTS = ['end', 'start'] as const
const SHAPES = ['portrait', 'square', 'landscape'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const
const ACCENTS = ['brand', 'ink', 'amber', 'teal', 'violet', 'rose'] as const

type Accent = (typeof ACCENTS)[number]

const ACCENT_CYCLE = ['brand', 'violet', 'teal', 'amber', 'rose', 'ink'] as const

function cycledAccent(index: number): Accent {
  return ACCENT_CYCLE[index % ACCENT_CYCLE.length] as Accent
}

/** The lead value, and the glyph on a value-only row. */
const ACCENT_TEXT_CLASSES = {
  brand: 'text-fx-mark-brand',
  ink: 'text-fx-mark-ink',
  amber: 'text-fx-mark-amber',
  teal: 'text-fx-mark-teal',
  violet: 'text-fx-mark-violet',
  rose: 'text-fx-mark-rose',
} as const

/** The rule above each highlight. */
const RULE_CLASSES = {
  brand: 'bg-fx-mark-brand/45',
  ink: 'bg-fx-mark-ink/35',
  amber: 'bg-fx-mark-amber/45',
  teal: 'bg-fx-mark-teal/45',
  violet: 'bg-fx-mark-violet/45',
  rose: 'bg-fx-mark-rose/45',
} as const

/**
 * `aspect-ratio` on the frame, not on the image.
 *
 * The image is `object-cover` inside it, so the editor's chosen shape holds
 * whatever they upload — and the box is reserved before the file arrives,
 * which is what keeps this section's CLS at zero.
 */
const SHAPE_CLASSES = {
  portrait: 'aspect-[4/5]',
  square: 'aspect-square',
  landscape: 'aspect-[4/3]',
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
 * The story, split into paragraphs on blank lines.
 *
 * Plain text in, React elements out — nothing here can inject markup, which is
 * the whole reason `body` is a textarea rather than a rich-text field on this
 * type. `\r\n` is handled because a paste from Word arrives that way.
 */
function paragraphsOf(body: string | null | undefined): string[] {
  return (body ?? '')
    .split(/\r?\n\s*\r?\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph !== '')
}

/**
 * One milestone or value.
 *
 * A row with a lead value renders as a statistic; one without renders with its
 * icon instead. Never both: a number and a glyph competing inside one small
 * box reads as neither, which is why the icon field says so in its help text.
 */
function Highlight({
  block,
  index,
  preset,
}: {
  block: CmsSectionBlock
  index: number
  preset: 'none' | 'fade' | 'stagger'
}) {
  const value = trimmed(block.value)
  const label = trimmed(block.label)
  const note = trimmed(block.description)
  const accent = readOption(block.settings, 'accent', ACCENTS, cycledAccent(index))

  return (
    <Reveal as="li" preset={preset} index={index} className="flex flex-col gap-2">
      <span
        aria-hidden="true"
        className={cn('h-0.5 w-10 rounded-fx-pill', RULE_CLASSES[accent])}
      />

      {value ? (
        <span
          className={cn(
            'fx-numerals text-fx-subheading font-semibold',
            ACCENT_TEXT_CLASSES[accent]
          )}
        >
          {value}
        </span>
      ) : isRegisteredNavIcon(block.icon ?? undefined) ? (
        <NavIcon
          name={block.icon ?? undefined}
          className={cn('size-5', ACCENT_TEXT_CLASSES[accent])}
        />
      ) : null}

      {label ? (
        <span className="text-fx-body font-semibold text-fx-ink">{label}</span>
      ) : null}

      {note ? (
        <p className="text-fx-body-sm text-pretty text-fx-ink-soft">{note}</p>
      ) : null}
    </Reveal>
  )
}

/**
 * About us — the story beside one image, over a row of facts.
 *
 * The image is optional and so is every other region: with no media the story
 * runs to a comfortable measure at full width rather than leaving a hole where
 * a picture was meant to be. That is the difference between a section that
 * survives missing CMS data and one that merely does not crash.
 *
 * Renders `null` when there is neither a header, nor a story, nor a button,
 * nor one highlight.
 */
export function AboutStory({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const layout = readOption(settings, 'layout', LAYOUTS, 'end')
  const shape = readOption(settings, 'media_shape', SHAPES, 'portrait')
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
  const media = section.media ?? null
  const cta = section.cta ?? null
  const secondaryCta = section.secondary_cta ?? null

  const paragraphs = useMemo(() => paragraphsOf(section.body), [section.body])

  const highlights = useMemo(
    () => blocksOfType(section.blocks, 'highlight').filter(hasContent),
    [section.blocks]
  )

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)
  const hasStory = paragraphs.length > 0

  if (!hasHeader && !hasStory && !cta && !secondaryCta && highlights.length === 0) {
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
        : { 'aria-label': t('About us') })}
    >
      <div className="flex flex-col gap-fx-stack-xl">
        <div
          className={cn(
            'grid items-center gap-fx-stack-xl',
            media && 'lg:grid-cols-2 lg:gap-12'
          )}
        >
          {media ? (
            <Reveal
              preset={headerPreset}
              className={cn(
                // Source order is story-first so a screen reader and a phone
                // both get the words before the picture; `order` moves the
                // image visually only, and only where there are two columns.
                'relative',
                layout === 'start' ? 'lg:order-first' : 'lg:order-last'
              )}
            >
              <div
                className={cn(
                  // Owns the positioning context for the `fill` media inside
                  // it, rather than relying on the `Reveal` above being
                  // `relative`.
                  'relative overflow-hidden rounded-fx-xl border border-fx-line',
                  'bg-fx-surface-2 shadow-fx-2',
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

            {hasStory ? (
              <Reveal
                preset={headerPreset}
                className="flex flex-col gap-4 text-fx-body text-pretty text-fx-ink-soft"
              >
                {paragraphs.map((paragraph, position) => (
                  <p key={position} className="max-w-[62ch]">
                    {paragraph}
                  </p>
                ))}
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
        </div>

        {highlights.length > 0 ? (
          <ul className="grid grid-cols-2 gap-x-6 gap-y-fx-stack-lg border-t border-fx-line pt-fx-stack-lg lg:grid-cols-4">
            {highlights.map((item, position) => (
              <Highlight
                key={item.uuid}
                block={item}
                index={position}
                preset={preset}
              />
            ))}
          </ul>
        ) : null}

        {footnote ? (
          <p className="text-fx-meta text-fx-ink-faint">{footnote}</p>
        ) : null}
      </div>
    </Section>
  )
}

export default AboutStory
