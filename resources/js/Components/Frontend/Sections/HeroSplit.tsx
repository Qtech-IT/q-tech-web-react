import { useCallback, useMemo, useRef } from 'react'
import type { CSSProperties } from 'react'
import { ArrowDown, Quote } from 'lucide-react'
import { useReducedMotion } from 'motion/react'

import { NavIcon, isRegisteredNavIcon } from '@/Components/Public/NavIcon'
import { Section } from '@/Components/Public/Section'
import { fxButton } from '@/Components/Public/fxButton'
import { SafeImage } from '@/Components/UI/SafeImage'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import { blocksOfType } from '@/Components/Frontend/Sections/Shared/blocks'
import { highlightHeading } from '@/Components/Frontend/Sections/Shared/highlight'
import { HeroFigure } from '@/Components/Frontend/Sections/Shared/HeroFigure'
import { Reveal } from '@/Components/Frontend/Sections/Shared/Reveal'
import { RichText } from '@/Components/Frontend/Sections/Shared/RichText'
import { SectionCta } from '@/Components/Frontend/Sections/Shared/SectionCta'
import { SectionMedia } from '@/Components/Frontend/Sections/Shared/SectionMedia'
import { StatValue } from '@/Components/Frontend/Sections/Shared/StatValue'
import {
  clamp,
  readNumber,
  readOption,
  readString,
  trimmed,
} from '@/Components/Frontend/Sections/Shared/values'
import type { CmsSectionBlock } from '@/Types/cms'
import type { SectionComponentProps } from '@/Types/sections'

const LAYOUTS = ['split', 'centered', 'full_bleed'] as const
const MEDIA_SIDES = ['left', 'right'] as const
/**
 * How the split hero's artwork meets the section edge.
 *
 * `panel` bleeds it to the outer edge at the section's full height with square
 * corners; `framed` insets it as a rounded, bordered, raised card. Two values
 * rather than a boolean because the vocabulary is editorial — the admin select
 * reads "Full-Height Panel" / "Framed Card", not "bleed: on".
 */
const MEDIA_FRAMES = ['panel', 'framed'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const

/**
 * Contrast floor for text laid over artwork.
 *
 * A full-bleed hero puts body copy directly on top of an image the renderer has
 * never seen, so an editor leaving `overlay_opacity` at 0 would ship an
 * unreadable page. The stored value can raise this but never lower it —
 * accessibility is not an editorial preference.
 */
const FULL_BLEED_MIN_OVERLAY = 72

/**
 * Where the full-height panel's inner edge falls, as a fraction of the
 * CONTAINER measure. The one number the panel composition has.
 *
 * WHY A SINGLE NUMBER
 * -------------------
 * This used to be three hand-maintained numbers in two different coordinate
 * spaces: the panel was 54% of the SECTION (`w-full`, so the viewport), while
 * the copy track (a 1/1.22 `fr` ratio) and the trailing measure (43%) were
 * fractions of the CONTAINER — which stops growing at 1440px while the viewport
 * does not. Above 1440 the copy stayed put and the panel kept advancing on it,
 * so clearance shrank linearly and crossed zero: the trailing rows went under
 * the photograph at ~2353px and the copy column at ~2566px. At 2560px — an
 * ordinary monitor — the stats rail, pull quote and scroll cue sat ~8px beneath
 * an image, on a `-z-10` layer with no scrim behind them. Unreadable, a
 * contrast failure, and nothing an editor could correct from the CMS.
 *
 * Now every one of the three is derived from this fraction, in the container's
 * space, and the panel's inner edge is placed at the same fraction of the same
 * measure rather than at a percentage of the viewport. Clearance is therefore
 * `--hero-clear` EXACTLY, at every width — it cannot drift, because there is no
 * second number to drift from. Widening the panel is a one-line edit here.
 *
 * 0.46 is the value that reproduces the composition the design was tuned at:
 * within a few pixels of the old geometry at 1024, 1280 and 1440, and it keeps
 * the panel reading as a roughly square block at the widths a desktop reader
 * actually uses (~774 x ~864 at 1440).
 */
const HERO_PANEL_SPLIT = 0.46

/**
 * Clear canvas between the copy's measure and the panel's inner edge.
 *
 * The visible gap is far larger than this: the panel feathers its own inner
 * 96px into the canvas (see `panelBlock`), so this is the floor on how close
 * TEXT can come to the photograph's geometric edge, not to its visible one.
 */
const HERO_PANEL_CLEAR = '2rem'

/**
 * `settings.theme` → the `Section` background variant.
 *
 * A map rather than a pass-through so the two vocabularies can diverge: the CMS
 * exposes three editorial choices, `Section` has four technical variants, and
 * `muted` is not one an editor should be offered for a hero.
 */
const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

/**
 * The hero's atmospheric layer.
 *
 * Three originals composed from tokens, nothing imported: a wide accent bloom
 * anchored off the top-right corner, a hairline grid that fades out before it
 * reaches the copy, and a soft horizon that hands off to the section below.
 * Purely decorative and fully `aria-hidden`; it carries no meaning and it never
 * sits between the reader and a word.
 *
 * `bloom` exists for the full-height media panel. The bloom is anchored to the
 * same corner the panel occupies, and a blurred accent orb sitting half-under a
 * photograph reads as a rendering fault rather than as atmosphere. The grid
 * veil and the horizon stay — those live behind the copy, which is exactly the
 * half the panel does not touch.
 */
function HeroBackdrop({
  centered,
  bloom = true,
}: {
  centered: boolean
  bloom?: boolean
}) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
      <div className="fx-grid-veil absolute inset-0 opacity-70" />

      {bloom ? (
        <div
          className={cn(
            'absolute -top-1/3 h-[46rem] w-[46rem] rounded-full blur-3xl',
            'bg-[radial-gradient(circle_at_center,var(--fx-wash-accent),transparent_68%)]',
            centered ? 'left-1/2 -translate-x-1/2' : '-right-1/4 lg:-right-[12%]'
          )}
        />
      ) : null}

      <div className="absolute inset-x-0 bottom-0 h-40 bg-[linear-gradient(to_bottom,transparent,var(--fx-canvas))]" />
    </div>
  )
}

/**
 * One statistic.
 *
 * A list rather than a `<dl>`: `dl` requires a strict `dt`/`dd` pairing and a
 * statistic is one labelled figure, not a term-definition pair — the wrong
 * landmark is worse for a screen reader than a plain list.
 *
 * `panel` is the elevated aside; `row` is the hairline rail that runs under the
 * copy when artwork already owns the second column.
 */
function HeroStat({
  block,
  variant,
}: {
  block: CmsSectionBlock
  variant: 'panel' | 'row'
}) {
  const value = trimmed(block.value)
  const label = trimmed(block.label)

  if (!value && !label) {
    return null
  }

  return (
    <li
      className={cn(
        variant === 'panel' && 'py-5 first:pt-0 last:pb-0',
        variant === 'row' && 'border-t border-fx-line pt-5'
      )}
    >
      {value ? (
        <StatValue
          value={value}
          prefix={readString(block.data, 'prefix')}
          suffix={readString(block.data, 'suffix')}
          className={cn(
            'fx-numerals block text-fx-ink',
            variant === 'panel' ? 'text-fx-stat' : 'text-fx-subheading'
          )}
        />
      ) : null}

      {label ? (
        <span className="mt-2 block text-fx-body-sm text-fx-ink-soft">
          {label}
        </span>
      ) : null}
    </li>
  )
}

/**
 * A pull quote, in the hero's own voice.
 *
 * Shares one renderer between the panel and the standalone placement so the two
 * cannot drift apart as the design moves; only the density changes.
 */
function HeroQuote({
  quote,
  author,
  variant,
}: {
  quote: string
  author?: string | undefined
  variant: 'panel' | 'standalone'
}) {
  return (
    <figure
      className={cn(
        'relative',
        variant === 'panel' &&
          'mt-fx-stack-md rounded-fx-lg border border-fx-line bg-fx-surface-2 p-6',
        variant === 'standalone' && 'max-w-2xl border-l-2 border-fx-accent pl-6'
      )}
    >
      <Quote
        aria-hidden="true"
        className={cn(
          'mb-3 size-5 text-fx-accent-text',
          variant === 'standalone' && 'hidden'
        )}
      />

      <blockquote
        className={cn(
          'text-pretty text-fx-ink',
          variant === 'panel' ? 'text-fx-body-sm' : 'text-fx-lead'
        )}
      >
        {quote}
      </blockquote>

      {author ? (
        <figcaption className="mt-3 text-fx-meta text-fx-ink-faint">
          {author}
        </figcaption>
      ) : null}
    </figure>
  )
}

/**
 * The site's primary hero.
 *
 * LAYOUT — two shapes, chosen by `media_frame`.
 *
 *   `framed` keeps the classic 55/45 at `lg`: the copy column is the page's
 *   argument and has to hold an 80px headline over two or three lines, the
 *   media column only has to hold one inset card, so it gets the smaller share.
 *
 *   `panel` (the default) is the editorial composition — measured copy on one
 *   side, a single full-height photographic block running off the outer edge of
 *   the page on the other. The panel is NOT in the grid: it is an absolutely
 *   positioned layer inside the section, so it escapes the container measure
 *   and reaches the section's top, bottom and outer edge with nothing between
 *   it and the viewport. Its grid cell stays behind as a spacer reserving the
 *   same track, which is what keeps the copy out from under it without a single
 *   negative margin — negative margins would have to be re-derived at every
 *   breakpoint against the container's centring margin AND its gutter, and get
 *   one of the two wrong somewhere between 1024 and 1920.
 *
 * Below `lg` both shapes are a single stack, which is the only honest layout at
 * 375px; the panel drops out of `absolute`, stops trying to be full-height, and
 * becomes an edge-to-edge 4/3 band under the copy.
 *
 * VERTICAL ORDER — eyebrow, headline, subheadline, actions, trust row. That is
 * descending commitment: what we are, what we claim, what it means, what to do,
 * why to believe it. Every region is independently optional and driven only by
 * whether the CMS carries content for it.
 *
 * SPACING — 24px base rhythm inside the copy column, opened to 32px below the
 * headline and above the buttons, with the trust row separated by a hairline
 * because it is a different register. The section band is the widest in the
 * system (`--fx-band-lg`, 88 → 192px). Whitespace is doing the work that colour
 * would do on a cheaper page.
 *
 * TYPE — one display size (44 → 80px, -0.032em, 1.04 leading) against one lead
 * size, with the eyebrow as a small-caps pill. The ratio between the headline
 * and the body — roughly 4.5x at desktop — is the single largest contributor to
 * the page reading as premium; three sizes total is what keeps it authored
 * rather than merely scaled.
 *
 * MOTION — one staggered rise on mount, 70ms apart, opacity plus a small Y
 * translate only. Never scroll-triggered: a hero that waits for an intersection
 * observer flashes empty on first paint. `Reveal` drops the motion component
 * entirely under `prefers-reduced-motion`.
 *
 * The interesting case is the one production is in right now: **no media**. A
 * split hero with an empty second column looks like a bug and a stock photo is
 * forbidden, so the column is composed from the page's own material — see
 * `HeroFigure`, which floats the editor's statistics on a token-built field. If
 * there are no statistics either, the hero collapses to a single measured
 * column rather than leaving dead space. Nothing is invented to fill a gap.
 */
export function HeroSplit({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()
  const reduceMotion = useReducedMotion()
  // Anchored to a node inside the section rather than to `Section` itself:
  // `Section` is a plain function component with no ref in its props contract,
  // and widening that contract for one scroll button is not a good trade.
  const contentRef = useRef<HTMLDivElement>(null)

  const settings = section.settings
  const data = section.data

  const layout = readOption(settings, 'layout', LAYOUTS, 'split')

  const mediaSide = readOption(settings, 'media_side', MEDIA_SIDES, 'right')
  const mediaFrame = readOption(settings, 'media_frame', MEDIA_FRAMES, 'panel')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'rise')
  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'lg')

  /*
   * A hero is read strictly top to bottom on first paint — eyebrow, then
   * headline, then the promise, then the action. Revealing all four in the same
   * frame throws that order away, so at this one scale `rise` is sequenced:
   * `Reveal`'s stagger step is 70ms, which is fast enough that the whole hero
   * has settled in well under half a second.
   *
   * `none` and `fade` are passed straight through — an editor who turned motion
   * down did not ask for it back, and `Reveal` still drops the motion component
   * entirely under `prefers-reduced-motion` regardless of what is chosen here.
   */
  const heroPreset = animation === 'rise' ? 'stagger' : animation

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const scrollCue = readString(data, 'scroll_cue_label')
  const quote = readString(data, 'testimonial_quote')
  const quoteAuthor = readString(data, 'testimonial_author')

  const headingNode = useMemo(
    () => highlightHeading(heading, readString(data, 'heading_highlight')),
    [data, heading]
  )

  const stats = useMemo(() => blocksOfType(section.blocks, 'stat'), [section.blocks])
  const badges = useMemo(() => blocksOfType(section.blocks, 'badge'), [section.blocks])

  const media = section.media ?? null
  const hasMedia = Boolean(media?.url)

  const overlay = clamp(readNumber(settings, 'overlay_opacity') ?? 0, 0, 100)
  const fullBleed = layout === 'full_bleed' && hasMedia
  const effectiveOverlay = fullBleed
    ? Math.max(overlay, FULL_BLEED_MIN_OVERLAY)
    : overlay

  const primaryCta = section.cta ?? null
  const secondaryCta = section.secondary_cta ?? null

  const handleScrollCue = useCallback(() => {
    const next = contentRef.current?.closest('[data-slot="section"]')
      ?.nextElementSibling

    if (next instanceof HTMLElement) {
      next.scrollIntoView({
        behavior: reduceMotion ? 'auto' : 'smooth',
        block: 'start',
      })
    }
  }, [reduceMotion])

  const isEmpty =
    !eyebrow &&
    !heading &&
    !subheading &&
    !trimmed(section.body) &&
    !hasMedia &&
    !primaryCta &&
    !secondaryCta &&
    stats.length === 0 &&
    badges.length === 0 &&
    !quote

  // A hero with nothing in it renders nothing. Better an absent section than a
  // full-height band of empty space above the rest of the page.
  if (isEmpty) {
    return null
  }

  const centered = layout === 'centered'
  // Statistics move into the second column only when there is no artwork to
  // put there, and only in the split layout that actually has a second column.
  const statsInAside = layout === 'split' && !hasMedia && stats.length > 0
  const splitAside = layout === 'split' && (hasMedia || statsInAside)
  const statsInline = stats.length > 0 && !statsInAside
  /**
   * The bleeding full-height treatment. Only ever true for `split` with a real
   * asset: `centered` has no outer half to bleed into, and `full_bleed` already
   * runs the artwork behind the whole section, so neither has anything to gain
   * from it and both would be broken by an absolutely positioned half-panel.
   */
  const panelMedia = splitAside && hasMedia && mediaFrame === 'panel'

  /**
   * The panel composition's geometry, resolved in CSS rather than in JS.
   *
   * These have to be custom properties and not computed numbers because the
   * inputs are the container's own tokens — `--fx-measure-wide` and the fluid
   * `--fx-gutter` — and the renderer has no viewport width at paint time. CSS
   * knows both; recomputing them here would mean a resize listener and a
   * second, competing definition of the container's measure.
   *
   * `--fx-measure-wide` is the token behind `containerSize="wide"` below. The
   * two must name the same measure, so change them together.
   *
   * A percentage inside a custom property is resolved where the property is
   * USED, not where it is declared, and that is load-bearing here:
   *
   *   `--hero-copy` and `--hero-edge` both contain `100%`, and they are
   *   deliberately used in different boxes. `--hero-copy` is only ever applied
   *   inside the container, where `100%` is the container's content measure.
   *   `--hero-edge` is only ever applied to the out-of-flow panel, whose
   *   containing block is the section, where `100%` is the viewport. Each
   *   resolves against exactly the box its arithmetic assumes.
   *
   *   `--hero-inset` is the container's left content edge measured from the
   *   section edge; `--hero-measure` is the container's content width. Together
   *   they let the panel be positioned in CONTAINER terms while living in the
   *   SECTION's coordinate space, which is the whole point — that mismatch is
   *   what the old raw `54%` of the viewport got wrong.
   */
  const panelVars = panelMedia
    ? ({
        '--hero-split': String(HERO_PANEL_SPLIT),
        '--hero-clear': HERO_PANEL_CLEAR,
        '--hero-inset':
          'calc((100% - min(100%, var(--fx-measure-wide))) / 2 + var(--fx-gutter))',
        '--hero-measure':
          'calc(min(100%, var(--fx-measure-wide)) - 2 * var(--fx-gutter))',
        /** Copy + trailing measure: the split, less the clearance. */
        '--hero-copy': 'calc(var(--hero-split) * 100% - var(--hero-clear))',
        /** The panel's inner edge, from the section's outer edge. */
        '--hero-edge':
          'calc(var(--hero-inset) + var(--hero-split) * var(--hero-measure))',
      } as CSSProperties)
    : undefined

  /** Position 0 owns the page's single `h1`; a second hero degrades to `h2`. */
  const HeadingTag = index === 0 ? 'h1' : 'h2'

  const textColumn = (
    <div
      // 24px base rhythm, opened to 32px below the headline and above the
      // buttons (via `mt-fx-stack-xs` on those two). A uniform gap between a
      // 12px eyebrow, an 80px headline and a 22px lead is optically wrong —
      // large type needs proportionally more room beneath it, or the block
      // closes up exactly where it should open out.
      className={cn(
        'flex flex-col gap-fx-stack-md',
        centered && 'mx-auto max-w-4xl items-center text-center'
      )}
    >
      {eyebrow ? (
        <Reveal preset={heroPreset} trigger="mount" index={0}>
          {/* A hairline pill rather than bare small-caps: it gives the first
              line of the page an edge to sit against, which is what stops a
              display headline looking like it starts in mid-air. */}
          <p
            className={cn(
              'inline-flex items-center gap-2.5 rounded-fx-pill',
              'border border-fx-line bg-fx-surface px-4 py-2 fx-raise-1',
              'text-fx-eyebrow uppercase text-fx-ink-soft'
            )}
          >
            <span
              aria-hidden="true"
              className="size-1.5 shrink-0 rounded-full bg-fx-accent"
            />
            {eyebrow}
          </p>
        </Reveal>
      ) : null}

      {headingNode ? (
        <Reveal preset={heroPreset} trigger="mount" index={1}>
          <HeadingTag
            className={cn(
              'text-balance text-fx-ink',
              // The display scale is reserved for a hero that owns the page.
              index === 0 ? 'text-fx-display' : 'text-fx-title'
            )}
          >
            {headingNode}
          </HeadingTag>
        </Reveal>
      ) : null}

      {subheading ? (
        <Reveal
          preset={heroPreset}
          trigger="mount"
          index={2}
          className="mt-fx-stack-xs"
        >
          <p
            className={cn(
              'text-pretty text-fx-lead text-fx-ink-soft',
              // ~52 characters. Long enough to carry a real value
              // proposition, short enough that the eye never has to hunt.
              'max-w-[52ch]',
              centered && 'mx-auto'
            )}
          >
            {subheading}
          </p>
        </Reveal>
      ) : null}

      {trimmed(section.body) ? (
        <Reveal preset={heroPreset} trigger="mount" index={3}>
          <RichText
            html={section.body}
            className={cn('max-w-[60ch] text-fx-ink-soft', centered && 'mx-auto')}
          />
        </Reveal>
      ) : null}

      {primaryCta || secondaryCta ? (
        <Reveal
          preset={heroPreset}
          trigger="mount"
          index={4}
          className={cn(
            'mt-fx-stack-xs flex flex-wrap items-center gap-3',
            centered && 'justify-center'
          )}
        >
          <SectionCta
            cta={primaryCta}
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

      {badges.length > 0 ? (
        <Reveal
          preset={heroPreset}
          trigger="mount"
          index={5}
          className={cn(
            // The trust row is a separate register from the pitch above it, so
            // it gets a hairline and real space rather than sitting in the same
            // rhythm as the copy. Without the rule it reads as a fourth line of
            // body text; with it, it reads as evidence.
            'mt-fx-stack-sm border-t border-fx-line pt-fx-stack-md'
          )}
        >
          {/* Assurance marks, not decoration — kept at meta weight so they
              never compete with the CTA for the same glance. */}
          <ul
            className={cn(
              'flex flex-wrap items-center gap-x-7 gap-y-3',
              centered && 'justify-center'
            )}
          >
            {badges.map((badge) => {
              const label = trimmed(badge.label)

              if (!label) {
                return null
              }

              return (
                <li
                  key={badge.uuid}
                  className="inline-flex items-center gap-2 text-fx-body-sm font-medium text-fx-ink-soft"
                >
                  {badge.media?.url ? (
                    <SafeImage
                      src={badge.media.url}
                      alt={badge.media.alt_text?.trim() || ''}
                      width={18}
                      height={18}
                      className="size-[1.125rem] shrink-0 object-contain"
                    />
                  ) : isRegisteredNavIcon(badge.icon ?? undefined) ? (
                    <NavIcon
                      name={badge.icon ?? undefined}
                      className="size-[1.125rem] text-fx-accent-text"
                    />
                  ) : null}
                  {label}
                </li>
              )
            })}
          </ul>
        </Reveal>
      ) : null}
    </div>
  )

  const statPanel = statsInAside ? (
    <Reveal
      preset={heroPreset}
      trigger="mount"
      index={3}
      className="w-full lg:justify-self-end"
    >
      <HeroFigure stats={stats} label={t('Key figures')} />

      {quote ? (
        <HeroQuote
          quote={quote}
          variant="panel"
          {...(quoteAuthor ? { author: quoteAuthor } : {})}
        />
      ) : null}
    </Reveal>
  ) : null

  /**
   * The inset card — `media_frame: framed`, and the only treatment the
   * `centered` and `full_bleed` layouts ever use. An accent wash pads out from
   * behind the card so it reads as an object sitting on the page.
   */
  const framedMedia = hasMedia ? (
    <Reveal
      preset={heroPreset}
      trigger="mount"
      index={2}
      className={cn('relative w-full', centered && 'mx-auto max-w-5xl')}
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-6 -top-4 -bottom-4 rounded-fx-2xl bg-fx-accent-soft opacity-60"
      />
      <SectionMedia
        media={media}
        overlayOpacity={overlay}
        priority={index === 0}
        fallbackRatio={centered ? '16 / 9' : '4 / 3'}
        className="relative rounded-fx-xl border border-fx-line fx-raise-4"
      />
    </Reveal>
  ) : null

  /**
   * The full-height panel — `media_frame: panel`.
   *
   * GEOMETRY — at `lg` this leaves the flow (`absolute`, pinned `inset-y-0` and
   * to the outer edge) so it spans the section's ENTIRE height: the copy row
   * plus both halves of the vertical band. Its containing block is the
   * `<section>`, which is the closest positioned ancestor — `Container` sets no
   * position — so the container's centring margin and gutter are simply not in
   * the coordinate space, and the panel reaches the page edge without a single
   * negative margin. The section's `overflow-hidden` clips the panel to the
   * band, so nothing it does can produce a horizontal scrollbar.
   *
   * WIDTH — never stated. Both horizontal edges are pinned instead: the outer
   * one to the section (`left-0` / `right-0`, so it reaches the page edge by
   * construction at any width) and the inner one to `--hero-edge`, which is
   * `HERO_PANEL_SPLIT` of the CONTAINER measure. Because the inner edge tracks
   * the same measure the copy does, the clearance between them is a constant
   * `--hero-clear` from 1024px to any width a display has — the panel simply
   * absorbs everything the container does not. A raw viewport percentage here
   * was the bug: see `HERO_PANEL_SPLIT`.
   *
   * SURFACE — no radius, no border, no shadow. The panel is a plane of the page
   * rather than a card on it; the moment it gets a corner radius it stops
   * reading as architecture and starts reading as a widget. `object-cover`
   * (SafeImage's default) crops rather than letterboxes, so an editor's
   * portrait upload fills the block instead of pillarboxing against `bg-muted`.
   *
   * MOTION — a fade, never the copy's rise. A 18px Y translate on an element
   * pinned to the section's top edge would expose a moving sliver of canvas
   * above it on first paint. The editor's `none` is still honoured, and
   * `Reveal` drops motion entirely under `prefers-reduced-motion`.
   *
   * Below `lg` it returns to the flow as an edge-to-edge 4/3 band under the
   * copy. Full-height is meaningless in a single stack, and the negative gutter
   * margin is exact there because the container is narrower than its own
   * `max-width` at every width below the `lg` breakpoint.
   */
  /**
   * The measure for everything that comes AFTER the grid row.
   *
   * The panel runs the section's full height, not just the grid row's, so a
   * stats rail or a pull quote taking the container's whole width slides
   * underneath a photograph — the one failure mode a full-height bleed
   * introduces that an inset card does not. These rows therefore take the copy
   * column's exact measure, `--hero-copy`, and are pushed to whichever side the
   * copy is on. Not an approximation of it: the SAME variable, so a trailing
   * row can never be laid out against a different edge than the copy above it.
   */
  const trailingMeasure = panelMedia
    ? cn('lg:w-(--hero-copy)', mediaSide === 'left' && 'lg:ms-auto')
    : undefined

  const panelBlock = panelMedia ? (
    <Reveal
      preset={heroPreset === 'none' ? 'none' : 'fade'}
      trigger="mount"
      index={2}
      className={cn(
        'relative -mx-fx-gutter aspect-[4/3] sm:aspect-[3/2]',
        'lg:absolute lg:inset-y-0 lg:-z-10 lg:mx-0 lg:aspect-auto',
        mediaSide === 'left'
          ? 'lg:left-0 lg:right-(--hero-edge)'
          : 'lg:left-(--hero-edge) lg:right-0'
      )}
    >
      <SectionMedia
        media={media}
        overlayOpacity={overlay}
        priority={index === 0}
        fill
      />

      {/* Feathers the panel's INNER edge into the canvas so the photograph
          hands off to the copy instead of ending on a hard vertical seam. Only
          at `lg`: below it the panel spans the full width and there is no inner
          edge to soften. Drawn in `--fx-canvas`, which every banded `Section`
          variant now rebinds to the surface it actually paints — otherwise a
          "Subtle Band" hero feathered the photograph into a near-white smear
          against a grey band instead of dissolving into it. */}
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-y-0 hidden w-24 lg:block',
          mediaSide === 'left'
            ? 'right-0 bg-[linear-gradient(to_left,var(--fx-canvas),transparent)]'
            : 'left-0 bg-[linear-gradient(to_right,var(--fx-canvas),transparent)]'
        )}
      />
    </Reveal>
  ) : null

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      clip
      containerSize="wide"
      {...(section.anchor ? { id: section.anchor } : {})}
      // Only labelled when there is no headline to name the region; a landmark
      // with both a heading and an aria-label announces the label and hides the
      // heading from the region name.
      {...(heading ? {} : { 'aria-label': t('Introduction') })}
      // The panel composition's one geometry input, declared on the section so
      // both coordinate spaces below it — the out-of-flow panel and everything
      // inside the container — resolve from the same source.
      {...(panelVars ? { style: panelVars } : {})}
      // `isolate` keeps every negative-z layer (backdrop, full-bleed artwork)
      // inside this section instead of sliding behind the page background.
      className="isolate"
    >
      {/* Full-bleed artwork sits outside the container so it reaches the
          viewport edge, behind the content but above the section background.
          The atmospheric backdrop is suppressed then — two competing washes
          over a photograph is noise, not depth. */}
      {fullBleed ? (
        <div className="absolute inset-0 -z-10">
          <SectionMedia
            media={media}
            overlayOpacity={effectiveOverlay}
            priority={index === 0}
            fill
          />
        </div>
      ) : (
        <HeroBackdrop centered={centered} bloom={!panelMedia} />
      )}

      <div ref={contentRef} className="flex flex-col gap-fx-stack-xl">
        {/* Expressed as `fr` ratios rather than 12-column spans because the
            ratio IS the design decision — spans would make it a fiction of the
            grid track count. `minmax(0,…)` on both tracks is what stops a long
            unbroken string in either column blowing the row past 100vw.

            `framed`: 55/45. The copy column carries an 80px headline at two or
            three lines without the last line orphaning; the card only has to
            hold a figure, so it takes the smaller share.

            `panel`: the copy track is `--hero-copy` — a LENGTH, not a ratio —
            and the other track is `1fr`, a pure spacer holding open the region
            the out-of-flow panel occupies. Flipped when the artwork is on the
            left, which is also the order the copy cell flips in.

            Stating the copy track outright is what removes the old constraint
            on this file. It used to be a `1 / 1.22` ratio that had to be kept
            in arithmetic agreement, by hand, with two other numbers — and the
            gap between the tracks silently entered that arithmetic too, so
            `xl:gap-20` moved the copy's right edge. Now the gap only ever eats
            into the spacer, and the copy's edge is the same variable the panel
            positions itself against. */}
        <div
          className={cn(
            splitAside && 'grid items-center gap-fx-stack-lg xl:gap-20',
            splitAside &&
              !panelMedia &&
              'lg:grid-cols-[minmax(0,1.22fr)_minmax(0,1fr)]',
            panelMedia &&
              (mediaSide === 'left'
                ? 'lg:grid-cols-[minmax(0,1fr)_minmax(0,var(--hero-copy))]'
                : 'lg:grid-cols-[minmax(0,var(--hero-copy))_minmax(0,1fr)]')
          )}
        >
          <div className={cn(splitAside && mediaSide === 'left' && 'lg:order-2')}>
            {textColumn}
          </div>

          {splitAside ? (
            <div
              className={cn(
                mediaSide === 'left' && 'lg:order-1',
                // With the panel out of flow this cell holds nothing but the
                // track open, so it needs its own height or a short hero would
                // collapse the band and leave the panel a letterbox strip. A
                // floor, not a fixed height: a long headline still wins.
                panelMedia && 'lg:min-h-[20rem] xl:min-h-[23rem]'
              )}
            >
              {hasMedia ? (panelMedia ? panelBlock : framedMedia) : statPanel}
            </div>
          ) : null}
        </div>

        {/* The centered layout places the artwork under the copy.

            NOT full-bleed: there the same asset is already painted across the
            whole section above, so rendering the framed card here put the
            identical image on the page twice — and the card is built with the
            raw `overlay`, which would have walked straight past the
            FULL_BLEED_MIN_OVERLAY contrast floor the background layer honours.
            The condition is on the LAYOUT rather than on `framedMedia`, since
            `splitAside` being false is true of both layouts. */}
        {!splitAside && !fullBleed ? framedMedia : null}

        {statsInline ? (
          <Reveal
            preset={heroPreset}
            trigger="mount"
            index={6}
            className={trailingMeasure}
          >
            <ul
              aria-label={t('Key figures')}
              className={cn(
                'grid gap-x-10 gap-y-8 sm:grid-cols-2',
                // Four across is right at the container's full width; inside
                // the copy half it would give each figure ~140px, which is
                // narrower than the numerals it has to hold.
                panelMedia ? 'lg:grid-cols-2' : 'lg:grid-cols-4',
                centered && 'text-center'
              )}
            >
              {stats.map((stat) => (
                <HeroStat key={stat.uuid} block={stat} variant="row" />
              ))}
            </ul>
          </Reveal>
        ) : null}

        {quote && !statsInAside ? (
          <Reveal
            preset={heroPreset}
            trigger="mount"
            index={7}
            className={cn(centered && 'mx-auto text-center', trailingMeasure)}
          >
            <HeroQuote
              quote={quote}
              variant="standalone"
              {...(quoteAuthor ? { author: quoteAuthor } : {})}
            />
          </Reveal>
        ) : null}

        {scrollCue ? (
          <div
            className={cn(
              'flex',
              centered ? 'justify-center' : 'justify-start',
              trailingMeasure
            )}
          >
            <button
              type="button"
              onClick={handleScrollCue}
              className={cn(
                'group inline-flex items-center gap-3 rounded-fx-pill py-1 pr-2',
                'text-fx-meta font-medium uppercase tracking-[0.14em] text-fx-ink-faint',
                'transition-colors duration-200 ease-fx hover:text-fx-ink',
                'motion-reduce:transition-none fx-focus'
              )}
            >
              <span
                aria-hidden="true"
                className={cn(
                  'flex size-9 items-center justify-center rounded-full',
                  'border border-fx-line bg-fx-surface text-fx-accent-text',
                  'transition-[transform,border-color] duration-300 ease-fx',
                  'group-hover:translate-y-0.5 group-hover:border-fx-accent-line',
                  'motion-reduce:transition-none motion-reduce:group-hover:translate-y-0'
                )}
              >
                <ArrowDown className="size-4" />
              </span>
              {scrollCue}
            </button>
          </div>
        ) : null}
      </div>
    </Section>
  )
}

export default HeroSplit
