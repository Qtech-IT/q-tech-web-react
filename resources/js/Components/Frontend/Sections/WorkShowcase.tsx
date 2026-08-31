import { useMemo } from 'react'
import { ImageOff } from 'lucide-react'

import { Section } from '@/Components/Public/Section'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import { blocksOfType } from '@/Components/Frontend/Sections/Shared/blocks'
import { Reveal } from '@/Components/Frontend/Sections/Shared/Reveal'
import { SectionCta } from '@/Components/Frontend/Sections/Shared/SectionCta'
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

const LAYOUTS = ['spotlight', 'mosaic'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const
const ACCENTS = ['brand', 'ink', 'amber', 'teal', 'violet', 'rose'] as const
const SIZES = ['wide', 'standard'] as const

type Accent = (typeof ACCENTS)[number]
type Size = (typeof SIZES)[number]

/**
 * The fallback hue order, used when a project has no `settings.accent`.
 *
 * Same reasoning as `ServiceGrid.ACCENT_CYCLE`, and deliberately the same
 * palette: a visitor scrolling from the capability grid into the portfolio
 * should read one colour system, not two. The order differs because this
 * section shows fewer, larger tiles — it opens on the brand hue (the promoted
 * project is the one that has to feel like *us*) and then alternates
 * warm/cool so no two neighbours share a temperature.
 */
const ACCENT_CYCLE = ['brand', 'amber', 'teal', 'violet', 'rose', 'ink'] as const

/**
 * The mosaic's automatic width rhythm, used when a project has no
 * `settings.size`. Four positions rather than two: `wide, standard` repeated
 * would put every wide tile in the left column and read as two ragged
 * columns, whereas `wide, standard, standard, wide` mirrors each pair and
 * gives the alternating 7/5 → 5/7 rhythm the layout is named for.
 */
const SIZE_CYCLE = ['wide', 'standard', 'standard', 'wide'] as const

/** The hue for a project at `index` that has none of its own. */
function cycledAccent(index: number): Accent {
  return ACCENT_CYCLE[index % ACCENT_CYCLE.length] as Accent
}

/** The mosaic width for a project at `index` that has none of its own. */
function cycledSize(index: number): Size {
  return SIZE_CYCLE[index % SIZE_CYCLE.length] as Size
}

/*
 * Static class maps, indexed by values `readOption` has already constrained —
 * Tailwind scans source text, so a template literal here would compile to
 * nothing. Every hue below is `--fx-mark-*` from `frontend.css`, which is
 * re-tuned per theme, so none of these needs a `dark:` branch: the same class
 * is a deep amber on white and a lifted amber on near-black.
 *
 * All four uses are DECORATIVE — a glow, a wash, a hairline, a sheen. Nothing
 * legible is ever painted in a mark hue, which is what lets the section be
 * this colourful and still hold AA on every text pairing.
 */

/** The bloom behind a project frame. Blurred, so alpha does all the work. */
const GLOW_CLASSES = {
  brand: 'bg-fx-mark-brand/30',
  ink: 'bg-fx-mark-ink/20',
  amber: 'bg-fx-mark-amber/30',
  teal: 'bg-fx-mark-teal/30',
  violet: 'bg-fx-mark-violet/30',
  rose: 'bg-fx-mark-rose/30',
} as const

/**
 * The wash inside the frame, over the artwork's top-left corner only — the
 * gradient it pairs with dies at the halfway point (`via-transparent`) so the
 * middle of the frame, where a screenshot's detail is, stays untinted. Alpha
 * is deliberately low: a shot that carries no colour of its own (a neutral
 * grey UI) takes the full weight of this, and at a quarter opacity that reads
 * as the artwork having been recoloured rather than lit.
 */
const WASH_CLASSES = {
  brand: 'from-fx-mark-brand/18',
  ink: 'from-fx-mark-ink/14',
  amber: 'from-fx-mark-amber/18',
  teal: 'from-fx-mark-teal/18',
  violet: 'from-fx-mark-violet/18',
  rose: 'from-fx-mark-rose/18',
} as const

/** The sheen that sweeps the frame on hover. */
const SHEEN_CLASSES = {
  brand: 'via-fx-mark-brand/25',
  ink: 'via-fx-mark-ink/15',
  amber: 'via-fx-mark-amber/25',
  teal: 'via-fx-mark-teal/25',
  violet: 'via-fx-mark-violet/25',
  rose: 'via-fx-mark-rose/25',
} as const

/** The hairline beside the index numeral, and the metric's left rule. */
const RULE_CLASSES = {
  brand: 'bg-fx-mark-brand',
  ink: 'bg-fx-mark-ink',
  amber: 'bg-fx-mark-amber',
  teal: 'bg-fx-mark-teal',
  violet: 'bg-fx-mark-violet',
  rose: 'bg-fx-mark-rose',
} as const

/**
 * The spotlight metric's left rule. A separate map rather than a string
 * transform of `RULE_CLASSES`: Tailwind compiles by scanning source text, so
 * a class produced at runtime by `.replace('bg-', 'border-')` would exist in
 * the DOM and nowhere in the stylesheet.
 */
const BORDER_CLASSES = {
  brand: 'border-fx-mark-brand',
  ink: 'border-fx-mark-ink',
  amber: 'border-fx-mark-amber',
  teal: 'border-fx-mark-teal',
  violet: 'border-fx-mark-violet',
  rose: 'border-fx-mark-rose',
} as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

/** The mosaic column spans. Only bind at `lg`; below that the grid is simpler. */
const SPAN_CLASSES = {
  wide: 'lg:col-span-7',
  standard: 'lg:col-span-5',
} as const

/**
 * The "view all work" link beside the headline — inline text with an
 * underline, not a button. Identical treatment to the service grid's, because
 * it is the same affordance in the same position.
 */
const SEE_ALL_CLASS = cn(
  'h-auto gap-2 whitespace-normal px-0 py-0 text-fx-label font-medium text-fx-ink',
  'underline-offset-4 hover:underline hover:text-fx-accent-text',
  'transition-colors duration-200 ease-fx motion-reduce:transition-none'
)

/**
 * A project's own link. The arrow travels on hover of the WHOLE tile, not
 * just the text, because the whole tile is the hit area.
 */
const PROJECT_LINK_CLASS = cn(
  'h-auto gap-2 whitespace-normal px-0 py-0 text-fx-label font-medium text-fx-ink',
  'underline-offset-4 group-hover:underline group-hover:text-fx-accent-text',
  '[&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-fx',
  'group-hover:[&_svg]:translate-x-1',
  'transition-colors duration-200 ease-fx',
  'motion-reduce:transition-none motion-reduce:group-hover:[&_svg]:translate-x-0'
)

/**
 * The header rises as one unit while the tiles stagger, so `rise` is folded
 * into `stagger` for the tiles exactly as `ServiceGrid` does it.
 */
function tilePreset(animation: (typeof ANIMATIONS)[number]) {
  return animation === 'rise' ? 'stagger' : animation
}

/**
 * `data.tags`, split into pills. Split on commas only, trim, drop empties —
 * never markup, so a tag can never smuggle HTML into the page.
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

/** A repeater row worth rendering — has a title, a summary, or both. */
function hasContent(block: CmsSectionBlock): boolean {
  return Boolean(trimmed(block.label) || trimmed(block.description))
}

/**
 * The framed product shot.
 *
 * Every visual flourish in this section lives here rather than on the text
 * column: an image is the only element that can carry glow, wash and sheen
 * without a legibility cost, so the tile can read as rich while the copy
 * beside it stays on plain ink tokens.
 *
 * A project with no image is not an error — it is a case study written before
 * the screenshot was cleared — so the frame falls back to the site's own fine
 * grid pattern and keeps its shape, its ratio and its hover behaviour.
 */
function ProjectFrame({
  block,
  accent,
  priority,
}: {
  block: CmsSectionBlock
  accent: Accent
  priority: boolean
}) {
  const { t } = useTranslations()
  const media = block.media ?? null

  return (
    <div className="relative">
      {/* The bloom. Sits behind the frame and outside it, so the colour reads
          as light coming off the tile rather than as a border. */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -inset-3 rounded-fx-2xl blur-2xl sm:-inset-5',
          // `transform-gpu` is not decoration here. A 40px blur over a box
          // this size is the most expensive paint on the page, and animating
          // its opacity un-promoted re-rasterises the whole blur every frame
          // — enough main-thread work that the pointer itself visibly
          // stutters while the card is hovered. Promoted, the blur is
          // rasterised once and the compositor fades the finished bitmap.
          'transform-gpu',
          'opacity-40 transition-opacity duration-500 ease-fx group-hover:opacity-80',
          'motion-reduce:transition-none',
          GLOW_CLASSES[accent]
        )}
      />

      <div
        className={cn(
          'relative overflow-hidden rounded-fx-lg border border-fx-line bg-fx-surface-2 fx-raise-2',
          'transform-gpu transition-[transform,box-shadow,border-color] duration-500 ease-fx',
          // `fx-raise-4`, not `shadow-fx-4`: a bare shadow utility replaces the
          // whole `box-shadow`, which drops the `--fx-edge` hairline the raise
          // utilities exist to carry — so the card lost its lit edge in dark
          // mode for exactly as long as it was hovered.
          'group-hover:-translate-y-1 group-hover:border-fx-accent-line group-hover:fx-raise-4',
          'motion-reduce:transition-none motion-reduce:group-hover:translate-y-0'
        )}
      >
        <div className="relative aspect-[16/10] w-full">
          {media?.url ? (
            <SectionMedia
              media={media}
              fill
              priority={priority}
              mediaClassName={cn(
                'object-cover transform-gpu transition-transform duration-700 ease-fx',
                'group-hover:scale-[1.04]',
                'motion-reduce:transition-none motion-reduce:group-hover:scale-100'
              )}
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center bg-fx-surface-2 text-fx-ink-faint fx-fine-grid"
              role="img"
              aria-label={t('No project image yet')}
            >
              <ImageOff className="size-7" aria-hidden="true" />
            </div>
          )}

          {/* Corner wash — ties the artwork to the project's hue without
              tinting the middle of the frame, where the detail is. */}
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-0 bg-gradient-to-br via-transparent to-transparent',
              WASH_CLASSES[accent]
            )}
          />

          {/* Sheen. A single pass on hover; removed outright under reduced
              motion rather than shortened, because it is pure movement. */}
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute inset-y-0 -left-1/2 w-1/2 -skew-x-12',
              'bg-gradient-to-r from-transparent to-transparent opacity-0',
              'transform-gpu transition-[transform,opacity] duration-700 ease-fx',
              'group-hover:translate-x-[300%] group-hover:opacity-100',
              'motion-reduce:hidden',
              SHEEN_CLASSES[accent]
            )}
          />
        </div>
      </div>
    </div>
  )
}

/**
 * One case study.
 *
 * `tone` is the only difference between the promoted project and the rest:
 * `spotlight` splits into image + column on `lg` and sets the copy a size up;
 * `standard` stacks image over copy. Everything else — hue, frame, motion,
 * hit area — is shared, so the two never drift into looking like two
 * different components.
 *
 * HIT AREA — when the project has a case-study CTA, its anchor is stretched
 * over the whole tile with a pseudo-element. One focusable element, one
 * accessible name, and the tile still keeps a real link for keyboard users
 * (`has-[a:focus-visible]` draws the outline around the tile, so a tab stop
 * is visible even though the anchor itself is a hairline of text).
 */
function ProjectTile({
  block,
  index,
  tone,
  showIndex,
  headingLevel,
  preset,
  priority,
  className,
}: {
  block: CmsSectionBlock
  index: number
  tone: 'spotlight' | 'standard'
  showIndex: boolean
  headingLevel: 'h2' | 'h3'
  preset: 'none' | 'fade' | 'stagger'
  /** Above the fold. Only ever true for the first tile of a first section. */
  priority: boolean
  className?: string | undefined
}) {
  const spotlight = tone === 'spotlight'

  const title = trimmed(block.label)
  const summary = trimmed(block.description)
  const category = readString(block.data, 'category')
  const metricValue = trimmed(block.value)
  const metricLabel = readString(block.data, 'metric_label')
  const tags = useMemo(() => tagsOf(block), [block])
  const accent = readOption(block.settings, 'accent', ACCENTS, cycledAccent(index))
  const cta = block.cta ?? null
  const Heading = headingLevel

  return (
    <Reveal
      as="li"
      preset={preset}
      index={index}
      className={cn(
        'group relative',
        'rounded-fx-xl transition-[outline-color] duration-200',
        'has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-fx-focus',
        spotlight
          ? 'flex flex-col gap-fx-stack-lg lg:grid lg:grid-cols-12 lg:items-center lg:gap-fx-stack-xl'
          : 'flex flex-col gap-5',
        className
      )}
    >
      <div className={cn(spotlight && 'lg:col-span-7')}>
        <ProjectFrame block={block} accent={accent} priority={priority} />
      </div>

      <div
        className={cn(
          'flex flex-col',
          spotlight ? 'gap-fx-stack-md lg:col-span-5' : 'gap-fx-stack-sm'
        )}
      >
        {showIndex || category ? (
          <p className="flex items-center gap-3 text-fx-eyebrow uppercase text-fx-ink-faint">
            {showIndex ? (
              <span className="fx-numerals">
                {String(index + 1).padStart(2, '0')}
              </span>
            ) : null}

            {showIndex && category ? (
              <span
                aria-hidden="true"
                className={cn('h-px w-6 shrink-0', RULE_CLASSES[accent])}
              />
            ) : null}

            {category ? <span>{category}</span> : null}
          </p>
        ) : null}

        {title ? (
          <Heading
            className={cn(
              'text-balance text-fx-ink',
              spotlight ? 'text-fx-heading' : 'text-fx-subheading font-semibold'
            )}
          >
            {title}
          </Heading>
        ) : null}

        {summary ? (
          <p
            className={cn(
              'text-pretty text-fx-ink-soft',
              spotlight ? 'text-fx-lead max-w-[52ch]' : 'text-fx-body-sm'
            )}
          >
            {summary}
          </p>
        ) : null}

        {metricValue ? (
          <div
            className={cn(
              'flex items-baseline gap-2.5',
              spotlight && 'mt-1 border-l-2 pl-4',
              spotlight && BORDER_CLASSES[accent]
            )}
          >
            <span
              className={cn(
                'fx-numerals font-semibold text-fx-ink',
                spotlight ? 'text-fx-stat' : 'text-fx-subheading'
              )}
            >
              {metricValue}
            </span>

            {metricLabel ? (
              <span className="text-fx-body-sm text-pretty text-fx-ink-faint">
                {metricLabel}
              </span>
            ) : null}
          </div>
        ) : null}

        {tags.length > 0 ? (
          <ul className="flex flex-wrap gap-2 pt-1">
            {tags.map((tag, position) => (
              <li
                key={`${tag}-${position}`}
                className={cn(
                  'rounded-fx-pill border border-fx-line bg-fx-surface px-3 py-1',
                  'text-fx-meta font-medium text-fx-ink-soft',
                  'transition-colors duration-300 ease-fx',
                  'group-hover:border-fx-accent-line group-hover:text-fx-ink',
                  'motion-reduce:transition-none'
                )}
              >
                {tag}
              </li>
            ))}
          </ul>
        ) : null}

        {cta ? (
          <div className="pt-1">
            <SectionCta
              cta={cta}
              fallbackVariant="link"
              buttonClassName={PROJECT_LINK_CLASS}
              // Stretches the anchor over the whole tile. The tile is
              // `relative`, so this is its hit area — one link, not a nest of
              // clickable regions, and the visible text stays the accessible
              // name.
              className="after:absolute after:inset-0 after:content-['']"
            />
          </div>
        ) : null}
      </div>
    </Reveal>
  )
}

/**
 * Featured work — a portfolio band of case studies.
 *
 * COMPOSITION — the two layouts are both asymmetric on purpose. `spotlight`
 * promotes the first project to a full-width image/copy split and runs the
 * rest as a two-up grid with every second tile dropped half a stack, so the
 * eye moves diagonally instead of scanning a rank of equal boxes. `mosaic`
 * drops the promotion and alternates 7/5 → 5/7 spans instead, for a page that
 * wants a rhythm rather than a hero project. Neither is a three-column card
 * grid; that composition already exists one section up (`service.grid`) and
 * repeating it would flatten the whole page into one texture.
 *
 * RESPONSIVE — desktop is editorial (12-column, offsets, generous stacks),
 * tablet collapses to a plain two-up because offsets at that width read as a
 * mistake rather than as rhythm, and mobile becomes a single vertical story:
 * image, number, context, title, result, stack, link — one project at a time,
 * full width, with the section's stack rhythm doing the pacing.
 *
 * COLOUR — every project carries a hue from the shared `--fx-mark-*` palette
 * (its own `settings.accent`, else its position in `ACCENT_CYCLE`) and spends
 * it exclusively on decoration: the bloom behind the frame, the corner wash
 * inside it, the hover sheen, and two hairlines. Text never uses it, so the
 * section is saturated without a single AA risk, and because the palette is
 * re-tuned in `.dark [data-site='public']` the whole thing re-seats for dark
 * mode with no `dark:` class anywhere in this file.
 *
 * HEADING ORDER — a project title sits one level below whatever heading
 * actually rendered above it, and falls back to `h2` when an editor cleared
 * the section heading but kept the projects, so the outline never skips.
 *
 * Renders `null` when there is neither a header nor one filled-in project —
 * the state of a section that has been added to a page but not written yet.
 */
export function WorkShowcase({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const layout = readOption(settings, 'layout', LAYOUTS, 'spotlight')
  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'lg')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'stagger')
  const showIndex = readBoolean(settings, 'show_index', true)

  const preset = tilePreset(animation)
  const headerPreset = animation === 'stagger' ? 'fade' : preset

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const cta = section.cta ?? null

  const projects = useMemo(
    () => blocksOfType(section.blocks, 'project').filter(hasContent),
    [section.blocks]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)

  if (!hasHeader && projects.length === 0) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  /** Position 0 owns the page's single `h1`; every other section starts at `h2`. */
  const sectionHeadingLevel: HeadingLevel = index === 0 ? 'h1' : 'h2'
  const tileHeadingLevel: 'h2' | 'h3' = heading
    ? sectionHeadingLevel === 'h1'
      ? 'h2'
      : 'h3'
    : 'h2'

  const spotlightLayout = layout === 'spotlight'

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Featured work') })}
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

        {projects.length > 0 ? (
          <ul
            className={cn(
              'grid grid-cols-1 gap-fx-stack-xl',
              spotlightLayout
                ? 'md:grid-cols-2'
                : 'md:grid-cols-2 lg:grid-cols-12 lg:gap-x-fx-stack-lg'
            )}
          >
            {projects.map((project, position) => {
              /* Spotlight: the first project only, and only when there is
                 more than one — a lone project promoted to a full-width
                 feature with nothing beneath it reads as a broken grid. */
              const isSpotlight =
                spotlightLayout && position === 0 && projects.length > 1

              const size = readOption(
                project.settings,
                'size',
                SIZES,
                cycledSize(position)
              )

              return (
                <ProjectTile
                  key={project.uuid}
                  block={project}
                  index={position}
                  tone={isSpotlight ? 'spotlight' : 'standard'}
                  showIndex={showIndex}
                  headingLevel={tileHeadingLevel}
                  preset={preset}
                  /* Eager, high-priority loading is for the LCP candidate and
                     nothing else. This section is normally well below the
                     fold, where eager loading a 16:10 shot competes with the
                     hero for bandwidth — so it is granted only when the
                     section itself opens the page. */
                  priority={index === 0 && position === 0}
                  className={cn(
                    /* Two tracks, not twelve: the spotlight layout's grid is
                       `md:grid-cols-2` at every width, and a `col-span-12` on
                       a two-track grid does not widen the item — it invents
                       ten implicit columns and starves every tile after it. */
                    isSpotlight && 'md:col-span-2',
                    /* The diagonal. Applied by position rather than by
                       `nth-child` so it stays correct whichever tile is
                       promoted, and only from `md` up — an offset on a
                       single-column phone layout is just a gap. */
                    spotlightLayout &&
                      !isSpotlight &&
                      position % 2 === 0 &&
                      'md:mt-fx-stack-lg',
                    !spotlightLayout && SPAN_CLASSES[size]
                  )}
                />
              )
            })}
          </ul>
        ) : null}
      </div>
    </Section>
  )
}

export default WorkShowcase
