import { useMemo } from 'react'

import { Section } from '@/Components/Public/Section'
import { fxButton } from '@/Components/Public/fxButton'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
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
import type { SectionComponentProps } from '@/Types/sections'

const MEASURES = ['prose', 'default'] as const
const ALIGNMENTS = ['start', 'center'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise'] as const

/**
 * How wide the passage runs, as a clamp on the CONTENT rather than a narrower
 * container.
 *
 * `prose` is the `--fx-measure-prose` token — 704px, roughly 72 characters at
 * body size, which is where long-form text stays readable. A passage set to the
 * full 1320px page measure is a wall, and no amount of leading fixes it.
 *
 * WHY THIS IS NOT A `Container` SIZE. Handing `narrow` to the container centres
 * a 704px column inside the viewport, which puts the text's left edge ~300px
 * inboard of every other band on the page — the heading above it and the CTA
 * below it start at the page gutter, and the body copy visibly does not. The
 * band therefore keeps the page container and clamps the stack inside it, so
 * the passage lines up with its own page. `ArticleHeader` already does exactly
 * this (`max-w-fx-prose` inside the default container); this band was the odd
 * one out.
 */
const MEASURE_CLAMPS = {
  prose: 'max-w-fx-prose',
  default: '',
} as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

/**
 * The prose band — a passage of formatted text on a reading measure.
 *
 * The one section in the registry whose content is not a structure. See
 * `ContentProseType` for why exactly one of these exists.
 *
 * BODY COPY IS ALWAYS LEFT-ALIGNED, even when the header is centred. Centred
 * paragraphs give the eye no consistent place to start each line, and the cost
 * compounds with every line — which is why `align` is documented as moving only
 * the heading.
 *
 * HEADING LEVELS. This band owns an `h2` (the page's `h1` at position 0), and
 * the sub-heads an editor writes inside the rich text are styled as `h3`/`h4`
 * by `RichText`. Nothing here trusts the editor to have picked the right level,
 * because a skipped level is invisible until an audit.
 *
 * Renders `null` when there is neither a header, nor a body, nor an image, nor
 * a button — the state a section is in between "added" and "written".
 */
export function ContentProse({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const measure = readOption(settings, 'measure', MEASURES, 'prose')
  const align = readOption(settings, 'align', ALIGNMENTS, 'start')
  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'default')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'fade')

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const highlight = readString(section.data, 'heading_highlight')
  const caption = readString(section.data, 'media_caption')
  const body = trimmed(section.body)
  const media = section.media ?? null
  const cta = section.cta ?? null

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)

  if (!hasHeader && !body && !media && !cta) {
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
        : { 'aria-label': t('Content') })}
    >
      <div
        className={cn(
          'flex flex-col gap-fx-stack-md',
          MEASURE_CLAMPS[measure],
          // Centred only when the editor asked for it. Left-aligned copy that
          // starts where the rest of the page starts is the default because
          // that is what every other band does.
          align === 'center' && 'mx-auto'
        )}
      >
        {hasHeader ? (
          <SectionHeader
            eyebrow={eyebrow}
            heading={headingNode}
            subheading={subheading}
            headingLevel={sectionHeadingLevel}
            headingSize={sectionHeadingLevel}
            align={align}
            preset={animation}
            {...(headingId ? { headingId } : {})}
          />
        ) : null}

        {media ? (
          <Reveal preset={animation}>
            <figure className="flex flex-col gap-3">
              <div className="overflow-hidden rounded-fx-lg border border-fx-line bg-fx-surface-2">
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

        {body ? (
          <Reveal preset={animation}>
            {/* Left-aligned regardless of `align` — see the note above. */}
            <RichText html={body} className="text-start" />
          </Reveal>
        ) : null}

        {cta ? (
          <Reveal
            preset={animation}
            className={cn('flex pt-1', align === 'center' && 'justify-center')}
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

export default ContentProse
