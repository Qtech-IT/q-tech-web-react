import { useMemo } from 'react'
import { ImageOff } from 'lucide-react'

import { Section } from '@/Components/Public/Section'
import { fxButton } from '@/Components/Public/fxButton'
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

const COLUMNS = ['2', '3'] as const
const ALIGNMENTS = ['center', 'start'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const
const ACCENTS = ['brand', 'ink', 'amber', 'teal', 'violet', 'rose'] as const

type Accent = (typeof ACCENTS)[number]

/**
 * The fallback hue order for a tile with no `settings.accent`.
 *
 * Third section to share this palette and the third to cycle it rather than
 * default to one colour — see `ServiceGrid.ACCENT_CYCLE` for the full
 * reasoning. The order here starts on violet because this band most often
 * follows `work.showcase`, which opens on brand, and two adjacent sections
 * opening on the same hue reads as one long section.
 */
const ACCENT_CYCLE = ['violet', 'amber', 'teal', 'brand', 'rose', 'ink'] as const

function cycledAccent(index: number): Accent {
  return ACCENT_CYCLE[index % ACCENT_CYCLE.length] as Accent
}

/*
 * Static class maps, indexed by values `readOption` has already constrained.
 * Tailwind scans source text, so none of these may be built at runtime.
 */

const COLUMN_CLASSES = {
  '2': 'md:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
} as const

/** The tile panel's tint, laid over `--fx-surface-2` as a gradient. */
const PANEL_CLASSES = {
  brand: 'from-fx-mark-brand/12',
  ink: 'from-fx-mark-ink/10',
  amber: 'from-fx-mark-amber/12',
  teal: 'from-fx-mark-teal/12',
  violet: 'from-fx-mark-violet/12',
  rose: 'from-fx-mark-rose/12',
} as const

/** The bloom behind the tile, which strengthens on hover. */
const GLOW_CLASSES = {
  brand: 'bg-fx-mark-brand/25',
  ink: 'bg-fx-mark-ink/18',
  amber: 'bg-fx-mark-amber/25',
  teal: 'bg-fx-mark-teal/25',
  violet: 'bg-fx-mark-violet/25',
  rose: 'bg-fx-mark-rose/25',
} as const

/**
 * The "view project" button that fades in over the screen.
 *
 * Fill AND ink, because the two aliases in this palette (`brand`, `ink`)
 * carry their own legible-on-top colour while the four literal hues share
 * one — the same pairing `ServiceGrid.MARK_CLASSES` makes, and the reason
 * this is a map rather than a single class plus a hue.
 */
const PILL_CLASSES = {
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
 * The reveal on the tile: scrim and button.
 *
 * Bound to THREE states, not one — hover, `group-focus-within` and
 * `group-has-[a:focus-visible]` — because the action is the tile's only
 * affordance and a keyboard user who cannot see it has no way to know the
 * tile is a link at all. Under reduced motion the same classes resolve to a
 * plain appearance with no transform and no transition.
 */
const REVEAL_STATE = 'opacity-0 group-hover:opacity-100 group-focus-within:opacity-100'

/**
 * The header rises as one unit while the tiles stagger — same treatment as
 * every other repeater section in the registry.
 */
function tilePreset(animation: (typeof ANIMATIONS)[number]) {
  return animation === 'rise' ? 'stagger' : animation
}

/** `data.tags`, split into pills. Commas only, trimmed, empties dropped. */
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

/** A repeater row worth rendering — has a title, a caption, or both. */
function hasContent(block: CmsSectionBlock): boolean {
  return Boolean(trimmed(block.label) || trimmed(block.description))
}

/**
 * The window bar drawn above a screen.
 *
 * Composed from the site's own surface and line tokens rather than baked
 * into the upload, which is what lets an editor drop in a bare screenshot
 * and still get a tile that reads as a live site — and lets the bar follow
 * the theme instead of being a light-mode artifact burned into a PNG.
 */
function WindowBar() {
  return (
    <div
      aria-hidden="true"
      className="flex items-center gap-1.5 border-b border-fx-line bg-fx-surface-3 px-3 py-2.5"
    >
      <span className="size-2 rounded-full bg-fx-line-strong" />
      <span className="size-2 rounded-full bg-fx-line-strong" />
      <span className="size-2 rounded-full bg-fx-line-strong" />
      <span className="ms-2 h-3 w-2/5 max-w-40 rounded-fx-pill bg-fx-surface-2" />
    </div>
  )
}

/**
 * One portfolio tile — a tinted panel holding a framed screen, with the
 * title and caption beneath it.
 *
 * THE HOVER — the screen is the content, so the gesture happens on the
 * screen: a scrim veils it, the shot pushes in slightly, and the project's
 * link rises into the middle as a filled pill in the tile's own hue. It is
 * one animation with three parts rather than three effects, which is what
 * keeps it feeling like a single object responding rather than a stack of
 * tricks.
 *
 * THE HIT AREA — that pill IS the link, stretched over the screen with a
 * pseudo-element. One focusable element, one accessible name, and the reveal
 * is bound to `focus-within` as well as hover so it is reachable by keyboard.
 * A tile with no link renders with no reveal at all rather than a button that
 * goes nowhere. Nothing that owns hit area moves on hover — see the note on
 * the panel below for why that rule exists.
 */
function PortfolioTile({
  block,
  index,
  chrome,
  headingLevel,
  preset,
  priority,
}: {
  block: CmsSectionBlock
  index: number
  chrome: boolean
  headingLevel: 'h2' | 'h3'
  preset: 'none' | 'fade' | 'stagger'
  /** Above the fold. Only ever true for the first tile of a first section. */
  priority: boolean
}) {
  const { t } = useTranslations()

  const title = trimmed(block.label)
  const caption = trimmed(block.description)
  const tags = useMemo(() => tagsOf(block), [block])
  const accent = readOption(block.settings, 'accent', ACCENTS, cycledAccent(index))
  const media = block.media ?? null
  const cta = block.cta ?? null
  const Heading = headingLevel

  return (
    <Reveal
      as="li"
      preset={preset}
      index={index}
      className={cn(
        'group relative flex flex-col rounded-fx-2xl',
        'has-[a:focus-visible]:outline-2 has-[a:focus-visible]:outline-offset-4 has-[a:focus-visible]:outline-fx-focus'
      )}
    >
      {/* The bloom. Outside the panel and behind it, so the hue reads as
          light coming off the tile rather than as a second border. */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute -inset-2 rounded-fx-2xl blur-2xl sm:-inset-4',
          'opacity-0 transition-opacity duration-500 ease-fx group-hover:opacity-100',
          'group-focus-within:opacity-100 motion-reduce:transition-none',
          GLOW_CLASSES[accent]
        )}
      />

      {/*
        NOTHING IN THIS PANEL MOVES ON HOVER, and that is a fix rather than a
        restraint. The tile's link is a stretched pseudo-element inside the
        panel, so when the panel translated, the LINK'S HIT BOX translated with
        it: a pointer resting near the bottom of the screen fell out of the hit
        box, the cursor flicked back from pointer to arrow, the reveal
        switched off, the panel dropped back under the pointer — and the whole
        tile shook at frame rate.

        A hover response that changes geometry cannot live on an element that
        owns the hit area. So the response here is entirely non-geometric —
        border, shadow and the bloom behind the tile — and the movement that
        remains (the image push-in, the button's rise) happens on elements
        clipped inside a box that never itself moves.
      */}
      <div
        className={cn(
          'relative flex flex-1 flex-col gap-5 overflow-hidden rounded-fx-2xl',
          'border border-fx-line bg-fx-surface-2 p-3 sm:p-4',
          'transition-[border-color,box-shadow] duration-500 ease-fx',
          'group-hover:border-fx-accent-line group-hover:shadow-fx-3',
          'motion-reduce:transition-none'
        )}
      >
        {/* Panel tint. A gradient rather than a flat fill so the hue gathers
            at the top of the tile, behind the screen, and lets go before it
            reaches the caption. */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 bg-gradient-to-b via-transparent to-transparent',
            PANEL_CLASSES[accent]
          )}
        />

        <div className="relative overflow-hidden rounded-fx-lg border border-fx-line bg-fx-surface fx-raise-1">
          {chrome ? <WindowBar /> : null}

          <div className="relative aspect-[16/10] w-full">
            {media?.url ? (
              <SectionMedia
                media={media}
                fill
                priority={priority}
                mediaClassName={cn(
                  'object-cover object-top transition-transform duration-700 ease-fx',
                  'group-hover:scale-[1.03]',
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

            {cta ? (
              <>
                {/* Scrim. `--fx-scrim` rather than an ink token, because
                    veiling a screenshot means darkening it in BOTH themes —
                    see the token's note in `frontend.css`. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'pointer-events-none absolute inset-0 bg-fx-scrim',
                    'transition-opacity duration-400 ease-fx motion-reduce:transition-none',
                    REVEAL_STATE
                  )}
                />

                <div
                  className={cn(
                    'absolute inset-0 flex items-center justify-center',
                    'transition-[opacity,transform] duration-400 ease-fx',
                    'translate-y-3 group-hover:translate-y-0 group-focus-within:translate-y-0',
                    'motion-reduce:transition-none motion-reduce:translate-y-0',
                    REVEAL_STATE
                  )}
                >
                  <SectionCta
                    cta={cta}
                    fallbackVariant="default"
                    size="default"
                    buttonClassName={cn(
                      fxButton({ tone: 'solid', scale: 'sm' }),
                      'rounded-fx-pill px-6 shadow-fx-3 hover:shadow-fx-4',
                      // The tile's hue, overriding `fxButton`'s admin-authored
                      // fill: the button belongs to this tile, not to the page's
                      // primary-action palette.
                      PILL_CLASSES[accent],
                      '[&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-fx',
                      'hover:[&_svg]:translate-x-0.5 hover:[&_svg]:-translate-y-0.5',
                      'motion-reduce:hover:[&_svg]:translate-x-0'
                    )}
                    /*
                     * The hit area is the SCREEN, not the whole tile. An
                     * absolutely positioned ancestor is a containing block for
                     * this pseudo-element, and the reveal layer has to be one —
                     * so `inset-0` resolves to the screen either way, and
                     * pretending otherwise with negative insets only produced a
                     * hit box that disagreed with the button a visitor can see.
                     * The button marks exactly where the tile is clickable,
                     * which is the honest version of the same affordance.
                     */
                    className="after:absolute after:inset-0 after:content-['']"
                  />
                </div>
              </>
            ) : null}
          </div>
        </div>

        <div className="relative flex flex-col gap-2 px-1 pb-1">
          {title ? (
            <Heading className="text-fx-subheading font-semibold text-balance text-fx-ink">
              {title}
            </Heading>
          ) : null}

          {caption ? (
            <p className="text-fx-body-sm text-pretty text-fx-ink-soft">
              {caption}
            </p>
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
        </div>
      </div>
    </Reveal>
  )
}

/**
 * The portfolio wall — a centered header with a pair of buttons, then a grid
 * of framed project screens.
 *
 * COMPOSITION — deliberately regular where `work.showcase` is asymmetric.
 * Every tile is the same size because the visitor is browsing, not being
 * argued at, and an offset or promoted tile in a browse grid reads as "this
 * one matters more" — a claim this section is not making. What carries it
 * instead is scale (two big screens per row, not three small ones), the
 * per-tile hue, and the hover reveal.
 *
 * RESPONSIVE — one column on a phone, where each screen gets the full
 * measure and the caption sits directly beneath it; two from `md` (or two
 * then three from `lg`, when the editor picks three columns).
 *
 * COLOUR — each tile carries a hue from the shared `--fx-mark-*` palette,
 * spent on the panel tint, the bloom and the "view" pill. The pill is the
 * only place a mark hue sits under text, and it pairs with the matching ink
 * token, so every combination in the palette holds AA. As with the rest of
 * the registry the palette is re-tuned per theme in `frontend.css`, so this
 * file contains no `dark:` class.
 *
 * HEADING ORDER — a tile title sits one level below whatever heading actually
 * rendered above it, falling back to `h2` when an editor cleared the section
 * heading but kept the tiles.
 *
 * Renders `null` when there is neither a header nor one filled-in tile.
 */
export function PortfolioGrid({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const columns = readOption(settings, 'columns', COLUMNS, '2')
  const align = readOption(settings, 'align', ALIGNMENTS, 'center')
  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'lg')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'stagger')
  const chrome = readBoolean(settings, 'chrome', true)

  const preset = tilePreset(animation)
  const headerPreset = animation === 'stagger' ? 'fade' : preset

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const primaryCta = section.cta ?? null
  const secondaryCta = section.secondary_cta ?? null

  const projects = useMemo(
    () => blocksOfType(section.blocks, 'project').filter(hasContent),
    [section.blocks]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)
  const hasButtons = Boolean(primaryCta || secondaryCta)

  if (!hasHeader && !hasButtons && projects.length === 0) {
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
  const centered = align === 'center'

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Our portfolio') })}
    >
      <div className="flex flex-col gap-fx-stack-xl">
        {hasHeader || hasButtons ? (
          <div
            className={cn(
              'flex flex-col gap-fx-stack-lg',
              centered && 'items-center text-center'
            )}
          >
            <SectionHeader
              eyebrow={eyebrow}
              heading={heading}
              subheading={subheading}
              headingLevel={sectionHeadingLevel}
              headingSize={sectionHeadingLevel}
              align={centered ? 'center' : 'start'}
              preset={headerPreset}
              {...(centered ? {} : { className: 'max-w-3xl' })}
              {...(headingId ? { headingId } : {})}
            />

            {hasButtons ? (
              <Reveal
                preset={headerPreset}
                className={cn(
                  'flex flex-wrap items-center gap-3',
                  centered && 'justify-center'
                )}
              >
                {primaryCta ? (
                  <SectionCta
                    cta={primaryCta}
                    size="lg"
                    fallbackVariant="default"
                    buttonClassName={cn(
                      fxButton({ tone: 'solid', scale: 'md' }),
                      'rounded-fx-pill px-7'
                    )}
                  />
                ) : null}

                {secondaryCta ? (
                  <SectionCta
                    cta={secondaryCta}
                    size="lg"
                    fallbackVariant="outline"
                    buttonClassName={cn(
                      fxButton({ tone: 'outline', scale: 'md' }),
                      'rounded-fx-pill border-transparent bg-fx-surface-2 px-7',
                      'hover:border-fx-accent-line hover:bg-fx-surface-3'
                    )}
                  />
                ) : null}
              </Reveal>
            ) : null}
          </div>
        ) : null}

        {projects.length > 0 ? (
          <ul
            className={cn(
              'grid grid-cols-1 gap-fx-stack-lg',
              COLUMN_CLASSES[columns]
            )}
          >
            {projects.map((project, position) => (
              <PortfolioTile
                key={project.uuid}
                block={project}
                index={position}
                chrome={chrome}
                headingLevel={tileHeadingLevel}
                preset={preset}
                /* Eager, high-priority loading is for the LCP candidate only —
                   granted just when this section itself opens the page. */
                priority={index === 0 && position === 0}
              />
            ))}
          </ul>
        ) : null}
      </div>
    </Section>
  )
}

export default PortfolioGrid
