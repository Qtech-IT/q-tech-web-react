import { useMemo } from 'react'
import { Star } from 'lucide-react'

import { Section } from '@/Components/Public/Section'
import { fxButton } from '@/Components/Public/fxButton'
import { SafeImage } from '@/Components/UI/SafeImage'
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

const COLUMNS = ['2', '3'] as const
const ALIGNMENTS = ['center', 'start'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const
const ACCENTS = ['brand', 'ink', 'amber', 'teal', 'violet', 'rose'] as const

type Accent = (typeof ACCENTS)[number]

/** Cycled by position when a card has no `settings.accent`, as everywhere. */
const ACCENT_CYCLE = ['teal', 'violet', 'brand', 'amber', 'rose', 'ink'] as const

function cycledAccent(index: number): Accent {
  return ACCENT_CYCLE[index % ACCENT_CYCLE.length] as Accent
}

/*
 * Static class maps, indexed by values `readOption` has already constrained.
 * Tailwind compiles by scanning source text, so none of these may be built at
 * runtime — `text-fx-mark-${accent}` exists in the DOM and in no stylesheet.
 */

/**
 * The star, and the rating beside it.
 *
 * The hue lands on the STAR only; the number stays on `--fx-ink`. A rating is
 * data a visitor reads and compares across six cards, so it keeps the band's
 * highest-contrast ink while the star carries the colour — the same division
 * of labour the metric cards use for their numerals.
 */
const STAR_CLASSES = {
  brand: 'text-fx-mark-brand',
  ink: 'text-fx-mark-ink',
  amber: 'text-fx-mark-amber',
  teal: 'text-fx-mark-teal',
  violet: 'text-fx-mark-violet',
  rose: 'text-fx-mark-rose',
} as const

/** The card's link, when it has one. */
const LINK_CLASSES = {
  brand: 'text-fx-mark-brand',
  ink: 'text-fx-mark-ink',
  amber: 'text-fx-mark-amber',
  teal: 'text-fx-mark-teal',
  violet: 'text-fx-mark-violet',
  rose: 'text-fx-mark-rose',
} as const

/** The wash that blooms from the card's top-right corner on hover. */
const BLOOM_CLASSES = {
  brand: 'bg-[radial-gradient(65%_55%_at_100%_0%,var(--fx-mark-brand),transparent_70%)]',
  ink: 'bg-[radial-gradient(65%_55%_at_100%_0%,var(--fx-mark-ink),transparent_70%)]',
  amber: 'bg-[radial-gradient(65%_55%_at_100%_0%,var(--fx-mark-amber),transparent_70%)]',
  teal: 'bg-[radial-gradient(65%_55%_at_100%_0%,var(--fx-mark-teal),transparent_70%)]',
  violet: 'bg-[radial-gradient(65%_55%_at_100%_0%,var(--fx-mark-violet),transparent_70%)]',
  rose: 'bg-[radial-gradient(65%_55%_at_100%_0%,var(--fx-mark-rose),transparent_70%)]',
} as const

const COLUMN_CLASSES = {
  '2': 'md:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
} as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

function cardPreset(animation: (typeof ANIMATIONS)[number]) {
  return animation === 'rise' ? 'stagger' : animation
}

/** A row worth rendering — has a quote, or at least someone to attribute. */
function hasContent(block: CmsSectionBlock): boolean {
  return Boolean(trimmed(block.body) || trimmed(block.label))
}

/**
 * One review.
 *
 * MARKUP — `figure` / `blockquote` / `figcaption`, because that is what this
 * is: a quotation with an attribution. The alternative everyone reaches for
 * first — a `div` with a bold name under it — throws away the only structure
 * that tells a screen reader where the quote ends and the reviewer begins.
 *
 * The quote is wrapped in `<q>` rather than typed with curly quotes in the
 * CMS: the browser draws the marks its language actually uses, so a German or
 * Japanese translation is punctuated correctly without the editor knowing the
 * rule — and an editor can never paste a stray `"` into the middle of one.
 */
function TestimonialCard({
  block,
  index,
  lifted,
  preset,
  showRating,
}: {
  block: CmsSectionBlock
  index: number
  /** The first card in `tilt` mode: raised and rotated out of the grid. */
  lifted: boolean
  preset: 'none' | 'fade' | 'stagger'
  showRating: boolean
}) {
  const { t } = useTranslations()

  const quote = trimmed(block.body)
  const name = trimmed(block.label)
  const handle = trimmed(block.description)
  const rating = showRating ? trimmed(block.value) : undefined
  const logo = block.media ?? null
  const cta = block.cta ?? null
  const accent = readOption(block.settings, 'accent', ACCENTS, cycledAccent(index))

  return (
    <Reveal as="li" preset={preset} index={index} className="group/card flex">
      <figure
        className={cn(
          'relative isolate flex flex-1 flex-col gap-5 overflow-hidden',
          'rounded-fx-xl border border-fx-line bg-fx-surface p-6 fx-raise-1',
          'transition-[border-color,box-shadow,transform] duration-300 ease-fx',
          'hover:-translate-y-1 hover:border-fx-accent-line hover:shadow-fx-3',
          // Keyboard parity: reaching the card's link with Tab lights the card
          // the same way hovering it does, so a keyboard user can see which
          // card they are on. Without this the only visible state is the
          // link's own focus ring at the bottom of a tall card.
          'has-[a:focus-visible]:border-fx-accent-line has-[a:focus-visible]:shadow-fx-3',
          'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
          /*
           * The lift, from `lg` up only.
           *
           * A STATIC tilt, not an animated one — it never changes on hover or
           * on scroll, so it is a resting style rather than motion and needs
           * no `motion-reduce` escape hatch. Tailwind v4 writes `rotate`,
           * `scale` and `translate` as separate CSS properties, so this
           * composes with the shared `hover:-translate-y-1` instead of
           * fighting it for the one `transform` slot.
           *
           * Below `lg` the grid is one or two columns wide and a tilted card
           * reads as a rendering fault rather than as a card resting on a
           * stack, so the whole treatment is dropped rather than scaled down.
           * The card keeps its grid cell either way — nothing around it
           * moves, and the section contributes no layout shift.
           */
          lifted && 'lg:-rotate-2 lg:scale-[1.03] lg:shadow-fx-4 lg:hover:shadow-fx-4'
        )}
      >
        {/* Decorative. Opacity only, so it can neither shift layout nor
            promote the card to its own layer while idle. */}
        <span
          aria-hidden="true"
          className={cn(
            'pointer-events-none absolute inset-0 -z-10 opacity-0',
            'transition-opacity duration-500 ease-fx',
            'group-hover/card:opacity-[0.08] motion-reduce:transition-none',
            BLOOM_CLASSES[accent]
          )}
        />

        {logo || rating ? (
          <div className="flex items-center justify-between gap-4">
            {logo ? (
              <SafeImage
                src={logo.url}
                /*
                 * The company mark sits beside the reviewer's name and adds
                 * no information a sighted user gets that a screen-reader
                 * user does not — so with no editor-supplied alt text it is
                 * decorative and takes an empty string. Inventing "Company
                 * logo" here would announce noise on every card.
                 */
                alt={logo.alt_text ?? ''}
                {...(logo.width ? { width: logo.width } : {})}
                {...(logo.height ? { height: logo.height } : {})}
                className="h-6 w-auto max-w-[9rem] object-contain object-left"
              />
            ) : (
              <span aria-hidden="true" />
            )}

            {rating ? (
              <p className="flex shrink-0 items-center gap-1.5">
                <span className="sr-only">{t('Rating')}</span>
                <span className="fx-numerals text-fx-body-lg font-semibold text-fx-ink">
                  {rating}
                </span>
                <Star
                  aria-hidden="true"
                  className={cn('size-4 fill-current', STAR_CLASSES[accent])}
                />
              </p>
            ) : null}
          </div>
        ) : null}

        {quote ? (
          <blockquote className="text-fx-body text-pretty text-fx-ink">
            <q>{quote}</q>
          </blockquote>
        ) : null}

        {name || handle ? (
          <figcaption className="mt-auto flex flex-col gap-0.5 pt-1">
            {name ? (
              <span className="text-fx-subheading font-semibold text-fx-ink">
                {name}
              </span>
            ) : null}

            {handle ? (
              <span className="text-fx-body-sm text-fx-ink-faint">{handle}</span>
            ) : null}
          </figcaption>
        ) : null}

        {cta ? (
          <SectionCta
            cta={cta}
            fallbackVariant="link"
            size="sm"
            buttonClassName={cn(
              fxButton({ tone: 'ghost', scale: 'sm' }),
              'h-auto self-start bg-transparent px-0 hover:bg-transparent',
              LINK_CLASSES[accent],
              '[&_svg]:transition-transform [&_svg]:duration-300 [&_svg]:ease-fx',
              'hover:[&_svg]:translate-x-0.5 hover:[&_svg]:-translate-y-0.5',
              'motion-reduce:hover:[&_svg]:translate-x-0'
            )}
            /*
             * The whole card is the hit area; this link is where it is
             * ANNOUNCED. The figure is `relative`, so `inset-0` resolves to
             * it. Wrapping the card in an anchor instead would fold the
             * quote, the rating and the reviewer's name into the link's
             * accessible name — a screen reader would read the entire
             * testimonial as the destination.
             */
            className="after:absolute after:inset-0 after:content-['']"
          />
        ) : null}
      </figure>
    </Reveal>
  )
}

/**
 * The testimonial wall.
 *
 * COLOUR is spent where it cannot cost legibility: the star, and a wash that
 * only exists on hover. Quote, name and rating all stay on the band's ink
 * tokens, so a six-card wall in six hues still reads as one page and every
 * string on it clears AA in both themes and on all three band backgrounds.
 *
 * MOTION is opacity and transform only — cards rise in on a spring, lift on
 * hover, and the first one sits tilted on large screens. Nothing animates a
 * layout property, so the section contributes zero CLS, and `Reveal` drops
 * the entrance outright under `prefers-reduced-motion` rather than shortening
 * it.
 *
 * Renders `null` when there is neither a header, nor a button, nor one review
 * with something in it — the section's live state on a fresh install.
 */
export function TestimonialWall({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const columns = readOption(settings, 'columns', COLUMNS, '3')
  const align = readOption(settings, 'align', ALIGNMENTS, 'center')
  const theme = readOption(settings, 'theme', THEMES, 'subtle')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'lg')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'stagger')
  const tilt = readBoolean(settings, 'tilt', true)
  const showRating = readBoolean(settings, 'show_rating', true)

  const preset = cardPreset(animation)
  const headerPreset = animation === 'stagger' ? 'fade' : preset

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const highlight = readString(section.data, 'heading_highlight')
  const footnote = readString(section.data, 'footnote')
  const cta = section.cta ?? null

  const testimonials = useMemo(
    () => blocksOfType(section.blocks, 'testimonial').filter(hasContent),
    [section.blocks]
  )

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)

  if (!hasHeader && !cta && testimonials.length === 0) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  const sectionHeadingLevel: HeadingLevel = index === 0 ? 'h1' : 'h2'
  const centered = align === 'center'

  // Only when a second card exists to sit beneath it — a lone tilted card is
  // not "on top of the stack", it is just crooked.
  const liftFirst = tilt && testimonials.length > 1

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('What our clients say') })}
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

        {testimonials.length > 0 ? (
          /*
           * `items-stretch` plus a flex card is what keeps every quote's
           * attribution on the same baseline as its neighbours' regardless of
           * quote length — `mt-auto` on the figcaption does the rest. The
           * alternative, a fixed card height, truncates the longest review on
           * a narrow screen.
           */
          <ul
            className={cn(
              'grid grid-cols-1 items-stretch gap-5',
              COLUMN_CLASSES[columns]
            )}
          >
            {testimonials.map((testimonial, position) => (
              <TestimonialCard
                key={testimonial.uuid}
                block={testimonial}
                index={position}
                lifted={liftFirst && position === 0}
                preset={preset}
                showRating={showRating}
              />
            ))}
          </ul>
        ) : null}

        {footnote ? (
          <p
            className={cn(
              'text-fx-meta text-fx-ink-faint',
              centered && 'text-center'
            )}
          >
            {footnote}
          </p>
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
              buttonClassName={fxButton({ tone: 'outline', scale: 'lg' })}
            />
          </Reveal>
        ) : null}
      </div>
    </Section>
  )
}

export default TestimonialWall
