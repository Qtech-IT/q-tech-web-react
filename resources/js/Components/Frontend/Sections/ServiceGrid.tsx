import { useMemo } from 'react'
import { Layers } from 'lucide-react'

import { NavIcon, isRegisteredNavIcon } from '@/Components/Public/NavIcon'
import { Section } from '@/Components/Public/Section'
import { SafeImage } from '@/Components/UI/SafeImage'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import { blocksOfType } from '@/Components/Frontend/Sections/Shared/blocks'
import { Reveal } from '@/Components/Frontend/Sections/Shared/Reveal'
import { SectionCta } from '@/Components/Frontend/Sections/Shared/SectionCta'
import { SectionHeader } from '@/Components/Frontend/Sections/Shared/SectionHeader'
import type { HeadingLevel } from '@/Components/Frontend/Sections/Shared/SectionHeader'
import { readOption, readString, trimmed } from '@/Components/Frontend/Sections/Shared/values'
import type { CmsSectionBlock } from '@/Types/cms'
import type { SectionComponentProps } from '@/Types/sections'

const COLUMNS = ['2', '3', '4'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const

/**
 * Static class map, indexed by a value `readOption` has already constrained.
 * Tailwind scans source text for class names, so a template literal here
 * would compile to nothing — see `StatsCounter.COLUMN_CLASSES` for the same
 * rule applied to the same problem.
 */
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

/**
 * The text-link treatment for the "see all" CTA. Not a filled/outlined skin —
 * `Button`'s own `link` variant sizing is neutralised (`h-auto`, no padding)
 * so this reads as inline text with an underline, not a button.
 */
const SEE_ALL_CLASS = cn(
  'h-auto gap-2 whitespace-normal px-0 py-0 text-fx-label font-medium text-fx-ink',
  'underline-offset-4 hover:underline hover:text-fx-accent-text',
  'transition-colors duration-200 ease-fx motion-reduce:transition-none'
)

/**
 * `stat.counter`'s presets map straight onto Reveal; this grid additionally
 * needs the header and the "see all" link to move together as one unit while
 * the cards stagger separately, so `rise` is treated as `stagger` for the
 * cards the same way HeroSplit treats it for its own rows.
 */
function cardPreset(animation: (typeof ANIMATIONS)[number]) {
  return animation === 'rise' ? 'stagger' : animation
}

/**
 * `data.tags`, split into pills.
 *
 * A plain comma-separated string, not a repeater — see ServiceGridType's
 * doc comment. Never markup: split on commas only, trim, and drop empties so
 * a trailing "React, " does not render a blank pill.
 */
function tagsOf(block: CmsSectionBlock): string[] {
  const raw = readString(block.data, 'tags')

  if (!raw) {
    return []
  }

  return raw
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag !== '')
}

/** A repeater row worth rendering — has a title, a description, or both. */
function hasContent(block: CmsSectionBlock): boolean {
  return Boolean(trimmed(block.label) || trimmed(block.description))
}

/**
 * One capability card — icon mark, title, description, tag pills.
 *
 * `block` is guaranteed non-empty by the caller's filter, so this never
 * itself decides whether to render — only how.
 */
function ServiceCard({
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
  const description = trimmed(block.description)
  const tags = useMemo(() => tagsOf(block), [block])
  const media = block.media ?? null
  const Heading = headingLevel

  return (
    <Reveal
      as="li"
      preset={preset}
      index={index}
      className={cn(
        'group relative flex flex-col gap-4 rounded-fx-lg border border-fx-line bg-fx-surface p-6',
        'transition-[border-color,box-shadow,transform] duration-300 ease-fx',
        'hover:-translate-y-1 hover:border-fx-accent-line hover:shadow-fx-3',
        'motion-reduce:transition-none motion-reduce:hover:translate-y-0'
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          'flex size-10 shrink-0 items-center justify-center rounded-fx-md',
          'bg-fx-accent-soft text-fx-accent-text',
          'transition-transform duration-300 ease-fx group-hover:scale-105',
          'motion-reduce:transition-none motion-reduce:group-hover:scale-100'
        )}
      >
        {media?.url ? (
          <SafeImage
            src={media.url}
            alt=""
            width={24}
            height={24}
            className="size-5 object-contain"
          />
        ) : isRegisteredNavIcon(block.icon ?? undefined) ? (
          <NavIcon name={block.icon ?? undefined} className="size-5" />
        ) : (
          <Layers className="size-5" />
        )}
      </div>

      <div className="flex flex-col gap-2">
        {label ? (
          <Heading className="text-fx-subheading font-semibold text-fx-ink">
            {label}
          </Heading>
        ) : null}

        {description ? (
          <p className="text-fx-body-sm text-pretty text-fx-ink-soft">
            {description}
          </p>
        ) : null}
      </div>

      {tags.length > 0 ? (
        <ul className="mt-auto flex flex-wrap gap-2 pt-1">
          {tags.map((tag, position) => (
            <li
              key={`${tag}-${position}`}
              className="rounded-fx-pill border border-fx-line px-3 py-1 text-fx-meta text-fx-ink-soft"
            >
              {tag}
            </li>
          ))}
        </ul>
      ) : null}
    </Reveal>
  )
}

/**
 * A heading with a "see all" link, followed by a grid of capability cards.
 *
 * HEADER — eyebrow/heading/subheading on the left, the "see all" link on the
 * right, baseline-aligned with the heading at `lg` and dropping beneath it on
 * a narrow viewport. The link is optional: a grid with no destination page
 * yet still renders correctly with just the heading.
 *
 * GRID — 1 column under `sm`, `settings.columns` (2–4) from `sm` up. Cards
 * carry their own border and background rather than the section painting a
 * shared panel behind them, so the grid reads as a set of equal, comparable
 * items — the same reasoning `StatsCounter` uses a hairline rule instead of
 * cards, applied in the other direction because this section's whole point
 * is that each discipline is a distinct, ownable thing.
 *
 * HEADING ORDER — a card's title is one level below whatever heading actually
 * rendered above it: `h3` under the section's `h2`, `h2` under its `h1`, and
 * `h2` again when no section heading rendered at all (an editor cleared it but
 * kept cards) so the outline never skips a level in either direction.
 *
 * MOTION — the header rises once on scroll-into-view, honouring the same
 * `none`/`fade`/`stagger` choice as the cards; the cards stagger in as a set,
 * capped at 12 items deep by the registry's `max`, so the stagger step (70ms,
 * from `Reveal`) never produces a multi-second cascade.
 *
 * Renders `null` when there is neither a header nor a single filled-in card —
 * the section's live state on a fresh install, and also an editor's
 * in-progress row that has no title or description yet.
 */
export function ServiceGrid({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const columns = readOption(settings, 'columns', COLUMNS, '3')
  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'default')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'stagger')
  const preset = cardPreset(animation)
  const headerPreset = animation === 'stagger' ? 'fade' : preset

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const cta = section.cta ?? null

  const services = useMemo(
    () => blocksOfType(section.blocks, 'service').filter(hasContent),
    [section.blocks]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)

  if (!hasHeader && services.length === 0) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  /** Position 0 owns the page's single `h1`; every other section starts at `h2`. */
  const sectionHeadingLevel: HeadingLevel = index === 0 ? 'h1' : 'h2'
  const cardHeadingLevel: 'h2' | 'h3' = heading
    ? sectionHeadingLevel === 'h1'
      ? 'h2'
      : 'h3'
    : 'h2'

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('What we do') })}
    >
      <div className="flex flex-col gap-fx-stack-xl">
        {hasHeader ? (
          <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
            <SectionHeader
              eyebrow={eyebrow}
              heading={heading}
              subheading={subheading}
              headingLevel={sectionHeadingLevel}
              headingSize={sectionHeadingLevel}
              preset={headerPreset}
              className="max-w-3xl"
              {...(headingId ? { headingId } : {})}
            />

            {cta ? (
              <Reveal preset={headerPreset} className="shrink-0">
                <SectionCta
                  cta={cta}
                  fallbackVariant="link"
                  buttonClassName={SEE_ALL_CLASS}
                />
              </Reveal>
            ) : null}
          </div>
        ) : null}

        {services.length > 0 ? (
          <ul
            className={cn('grid grid-cols-1 gap-5', COLUMN_CLASSES[columns])}
          >
            {services.map((service, position) => (
              <ServiceCard
                key={service.uuid}
                block={service}
                index={position}
                preset={preset}
                headingLevel={cardHeadingLevel}
              />
            ))}
          </ul>
        ) : null}
      </div>
    </Section>
  )
}

export default ServiceGrid
