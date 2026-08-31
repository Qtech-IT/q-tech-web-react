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

const ACCENTS = ['brand', 'ink', 'amber', 'teal', 'violet', 'rose'] as const

/**
 * The fallback hue order, used when a card has no `data.accent` of its own.
 *
 * Every card defaulting to one colour would make the tile decoration rather
 * than identification — six identical marks tell a visitor nothing. So the
 * default is the card's POSITION in the grid, cycling through the palette,
 * which means a grid seeded before this field existed (and one an editor
 * simply never touched) still reads as a set of distinguishable cards.
 *
 * The order is not `ACCENTS`': it alternates warm/neutral/cool so that no two
 * adjacent cards — in a 2, 3 or 4 column layout — sit on neighbouring hues.
 * An explicit `data.accent` always wins over this.
 */
const ACCENT_CYCLE = ['amber', 'ink', 'brand', 'teal', 'violet', 'rose'] as const

type Accent = (typeof ACCENTS)[number]

/**
 * The hue a card at `index` gets when it has none of its own. Wrapping keeps
 * this total for any position, including the 7th card in a 6-hue palette.
 */
function cycledAccent(index: number): Accent {
  return ACCENT_CYCLE[index % ACCENT_CYCLE.length] as Accent
}
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

/**
 * The icon tile fill per `data.accent`, indexed by a value `readOption` has
 * already constrained. Two classes rather than one because the glyph ink is
 * a separate token from the fill — `brand` and `ink` follow the site's accent
 * and ink, so their legible-on-top colour cannot be shared with the four
 * literal hues (see `--fx-mark-*` in `frontend.css`).
 */
const MARK_CLASSES = {
  brand: 'bg-fx-mark-brand text-fx-mark-brand-glyph',
  ink: 'bg-fx-mark-ink text-fx-mark-ink-glyph',
  amber: 'bg-fx-mark-amber text-fx-mark-glyph',
  teal: 'bg-fx-mark-teal text-fx-mark-glyph',
  violet: 'bg-fx-mark-violet text-fx-mark-glyph',
  rose: 'bg-fx-mark-rose text-fx-mark-glyph',
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
 *
 * SURFACE — a filled panel with no hairline at rest. The fill alone is what
 * separates the card from the canvas, which is what lets the icon tile be the
 * only saturated thing in the card and therefore the thing the eye lands on
 * first. The hairline arrives on hover instead of being spent at rest.
 *
 * MARK — a solid tile in the card's own hue (`data.accent`), sized well above
 * the text so a scan of the grid reads as six distinct marks before it reads
 * as six paragraphs.
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
  const accent = readOption(block.data, 'accent', ACCENTS, cycledAccent(index))
  const media = block.media ?? null
  const Heading = headingLevel

  return (
    /*
     * The `li` is the hover TARGET and carries no transform of its own; the
     * panel inside it is what lifts. That split is the fix for a real bug, not
     * tidiness: when the hovered element moves ITSELF, its hit box moves with
     * it, so a pointer resting in the bottom few pixels of the card fell
     * outside the lifted box, `:hover` went false, the card dropped back under
     * the pointer, `:hover` went true — and the card shook at frame rate with
     * the cursor flickering between states. A child's transform never changes
     * its parent's layout box, so the `li` stays exactly where the pointer
     * found it however far the panel travels.
     */
    <Reveal
      as="li"
      preset={preset}
      index={index}
      className="group relative flex"
    >
      <div
        className={cn(
          'flex flex-1 flex-col gap-5 rounded-fx-xl border border-transparent bg-fx-surface-2 p-6 sm:p-7',
          'transition-[border-color,background-color,box-shadow,transform] duration-300 ease-fx',
          'group-hover:-translate-y-1 group-hover:border-fx-accent-line group-hover:bg-fx-surface group-hover:shadow-fx-3',
          'motion-reduce:transition-none motion-reduce:group-hover:translate-y-0'
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            'flex size-13 shrink-0 items-center justify-center rounded-fx-md sm:size-14',
            MARK_CLASSES[accent],
            'transition-transform duration-300 ease-fx group-hover:-translate-y-0.5 group-hover:scale-105',
            'motion-reduce:transition-none motion-reduce:group-hover:translate-y-0 motion-reduce:group-hover:scale-100'
          )}
        >
          {media?.url ? (
            <SafeImage
              src={media.url}
              alt=""
              width={32}
              height={32}
              className="size-7 object-contain"
            />
          ) : isRegisteredNavIcon(block.icon ?? undefined) ? (
            <NavIcon name={block.icon ?? undefined} className="size-7" />
          ) : (
            <Layers className="size-7" />
          )}
        </div>

        <div className="flex flex-col gap-2">
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
        </div>

        {tags.length > 0 ? (
          <ul className="mt-auto flex flex-wrap gap-2 pt-1">
            {tags.map((tag, position) => (
              <li
                key={`${tag}-${position}`}
                className={cn(
                  'rounded-fx-pill border border-fx-accent-line bg-fx-surface px-3 py-1',
                  'text-fx-meta font-medium text-fx-accent-text',
                  'transition-colors duration-200 ease-fx',
                  'hover:border-fx-accent hover:bg-fx-accent-soft',
                  'motion-reduce:transition-none'
                )}
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}
      </div>
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
 * carry their own fill rather than the section painting a shared panel behind
 * them, so the grid reads as a set of equal, comparable items — the same
 * reasoning `StatsCounter` uses a hairline rule instead of cards, applied in
 * the other direction because this section's whole point is that each
 * discipline is a distinct, ownable thing.
 *
 * COLOUR — each card's icon tile carries its own hue from `data.accent`,
 * falling back to its position in `ACCENT_CYCLE`, and it is the only saturated
 * element in the card. That is deliberate: hue is doing identification work
 * (six marks, told apart at a glance), not decoration, so nothing else in the
 * card competes for it.
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
