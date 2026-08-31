import { useMemo } from 'react'
import { Cpu } from 'lucide-react'

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
  readOption,
  readString,
  trimmed,
} from '@/Components/Frontend/Sections/Shared/values'
import type { CmsSectionBlock } from '@/Types/cms'
import type { SectionComponentProps } from '@/Types/sections'

const COLUMNS = ['2', '3'] as const
const ALIGNMENTS = ['center', 'start'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const
const ACCENTS = ['brand', 'ink', 'amber', 'teal', 'violet', 'rose'] as const

type Accent = (typeof ACCENTS)[number]

/** Cycled by position when a layer has no `settings.accent`, as everywhere. */
const ACCENT_CYCLE = ['violet', 'brand', 'teal', 'amber', 'rose', 'ink'] as const

function cycledAccent(index: number): Accent {
  return ACCENT_CYCLE[index % ACCENT_CYCLE.length] as Accent
}

const COLUMN_CLASSES = {
  '2': 'md:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
} as const

/** The layer's icon: full-strength hue on a wash of itself. */
const MARK_CLASSES = {
  brand: 'bg-fx-mark-brand/12 text-fx-mark-brand',
  ink: 'bg-fx-mark-ink/12 text-fx-mark-ink',
  amber: 'bg-fx-mark-amber/12 text-fx-mark-amber',
  teal: 'bg-fx-mark-teal/12 text-fx-mark-teal',
  violet: 'bg-fx-mark-violet/12 text-fx-mark-violet',
  rose: 'bg-fx-mark-rose/12 text-fx-mark-rose',
} as const

/**
 * The tool pills.
 *
 * The hue is carried by the BORDER and the label stays on ink: a pill is
 * text, so tinting the label would put every tool name on a 3:1-ish colour
 * for no gain, and a row of twenty coloured words is unreadable anyway. The
 * hue's job here is to group the pills, not to decorate each one.
 */
const PILL_CLASSES = {
  brand: 'border-fx-mark-brand/30 hover:border-fx-mark-brand/60',
  ink: 'border-fx-mark-ink/25 hover:border-fx-mark-ink/50',
  amber: 'border-fx-mark-amber/30 hover:border-fx-mark-amber/60',
  teal: 'border-fx-mark-teal/30 hover:border-fx-mark-teal/60',
  violet: 'border-fx-mark-violet/30 hover:border-fx-mark-violet/60',
  rose: 'border-fx-mark-rose/30 hover:border-fx-mark-rose/60',
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

/** A row worth rendering — has a layer name, or at least one technology. */
function hasContent(block: CmsSectionBlock): boolean {
  return Boolean(trimmed(block.label)) || itemsOf(block).length > 0
}

/**
 * One layer of the stack — icon, name, optional note, and its tools as pills.
 *
 * The card is not a link and never will be: a stack layer has no page behind
 * it. So this is the one card in the registry with no hit area, which is also
 * why it can keep a hover lift — with nothing to click, there is no pointer
 * target to move out from under the cursor.
 */
function StackCard({
  block,
  index,
  preset,
  headingLevel,
}: {
  block: CmsSectionBlock
  index: number
  preset: 'none' | 'fade' | 'stagger'
  headingLevel: 'h2' | 'h3'
}) {
  const label = trimmed(block.label)
  const note = trimmed(block.description)
  const items = useMemo(() => itemsOf(block), [block])
  const accent = readOption(block.settings, 'accent', ACCENTS, cycledAccent(index))
  const Heading = headingLevel

  return (
    <Reveal as="li" preset={preset} index={index} className="group flex">
      <div
        className={cn(
          'flex flex-1 flex-col gap-4 rounded-fx-xl border border-fx-line bg-fx-surface',
          'p-6 fx-raise-1',
          'transition-[border-color,box-shadow,transform] duration-300 ease-fx',
          'hover:-translate-y-1 hover:border-fx-accent-line hover:shadow-fx-3',
          'motion-reduce:transition-none motion-reduce:hover:translate-y-0'
        )}
      >
        <div className="flex items-center gap-3">
          <span
            aria-hidden="true"
            className={cn(
              'flex size-11 shrink-0 items-center justify-center rounded-fx-md',
              MARK_CLASSES[accent]
            )}
          >
            {isRegisteredNavIcon(block.icon ?? undefined) ? (
              <NavIcon name={block.icon ?? undefined} className="size-5" />
            ) : (
              <Cpu className="size-5" />
            )}
          </span>

          <div className="flex flex-col">
            {label ? (
              <Heading className="text-fx-body font-semibold text-fx-ink">
                {label}
              </Heading>
            ) : null}

            {note ? (
              <p className="text-fx-meta text-fx-ink-faint">{note}</p>
            ) : null}
          </div>
        </div>

        {items.length > 0 ? (
          <ul className="flex flex-wrap gap-2">
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
      </div>
    </Reveal>
  )
}

/**
 * Tech stack — one card per layer, each holding its tools as pills.
 *
 * Set in type rather than in logos: a wall of third-party trademarks is a
 * licensing question, needs an asset per tool, and goes stale the moment a
 * brand refreshes. Type costs one comma-separated field to edit and is
 * legible in both themes for free.
 *
 * COLOUR — each layer takes a hue from the shared `--fx-mark-*` palette,
 * carried by the icon and by the pill borders. Tool names stay on ink, so a
 * card with twenty pills is still a list rather than a rainbow.
 *
 * Renders `null` when there is neither a header, nor a button, nor one layer
 * with something in it.
 */
export function TechStack({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const columns = readOption(settings, 'columns', COLUMNS, '2')
  const align = readOption(settings, 'align', ALIGNMENTS, 'center')
  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'default')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'stagger')

  const preset = cardPreset(animation)
  const headerPreset = animation === 'stagger' ? 'fade' : preset

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const highlight = readString(section.data, 'heading_highlight')
  const cta = section.cta ?? null

  const layers = useMemo(
    () => blocksOfType(section.blocks, 'layer').filter(hasContent),
    [section.blocks]
  )

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)

  if (!hasHeader && !cta && layers.length === 0) {
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

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Our tech stack') })}
    >
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

        {layers.length > 0 ? (
          <ul className={cn('grid grid-cols-1 gap-5', COLUMN_CLASSES[columns])}>
            {layers.map((layer, position) => (
              <StackCard
                key={layer.uuid}
                block={layer}
                index={position}
                preset={preset}
                headingLevel={cardHeadingLevel}
              />
            ))}
          </ul>
        ) : null}

        {cta ? (
          <Reveal
            preset={headerPreset}
            className={cn('flex', centered ? 'justify-center' : 'justify-start')}
          >
            <SectionCta
              cta={cta}
              size="lg"
              fallbackVariant="outline"
              buttonClassName={fxButton({ tone: 'outline', scale: 'md' })}
            />
          </Reveal>
        ) : null}
      </div>
    </Section>
  )
}

export default TechStack
