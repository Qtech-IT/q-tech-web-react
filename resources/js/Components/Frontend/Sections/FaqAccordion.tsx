import { useMemo } from 'react'
import { Plus } from 'lucide-react'

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

const LAYOUTS = ['stacked', 'split'] as const
const ALIGNMENTS = ['center', 'start'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const
const ACCENTS = ['brand', 'ink', 'amber', 'teal', 'violet', 'rose'] as const

type Accent = (typeof ACCENTS)[number]

/** Cycled by position when a row has no `settings.accent`, as everywhere. */
const ACCENT_CYCLE = ['brand', 'teal', 'violet', 'amber', 'rose', 'ink'] as const

function cycledAccent(index: number): Accent {
  return ACCENT_CYCLE[index % ACCENT_CYCLE.length] as Accent
}

/*
 * Static class maps, indexed by values `readOption` has already constrained —
 * Tailwind scans source text, so none of these may be built at runtime.
 */

/** The topic pill. Hue as ink on a wash of itself. */
const PILL_CLASSES = {
  brand: 'bg-fx-mark-brand/12 text-fx-mark-brand',
  ink: 'bg-fx-mark-ink/10 text-fx-mark-ink',
  amber: 'bg-fx-mark-amber/12 text-fx-mark-amber',
  teal: 'bg-fx-mark-teal/12 text-fx-mark-teal',
  violet: 'bg-fx-mark-violet/12 text-fx-mark-violet',
  rose: 'bg-fx-mark-rose/12 text-fx-mark-rose',
} as const

/** The +/× marker at the end of the row. */
const MARKER_CLASSES = {
  brand: 'text-fx-mark-brand',
  ink: 'text-fx-mark-ink',
  amber: 'text-fx-mark-amber',
  teal: 'text-fx-mark-teal',
  violet: 'text-fx-mark-violet',
  rose: 'text-fx-mark-rose',
} as const

/** The rail down the open row's left edge. */
const RAIL_CLASSES = {
  brand: 'group-open/row:bg-fx-mark-brand',
  ink: 'group-open/row:bg-fx-mark-ink',
  amber: 'group-open/row:bg-fx-mark-amber',
  teal: 'group-open/row:bg-fx-mark-teal',
  violet: 'group-open/row:bg-fx-mark-violet',
  rose: 'group-open/row:bg-fx-mark-rose',
} as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

function rowPreset(animation: (typeof ANIMATIONS)[number]) {
  return animation === 'rise' ? 'stagger' : animation
}

/** A row worth rendering — has a question, an answer, or both. */
function hasContent(block: CmsSectionBlock): boolean {
  return Boolean(trimmed(block.label) || trimmed(block.body))
}

/**
 * One question.
 *
 * BUILT ON `<details>` / `<summary>`, NOT ON THE RADIX ACCORDION
 * -------------------------------------------------------------
 * Three things follow from that choice and all three are the reason for it:
 *
 *  1. **The answer is always in the DOM.** Radix unmounts a closed panel, so
 *     on a page with no SSR every answer would be invisible to a crawler —
 *     which defeats the point of publishing an FAQ.
 *  2. **Keyboard and screen-reader support are the browser's.** `summary` is
 *     natively focusable, toggles on Enter and Space, and exposes its
 *     expanded state without a single ARIA attribute of ours to get wrong.
 *  3. **It works before the JavaScript does**, and in the CMS preview pane,
 *     where a hydration failure would otherwise leave a dead list.
 *
 * `name` is what makes an exclusive accordion: browsers that support it close
 * the open sibling automatically. Older ones simply allow two open at once —
 * the degradation is "both answers are readable", which is the behaviour the
 * `exclusive` setting is off by default to get anyway.
 */
function FaqRow({
  block,
  index,
  preset,
  open,
  exclusiveName,
  headingLevel,
}: {
  block: CmsSectionBlock
  index: number
  preset: 'none' | 'fade' | 'stagger'
  open: boolean
  /** Shared `name`, or `undefined` when several answers may stay open. */
  exclusiveName: string | undefined
  headingLevel: 'h2' | 'h3'
}) {
  const question = trimmed(block.label)
  const answer = trimmed(block.body)
  const topic = readString(block.data, 'topic')
  const accent = readOption(block.settings, 'accent', ACCENTS, cycledAccent(index))
  const Heading = headingLevel

  return (
    <Reveal as="li" preset={preset} index={index}>
      <details
        className={cn(
          'group/row relative overflow-hidden rounded-fx-lg border border-fx-line',
          'bg-fx-surface transition-[border-color,box-shadow] duration-300 ease-fx',
          'hover:border-fx-accent-line open:shadow-fx-2',
          'has-[summary:focus-visible]:border-fx-accent-line',
          'motion-reduce:transition-none'
        )}
        {...(exclusiveName ? { name: exclusiveName } : {})}
        {...(open ? { open: true } : {})}
      >
        {/* The rail. Neutral while closed so the list reads as one column of
            rows, and it only takes the row's hue once the answer is showing —
            colour marking state rather than decorating every row at rest. */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-y-0 left-0 w-1 bg-transparent',
            'transition-colors duration-300 ease-fx motion-reduce:transition-none',
            RAIL_CLASSES[accent]
          )}
        />

        <summary
          className={cn(
            'flex cursor-pointer list-none items-start gap-4 py-5 pr-5 pl-6',
            'outline-none focus-visible:outline-2 focus-visible:-outline-offset-2',
            'focus-visible:outline-fx-focus',
            // Safari still paints its own disclosure triangle without this.
            '[&::-webkit-details-marker]:hidden'
          )}
        >
          <Heading className="flex-1 text-fx-body font-semibold text-pretty text-fx-ink">
            {question}
          </Heading>

          {topic ? (
            <span
              className={cn(
                'mt-0.5 hidden shrink-0 rounded-fx-pill px-2.5 py-1',
                'text-fx-meta font-semibold sm:inline-block',
                PILL_CLASSES[accent]
              )}
            >
              {topic}
            </span>
          ) : null}

          {/* One glyph, rotated 45° when open: a `+` becomes an `×` with no
              second icon to download and no icon swap to mis-time. */}
          <Plus
            aria-hidden="true"
            className={cn(
              'mt-0.5 size-5 shrink-0 transition-transform duration-300 ease-fx',
              'group-open/row:rotate-45 motion-reduce:transition-none',
              MARKER_CLASSES[accent]
            )}
          />
        </summary>

        {answer ? (
          <div className="fx-panel-in pr-5 pb-5 pl-6">
            <p className="max-w-[68ch] text-fx-body-sm text-pretty text-fx-ink-soft">
              {answer}
            </p>
          </div>
        ) : null}
      </details>
    </Reveal>
  )
}

/**
 * The FAQ band.
 *
 * `split` keeps the headline and the "still stuck?" button pinned beside the
 * list on large screens, which is where a reader who did not find their
 * question needs them — the stacked variant buries that button below however
 * many questions the editor added.
 *
 * Renders `null` when there is neither a header, nor a button, nor one
 * question with something in it.
 */
export function FaqAccordion({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const layout = readOption(settings, 'layout', LAYOUTS, 'split')
  const align = readOption(settings, 'align', ALIGNMENTS, 'center')
  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'lg')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'stagger')
  const openFirst = readBoolean(settings, 'open_first', true)
  const exclusive = readBoolean(settings, 'exclusive', false)

  const preset = rowPreset(animation)
  const headerPreset = animation === 'stagger' ? 'fade' : preset

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const highlight = readString(section.data, 'heading_highlight')
  const footnote = readString(section.data, 'footnote')
  const cta = section.cta ?? null

  const questions = useMemo(
    () => blocksOfType(section.blocks, 'question').filter(hasContent),
    [section.blocks]
  )

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)

  if (!hasHeader && !cta && questions.length === 0) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  const sectionHeadingLevel: HeadingLevel = index === 0 ? 'h1' : 'h2'
  const rowHeadingLevel: 'h2' | 'h3' = heading
    ? sectionHeadingLevel === 'h1'
      ? 'h2'
      : 'h3'
    : 'h2'
  const split = layout === 'split'
  const centered = !split && align === 'center'

  // Scoped to the section's uuid so two FAQ bands on one page do not close
  // each other's answers — `name` is document-global, like a radio group.
  const exclusiveName = exclusive ? `faq-${section.uuid}` : undefined

  const header = hasHeader ? (
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
  ) : null

  const list =
    questions.length > 0 ? (
      <ul className="flex flex-col gap-3">
        {questions.map((question, position) => (
          <FaqRow
            key={question.uuid}
            block={question}
            index={position}
            preset={preset}
            open={openFirst && position === 0}
            exclusiveName={exclusiveName}
            headingLevel={rowHeadingLevel}
          />
        ))}
      </ul>
    ) : null

  const button = cta ? (
    <Reveal
      preset={headerPreset}
      className={cn(
        'flex',
        split ? 'justify-start' : centered ? 'justify-center' : 'justify-start'
      )}
    >
      <SectionCta
        cta={cta}
        size="lg"
        fallbackVariant="outline"
        buttonClassName={fxButton({ tone: 'outline', scale: 'lg' })}
      />
    </Reveal>
  ) : null

  const note = footnote ? (
    <p
      className={cn(
        'text-fx-meta text-fx-ink-faint',
        !split && centered && 'text-center'
      )}
    >
      {footnote}
    </p>
  ) : null

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Frequently asked questions') })}
    >
      {split ? (
        <div className="grid gap-fx-stack-xl lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-12">
          {/*
           * `self-start` is what makes `sticky` do anything: a grid item
           * stretches to the row height by default, so a stretched box has
           * nothing left to scroll within and the header would sit still.
           */}
          <div className="flex flex-col gap-fx-stack-md self-start lg:sticky lg:top-24">
            {header}
            {button}
            {note}
          </div>

          <div className="flex flex-col gap-fx-stack-md">{list}</div>
        </div>
      ) : (
        <div className="flex flex-col gap-fx-stack-xl">
          {header}
          <div className="mx-auto w-full max-w-3xl">{list}</div>
          {note}
          {button}
        </div>
      )}
    </Section>
  )
}

export default FaqAccordion
