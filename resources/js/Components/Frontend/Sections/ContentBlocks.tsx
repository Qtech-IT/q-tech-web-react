import { useMemo } from 'react'
import { AlertTriangle, CheckCircle2, Info, StickyNote } from 'lucide-react'

import { NavIcon, isRegisteredNavIcon } from '@/Components/Public/NavIcon'
import { Section } from '@/Components/Public/Section'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import { highlightHeading } from '@/Components/Frontend/Sections/Shared/highlight'
import { Reveal } from '@/Components/Frontend/Sections/Shared/Reveal'
import { SectionHeader } from '@/Components/Frontend/Sections/Shared/SectionHeader'
import type { HeadingLevel } from '@/Components/Frontend/Sections/Shared/SectionHeader'
import { SectionMedia } from '@/Components/Frontend/Sections/Shared/SectionMedia'
import {
  readBoolean,
  readOption,
  readString,
  trimmed,
} from '@/Components/Frontend/Sections/Shared/values'
import type { CmsSectionBlock } from '@/Types/cms'
import type { SectionComponentProps } from '@/Types/sections'

const MEASURES = ['prose', 'wide'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade'] as const
const KINDS = [
  'paragraph',
  'heading',
  'list',
  'quote',
  'image',
  'code',
  'callout',
  'table',
] as const
const LEVELS = ['h2', 'h3', 'h4'] as const
const LIST_STYLES = ['bullet', 'number'] as const
const TONES = ['note', 'info', 'success', 'warning'] as const
const IMAGE_WIDTHS = ['prose', 'wide'] as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

/**
 * Callout tone → box styling + default icon.
 *
 * `border-s-2` and a wash rather than a full fill: a callout interrupts the
 * read, so it needs to be distinct without becoming the loudest thing on the
 * page. The hues come from the shared `--fx-mark-*` palette, re-tuned per theme
 * in `frontend.css`.
 */
const TONE_CLASSES = {
  note: 'border-fx-mark-ink/50 bg-fx-mark-ink/[0.06] [&_[data-callout-icon]]:text-fx-ink-soft',
  info: 'border-fx-mark-brand/60 bg-fx-mark-brand/[0.07] [&_[data-callout-icon]]:text-fx-mark-brand',
  success: 'border-fx-mark-teal/60 bg-fx-mark-teal/[0.07] [&_[data-callout-icon]]:text-fx-mark-teal',
  warning: 'border-fx-mark-amber/60 bg-fx-mark-amber/[0.08] [&_[data-callout-icon]]:text-fx-mark-amber',
} as const

const TONE_ICONS = {
  note: StickyNote,
  info: Info,
  success: CheckCircle2,
  warning: AlertTriangle,
} as const

const MEASURE_CLASSES = {
  prose: 'max-w-fx-prose',
  wide: 'max-w-4xl',
} as const

/** Paragraphs inside one text field, split on blank lines. */
function linesToParagraphs(body: string): string[] {
  return body
    .split(/\r?\n\s*\r?\n/)
    .map((part) => part.replace(/\s*\n\s*/g, ' ').trim())
    .filter((part) => part !== '')
}

/** List items — one per non-empty line. */
function linesToItems(body: string): string[] {
  return body
    .split(/\r?\n/)
    .map((line) => line.replace(/^\s*[-*•]\s+/, '').trim())
    .filter((line) => line !== '')
}

/** Table rows — one per line, cells split on an unescaped pipe. */
function parseTable(body: string): string[][] {
  return body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '')
    .map((line) =>
      line
        .replace(/^\||\|$/g, '')
        .split('|')
        .map((cell) => cell.trim())
    )
}

/** A block worth rendering — has text, or (for an image) a picture. */
function isRenderable(block: CmsSectionBlock, kind: string): boolean {
  if (kind === 'image') {
    return Boolean(block.media?.url)
  }

  if (kind === 'heading') {
    return Boolean(trimmed(block.label))
  }

  return Boolean(trimmed(block.body))
}

function ContentBlock({ block }: { block: CmsSectionBlock }) {
  const kind = readOption(block.settings, 'kind', KINDS, 'paragraph')

  if (!isRenderable(block, kind)) {
    return null
  }

  const label = trimmed(block.label)
  const body = trimmed(block.body) ?? ''

  if (kind === 'heading') {
    const level = readOption(block.settings, 'level', LEVELS, 'h2')
    const Tag = level

    return <Tag>{label}</Tag>
  }

  if (kind === 'list') {
    const style = readOption(block.settings, 'list_style', LIST_STYLES, 'bullet')
    const items = linesToItems(body)
    const ListTag = style === 'number' ? 'ol' : 'ul'

    return (
      <ListTag>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ListTag>
    )
  }

  if (kind === 'quote') {
    return (
      <blockquote>
        {linesToParagraphs(body).map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
        {label ? <cite>{label}</cite> : null}
      </blockquote>
    )
  }

  if (kind === 'code') {
    return (
      <figure>
        {label ? (
          <figcaption className="!mb-0 !mt-0 rounded-t-fx-md border border-b-0 border-fx-line bg-fx-surface-2 px-4 py-1.5 font-mono text-fx-meta text-fx-ink-faint">
            {label}
          </figcaption>
        ) : null}
        <pre className={cn(label && '!mt-0 !rounded-t-none')}>
          <code>{body}</code>
        </pre>
      </figure>
    )
  }

  if (kind === 'table') {
    const rows = parseTable(body)
    const hasHeader = readBoolean(block.settings, 'table_header', true) && rows.length > 1
    const headRow = hasHeader ? rows[0] : null
    const bodyRows = hasHeader ? rows.slice(1) : rows

    return (
      <table>
        {label ? <caption>{label}</caption> : null}
        {headRow ? (
          <thead>
            <tr>
              {headRow.map((cell, index) => (
                <th key={index} scope="col">
                  {cell}
                </th>
              ))}
            </tr>
          </thead>
        ) : null}
        <tbody>
          {bodyRows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    )
  }

  if (kind === 'image') {
    const width = readOption(block.settings, 'media_width', IMAGE_WIDTHS, 'prose')
    const caption = trimmed(block.description)

    return (
      <figure
        className={cn(
          width === 'wide' && 'lg:-mx-16 xl:-mx-24',
          '!my-fx-stack-md'
        )}
      >
        <div className="overflow-hidden rounded-fx-lg border border-fx-line bg-fx-surface-2">
          <SectionMedia
            media={block.media}
            fallbackRatio="16 / 9"
            mediaClassName="h-full w-full object-cover"
          />
        </div>
        {caption ? <figcaption>{caption}</figcaption> : null}
      </figure>
    )
  }

  if (kind === 'callout') {
    const tone = readOption(block.settings, 'tone', TONES, 'note')
    const Icon = TONE_ICONS[tone]
    const icon = block.icon ?? undefined

    return (
      <div
        className={cn(
          'not-prose my-fx-stack-md flex gap-3 rounded-fx-lg border-s-2 p-4',
          TONE_CLASSES[tone]
        )}
      >
        <span data-callout-icon className="mt-0.5 shrink-0">
          {isRegisteredNavIcon(icon) ? (
            <NavIcon name={icon} className="size-5" />
          ) : (
            <Icon className="size-5" />
          )}
        </span>

        <div className="flex flex-col gap-1">
          {label ? (
            <p className="text-fx-body font-semibold text-fx-ink">{label}</p>
          ) : null}
          {linesToParagraphs(body).map((paragraph, index) => (
            <p key={index} className="text-fx-body-sm text-pretty text-fx-ink-soft">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    )
  }

  // paragraph
  return (
    <>
      {linesToParagraphs(body).map((paragraph, index) => (
        <p key={index}>{paragraph}</p>
      ))}
    </>
  )
}

/**
 * Article Body — long-form content as an ordered list of typed blocks.
 *
 * WHY. A blog post and a policy page are documents, and they used to be a
 * `content.prose` rich-text field. Rich text on this site stores the editor's
 * own classes into the HTML which the renderer then strips, so the published
 * page never matched the editor and a pasted design came out flattened. Here
 * the structure is DATA — one `kind` per block — and every block renders as
 * clean semantic HTML styled by `.fx-prose`, the site's own token-driven
 * element stylesheet. Nothing is pasted, so nothing is stripped.
 *
 * ORDERING. The blocks render in `sort_order`, whatever their kind — a heading,
 * two paragraphs, a list, another heading — because a document is one stream.
 *
 * MEASURE. `prose` clamps the column near 72 characters; `wide` suits a page
 * of tables. An `image` block set to "wider than the text" bleeds past the
 * measure on large screens only. `callout` opts out of `.fx-prose` with
 * `not-prose` so its own box styling wins.
 *
 * Renders `null` when there is neither a header nor one renderable block.
 */
export function ContentBlocks({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const measure = readOption(settings, 'measure', MEASURES, 'prose')
  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'default')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'none')

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const highlight = readString(section.data, 'heading_highlight')

  const blocks = useMemo(
    () =>
      (section.blocks ?? [])
        .filter(
          (block) => block.block_type === 'block' && block.parent_id === null
        )
        .sort((a, b) => a.sort_order - b.sort_order),
    [section.blocks]
  )

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)
  const renderable = blocks.filter((block) =>
    isRenderable(block, readOption(block.settings, 'kind', KINDS, 'paragraph'))
  )

  if (!hasHeader && renderable.length === 0) {
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
        : { 'aria-label': t('Article content') })}
    >
      <div className={cn('flex flex-col gap-fx-stack-lg', MEASURE_CLASSES[measure])}>
        {hasHeader ? (
          <SectionHeader
            eyebrow={eyebrow}
            heading={headingNode}
            subheading={subheading}
            headingLevel={sectionHeadingLevel}
            headingSize={sectionHeadingLevel}
            align="start"
            preset={animation}
            {...(headingId ? { headingId } : {})}
          />
        ) : null}

        {renderable.length > 0 ? (
          <Reveal preset={animation} className="fx-prose">
            {renderable.map((block) => (
              <ContentBlock key={block.uuid} block={block} />
            ))}
          </Reveal>
        ) : null}
      </div>
    </Section>
  )
}

export default ContentBlocks
