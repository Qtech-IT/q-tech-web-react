import { useMemo } from 'react'

import { blocksOfType } from '@/Components/Frontend/Sections/Shared/blocks'
import { highlightHeading } from '@/Components/Frontend/Sections/Shared/highlight'
import { Reveal } from '@/Components/Frontend/Sections/Shared/Reveal'
import { SectionCta } from '@/Components/Frontend/Sections/Shared/SectionCta'
import { SectionMedia } from '@/Components/Frontend/Sections/Shared/SectionMedia'
import {
  readOption,
  readString,
  trimmed,
} from '@/Components/Frontend/Sections/Shared/values'
import { fxButton } from '@/Components/Public/fxButton'
import { NavIcon, isRegisteredNavIcon } from '@/Components/Public/NavIcon'
import { Section } from '@/Components/Public/Section'
import { useTranslations } from '@/Hooks/useTranslations'
import type { CmsSectionBlock } from '@/Types/cms'
import type { SectionComponentProps } from '@/Types/sections'
import { cn } from '@/Utils/helpers'

const SIDES = ['left', 'right'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const
const ACCENTS = ['brand', 'ink', 'amber', 'teal', 'violet', 'rose'] as const

type Accent = (typeof ACCENTS)[number]

/** Cycled by position when a step has no `settings.accent`, as everywhere. */
const ACCENT_CYCLE = ['brand', 'teal', 'violet', 'amber', 'rose', 'ink'] as const

function cycledAccent(index: number): Accent {
  return ACCENT_CYCLE[index % ACCENT_CYCLE.length] as Accent
}

/*
 * Static class maps, indexed by values `readOption` has already constrained.
 * Tailwind scans source text, so none of these may be built at runtime.
 */

/** The marker on the rule: hue as ink, on a wash of itself, inside a ring. */
const MARKER_CLASSES = {
  brand: 'border-fx-mark-brand/40 bg-fx-mark-brand/12 text-fx-mark-brand',
  ink: 'border-fx-mark-ink/35 bg-fx-mark-ink/10 text-fx-mark-ink',
  amber: 'border-fx-mark-amber/40 bg-fx-mark-amber/12 text-fx-mark-amber',
  teal: 'border-fx-mark-teal/40 bg-fx-mark-teal/12 text-fx-mark-teal',
  violet: 'border-fx-mark-violet/40 bg-fx-mark-violet/12 text-fx-mark-violet',
  rose: 'border-fx-mark-rose/40 bg-fx-mark-rose/12 text-fx-mark-rose',
} as const

/** The "Step 01" line above each title. */
const NUMBER_CLASSES = {
  brand: 'text-fx-mark-brand',
  ink: 'text-fx-mark-ink',
  amber: 'text-fx-mark-amber',
  teal: 'text-fx-mark-teal',
  violet: 'text-fx-mark-violet',
  rose: 'text-fx-mark-rose',
} as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

function stepPreset(animation: (typeof ANIMATIONS)[number]) {
  return animation === 'rise' ? 'stagger' : animation
}

/** A row worth rendering — has a title, a description, or both. */
function hasContent(block: CmsSectionBlock): boolean {
  return Boolean(trimmed(block.label) || trimmed(block.description))
}

/**
 * One step: a marker on the rule, then a card.
 *
 * THE RULE IS DRAWN PER STEP, not once behind the list. A single absolutely
 * positioned line would have to know where the first and last markers are,
 * which means measuring them; giving each step a dashed segment that grows to
 * fill the space beneath its own marker gets the same picture from flexbox
 * alone, and it stays correct when a card is two lines taller than its
 * neighbour. The last step draws no segment, so the rule ends ON the final
 * marker rather than trailing off the bottom of the section.
 *
 * THE NUMBER IS THE POSITION, never a stored value — reordering rows in the
 * admin renumbers the timeline, so a "Step 4, Step 2, Step 3" is structurally
 * impossible.
 */
function ProcessStep({
  block,
  index,
  total,
  stepWord,
  preset,
  headingLevel,
}: {
  block: CmsSectionBlock
  index: number
  total: number
  stepWord?: string | undefined
  preset: 'none' | 'fade' | 'stagger'
  headingLevel: 'h3' | 'h4'
}) {
  const title = trimmed(block.label)
  const description = trimmed(block.description)
  const accent = readOption(block.settings, 'accent', ACCENTS, cycledAccent(index))
  const Heading = headingLevel

  const number = String(index + 1).padStart(2, '0')
  const isLast = index === total - 1

  return (
    <Reveal as="li" preset={preset} index={index} className="group flex gap-5 sm:gap-6">
      <div className="flex flex-col items-center" aria-hidden="true">
        <span
          className={cn(
            'flex size-11 shrink-0 items-center justify-center rounded-full border',
            MARKER_CLASSES[accent],
            'transition-transform duration-300 ease-fx group-hover:scale-110',
            'motion-reduce:transition-none motion-reduce:group-hover:scale-100'
          )}
        >
          {isRegisteredNavIcon(block.icon ?? undefined) ? (
            <NavIcon name={block.icon ?? undefined} className="size-5" />
          ) : (
            <span className="fx-numerals text-fx-label font-semibold">{number}</span>
          )}
        </span>

        {/* The dashed segment to the next marker. Grows to whatever height
            this step's card turns out to be. */}
        {!isLast ? (
          <span className="mt-2 w-px flex-1 border-l border-dashed border-fx-line-strong" />
        ) : null}
      </div>

      <div
        className={cn(
          'mb-6 flex-1 rounded-fx-xl border border-fx-line bg-fx-surface p-6',
          'transition-[border-color,box-shadow] duration-300 ease-fx',
          'group-hover:border-fx-accent-line group-hover:shadow-fx-2',
          'motion-reduce:transition-none'
        )}
      >
        <p
          className={cn(
            'text-fx-eyebrow uppercase',
            NUMBER_CLASSES[accent]
          )}
        >
          {stepWord ? `${stepWord} ` : ''}
          <span className="fx-numerals">{number}</span>
        </p>

        {title ? (
          <Heading className="mt-2 text-fx-subheading font-semibold text-balance text-fx-ink">
            {title}
          </Heading>
        ) : null}

        {description ? (
          <p className="mt-2 text-fx-body-sm text-pretty text-fx-ink-soft">
            {description}
          </p>
        ) : null}
      </div>
    </Reveal>
  )
}

/**
 * Our process — a statement and a picture beside a numbered timeline.
 *
 * COMPOSITION — a split at `lg`: heading, paragraph, button and image in one
 * column, the timeline in the other, with `settings.media_side` choosing which
 * is which. Below `lg` the copy comes first and the timeline runs beneath it,
 * which is also the DOM order, so the reading order never depends on the
 * layout.
 *
 * THE IMAGE — a still, not a video. Where the reference this follows puts a
 * player with a duration badge, this puts a plain 4:5 frame: a section that
 * hosts video needs a poster, a duration, captions and a reduced-motion path,
 * and none of that is worth carrying for a decorative shot. `SectionMedia`
 * would still play one correctly if an editor picked a video asset — it
 * switches on `media_type`, not on the file extension — but nothing here
 * advertises or requires it.
 *
 * ORDER IS THE CONTENT — an `<ol>`, numbered from row position, with a dashed
 * rule joining the markers. This is the one repeater in the registry where
 * sequence is meaning rather than editor preference, and the markup says so.
 *
 * COLOUR — each step takes a hue from the shared `--fx-mark-*` palette for its
 * marker and its number. Titles and copy stay on ink tokens. The palette
 * re-tunes per theme and the `inverted` variant rebinds ink, line and surface
 * locally, so the same classes are correct on the default light page, on the
 * subtle band and on an inverted one — no `dark:` class in this file.
 *
 * Renders `null` when there is neither copy, nor a button, nor one step.
 */
export function ProcessTimeline({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const mediaSide = readOption(settings, 'media_side', SIDES, 'left')
  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'lg')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'stagger')

  const preset = stepPreset(animation)
  const copyPreset = animation === 'stagger' ? 'fade' : preset

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const paragraph = trimmed(section.subheading)
  const highlight = readString(section.data, 'heading_highlight')
  const stepWord = readString(section.data, 'step_label')
  const cta = section.cta ?? null
  const media = section.media ?? null

  const steps = useMemo(
    () => blocksOfType(section.blocks, 'step').filter(hasContent),
    [section.blocks]
  )

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const hasCopy = Boolean(eyebrow || heading || paragraph || cta || media)

  if (!hasCopy && steps.length === 0) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  const sectionHeadingLevel = index === 0 ? 'h1' : 'h2'
  const SectionHeading = sectionHeadingLevel
  const stepHeadingLevel: 'h3' | 'h4' = 'h3'

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Our process') })}
    >
      <div
        className={cn(
          'flex flex-col gap-fx-stack-xl lg:flex-row lg:items-start lg:gap-fx-stack-xl',
          mediaSide === 'right' && 'lg:flex-row-reverse'
        )}
      >
        {hasCopy ? (
          <Reveal
            preset={copyPreset}
            className="flex flex-col gap-fx-stack-md lg:w-1/2 lg:shrink-0"
          >
            {eyebrow ? (
              /* The site's own kicker — a short accent rule then the word, the
                 same mark `SectionHeader` draws everywhere else. This used to
                 be a bordered pill, which was a second eyebrow style invented
                 for one section: a page carrying this band and any other would
                 have shown two different treatments of the same element. */
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
                className="text-fx-title text-balance text-fx-ink"
              >
                {headingNode}
              </SectionHeading>
            ) : null}

            {paragraph ? (
              <p className="max-w-[52ch] text-fx-lead text-pretty text-fx-ink-soft">
                {paragraph}
              </p>
            ) : null}

            {cta ? (
              <div className="pt-1">
                <SectionCta
                  cta={cta}
                  size="lg"
                  fallbackVariant="default"
                  buttonClassName={cn(
                    fxButton({ tone: 'solid', scale: 'lg' }),
                    'rounded-fx-md px-8'
                  )}
                />
              </div>
            ) : null}

            {/* A fixed 4:3 frame with the asset filling it, rather than
                letting `SectionMedia` reserve the box from the file's own
                dimensions: this column's rhythm is set by the copy above it,
                and a portrait shot beside a landscape one would make the two
                columns disagree on where they end.

                4:3 and capped, not 4:5: at half the page measure a portrait
                frame is ~750px tall, which pushes the button far above the
                fold and leaves the timeline beside it looking short. The
                image supports the copy here — it is not the subject. */}
            {media ? (
              <div className="relative mt-2 aspect-[4/3] w-full max-w-xl overflow-hidden rounded-fx-xl border border-fx-line fx-raise-2">
                <SectionMedia media={media} fill mediaClassName="object-cover" />
              </div>
            ) : null}
          </Reveal>
        ) : null}

        {steps.length > 0 ? (
          /* `<ol>`, not `<ul>`: the numbers are not decoration, they are the
             only thing that makes step three mean anything. */
          <ol className="flex flex-1 flex-col">
            {steps.map((step, position) => (
              <ProcessStep
                key={step.uuid}
                block={step}
                index={position}
                total={steps.length}
                stepWord={stepWord}
                preset={preset}
                headingLevel={stepHeadingLevel}
              />
            ))}
          </ol>
        ) : null}
      </div>
    </Section>
  )
}

export default ProcessTimeline
