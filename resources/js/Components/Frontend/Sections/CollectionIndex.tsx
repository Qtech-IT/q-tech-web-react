import { useMemo, useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { ArrowRight, ChevronLeft, ChevronRight, ImageOff, Search, SearchX } from 'lucide-react'

import { NavIcon, isRegisteredNavIcon } from '@/Components/Public/NavIcon'
import { Section } from '@/Components/Public/Section'
import { fxButton } from '@/Components/Public/fxButton'
import { SafeImage } from '@/Components/UI/SafeImage'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
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
import type { CmsCollectionMeta, CmsPageCard } from '@/Types/cms'
import type { SectionComponentProps } from '@/Types/sections'

const LAYOUTS = ['card', 'icon', 'list'] as const
const COLUMNS = ['2', '3', '4'] as const
const ALIGNMENTS = ['center', 'start'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const
const ACCENTS = ['brand', 'ink', 'amber', 'teal', 'violet', 'rose'] as const

type Accent = (typeof ACCENTS)[number]
type Layout = (typeof LAYOUTS)[number]

/** Cycled by position when a page carries no accent of its own. */
const ACCENT_CYCLE = ['brand', 'violet', 'teal', 'amber', 'rose', 'ink'] as const

function cycledAccent(index: number): Accent {
  return ACCENT_CYCLE[index % ACCENT_CYCLE.length] as Accent
}

/**
 * A page's stored `accent` is a loose VARCHAR — the column is deliberately not
 * an enum, so the design system can gain a colour without a migration. That
 * makes validating it the renderer's job: an unrecognised value falls back to
 * the positional cycle rather than indexing a class map with `undefined`.
 */
function accentOf(value: string | null, index: number): Accent {
  return ACCENTS.includes(value as Accent) ? (value as Accent) : cycledAccent(index)
}

/*
 * Static class maps, indexed by values already constrained above. Tailwind
 * compiles by scanning source text and never sees an assembled string.
 */

/** The icon tile. */
const ICON_CLASSES = {
  brand: 'bg-fx-mark-brand/12 text-fx-mark-brand',
  ink: 'bg-fx-mark-ink/10 text-fx-mark-ink',
  amber: 'bg-fx-mark-amber/12 text-fx-mark-amber',
  teal: 'bg-fx-mark-teal/12 text-fx-mark-teal',
  violet: 'bg-fx-mark-violet/12 text-fx-mark-violet',
  rose: 'bg-fx-mark-rose/12 text-fx-mark-rose',
} as const

/** The hairline that lights up along the card's top edge on hover. */
const EDGE_CLASSES = {
  brand: 'bg-fx-mark-brand',
  ink: 'bg-fx-mark-ink',
  amber: 'bg-fx-mark-amber',
  teal: 'bg-fx-mark-teal',
  violet: 'bg-fx-mark-violet',
  rose: 'bg-fx-mark-rose',
} as const

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
 * An ISO instant as a short, localised date — or null.
 *
 * `Intl` rather than a hand-rolled format so a blog index reads correctly in
 * every locale the site ships, including Arabic, without a second code path.
 * Wrapped because an invalid stored value must degrade to no date rather than
 * rendering "Invalid Date" on a card.
 */
function formatDate(iso: string | null, locale: string | undefined): string | null {
  if (!iso) {
    return null
  }

  const parsed = new Date(iso)

  if (Number.isNaN(parsed.getTime())) {
    return null
  }

  try {
    return new Intl.DateTimeFormat(locale || undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(parsed)
  } catch {
    return null
  }
}

function cardPreset(animation: (typeof ANIMATIONS)[number]) {
  return animation === 'rise' ? 'stagger' : animation
}

/**
 * One listed page.
 *
 * THE WHOLE CARD IS CLICKABLE, and it is done with a stretched pseudo-element
 * on the title link rather than by wrapping the card in an anchor. Wrapping
 * would fold the excerpt into the link's accessible name, so a screen reader
 * would announce the title plus two sentences of summary as one enormous link
 * label. This way the accessible name is the page title and the hit area is
 * still the card.
 */
function IndexCard({
  card,
  index,
  layout,
  preset,
  headingLevel,
  showDate,
  locale,
}: {
  card: CmsPageCard
  index: number
  layout: Layout
  preset: 'none' | 'fade' | 'stagger'
  headingLevel: 'h2' | 'h3'
  /** Blog and case-study listings date themselves; services must not. */
  showDate: boolean
  locale: string | undefined
}) {
  const { t } = useTranslations()

  const accent = accentOf(card.accent, index)
  const excerpt = trimmed(card.excerpt)
  const media = card.media ?? null
  const icon = card.icon ?? undefined
  const Heading = headingLevel

  const compact = layout === 'list'
  const dateLabel = showDate ? formatDate(card.published_at, locale) : null
  // Image cards fall back to the icon treatment when the page has no artwork,
  // so a half-illustrated set still lines up instead of leaving holes.
  const showMedia = layout === 'card' && Boolean(media?.url)
  const showIcon = !showMedia && !compact

  return (
    <Reveal
      as="li"
      preset={preset}
      index={index}
      className={cn(
        'group/card relative isolate flex flex-col overflow-hidden',
        'rounded-fx-xl border border-fx-line bg-fx-surface fx-raise-1',
        'transition-[border-color,box-shadow,transform] duration-300 ease-fx',
        'hover:-translate-y-1 hover:border-fx-accent-line hover:fx-raise-3',
        'has-[a:focus-visible]:border-fx-accent-line has-[a:focus-visible]:fx-raise-3',
        'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
        compact ? 'p-5' : 'p-0'
      )}
    >
      {/* The lit top edge. Decorative, so it is a span rather than a border —
          a border would shift the card's box by a pixel on hover. */}
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none absolute inset-x-0 top-0 h-0.5 origin-left scale-x-0',
          'transition-transform duration-300 ease-fx group-hover/card:scale-x-100',
          'motion-reduce:transition-none',
          EDGE_CLASSES[accent]
        )}
      />

      {showMedia && media ? (
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-fx-surface-2">
          <SafeImage
            src={media.url}
            alt={media.alt_text ?? ''}
            {...(media.width ? { width: media.width } : {})}
            {...(media.height ? { height: media.height } : {})}
            loading="lazy"
            className={cn(
              'h-full w-full object-cover',
              'transform-gpu transition-transform duration-500 ease-fx',
              'group-hover/card:scale-105',
              'motion-reduce:transition-none motion-reduce:group-hover/card:scale-100'
            )}
          />
        </div>
      ) : null}

      <div
        className={cn(
          'flex flex-1 flex-col gap-3',
          compact ? 'p-0' : 'p-6',
          showMedia && 'pt-5'
        )}
      >
        {showIcon ? (
          <span
            aria-hidden="true"
            className={cn(
              'flex size-11 items-center justify-center rounded-fx-md',
              ICON_CLASSES[accent]
            )}
          >
            {isRegisteredNavIcon(icon) ? (
              <NavIcon name={icon} className="size-5" />
            ) : (
              // Not an error state — a page published before anyone chose an
              // icon. The initial keeps the tile the same size and shape as
              // its neighbours, which is what a missing glyph must not break.
              <span className="text-fx-body font-semibold">
                {[...(card.title ?? '')][0]?.toUpperCase() ?? ''}
              </span>
            )}
          </span>
        ) : null}

        {dateLabel ? (
          // `<time>` with the machine value in `dateTime` and the localised
          // string as the text: one is for a crawler, the other for a reader,
          // and neither has to compromise for the other.
          <time
            dateTime={card.published_at ?? undefined}
            className="text-fx-meta text-fx-ink-faint"
          >
            {dateLabel}
          </time>
        ) : null}

        <Heading className="text-fx-subheading font-semibold text-balance text-fx-ink">
          <Link
            href={card.path}
            // Stretches this one link over the whole card — see the note above
            // for why the card is not wrapped in an anchor.
            className={cn(
              'after:absolute after:inset-0 after:content-[""]',
              'rounded-fx-xs transition-colors duration-200 ease-fx',
              'group-hover/card:text-fx-accent-text',
              'focus-visible:outline-none',
              'motion-reduce:transition-none'
            )}
          >
            {card.title}
          </Link>
        </Heading>

        {excerpt ? (
          // Clamped rather than truncated server-side: the excerpt is stored
          // whole, so a wider card at a larger breakpoint simply shows more of
          // it, and nothing is lost if the design changes.
          <p className="line-clamp-3 text-fx-body-sm text-pretty text-fx-ink-soft">
            {excerpt}
          </p>
        ) : null}

        <span
          aria-hidden="true"
          className={cn(
            'mt-auto inline-flex items-center gap-1.5 pt-2',
            'text-fx-meta font-medium text-fx-ink-faint',
            'transition-colors duration-200 ease-fx',
            'group-hover/card:text-fx-accent-text',
            'motion-reduce:transition-none'
          )}
        >
          {t('Learn more')}
          <ArrowRight
            className={cn(
              'size-3.5 transition-transform duration-300 ease-fx rtl:rotate-180',
              'group-hover/card:translate-x-0.5',
              'motion-reduce:transition-none motion-reduce:group-hover/card:translate-x-0'
            )}
          />
        </span>
      </div>
    </Reveal>
  )
}

/**
 * Build a URL for this listing with one query parameter changed.
 *
 * Preserves every OTHER parameter already on the URL, so paginating does not
 * silently drop an active search term and searching does not strand the reader
 * on page four of results that no longer exist. `page` is reset on a new search
 * for exactly that second reason.
 */
function listingUrl(changes: Record<string, string | number | null>): string {
  if (typeof window === 'undefined') {
    return '#'
  }

  const url = new URL(window.location.href)

  for (const [key, value] of Object.entries(changes)) {
    if (value === null || value === '') {
      url.searchParams.delete(key)
    } else {
      url.searchParams.set(key, String(value))
    }
  }

  return url.pathname + url.search + url.hash
}

/**
 * The search box.
 *
 * A real `<form>` with a submit, not a keystroke-debounced live filter. Three
 * reasons: the results come from the server so every keystroke would be a round
 * trip; a URL that changes as you type makes the back button unusable; and a
 * submitted search is a shareable link, which a live filter is not.
 *
 * `preserveScroll` keeps the reader where they were rather than throwing them
 * to the top of the page on every search.
 */
function ListingSearch({
  term,
  anchor,
  resultCount,
}: {
  term: string
  anchor: string | undefined
  resultCount: number
}) {
  const { t } = useTranslations()
  const [value, setValue] = useState(term)

  return (
    <form
      role="search"
      className="flex w-full max-w-md gap-2"
      onSubmit={(event) => {
        event.preventDefault()
        router.visit(listingUrl({ q: value.trim() || null, page: null }), {
          preserveScroll: true,
          preserveState: false,
        })
      }}
    >
      <label htmlFor={`${anchor ?? 'listing'}-search`} className="sr-only">
        {t('Search')}
      </label>

      <div className="relative flex-1">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-fx-ink-faint"
        />
        <input
          id={`${anchor ?? 'listing'}-search`}
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={t('Search…')}
          className={cn(
            'h-11 w-full rounded-fx-pill border border-fx-line bg-fx-surface ps-9 pe-4',
            'text-fx-body-sm text-fx-ink placeholder:text-fx-ink-faint',
            'transition-colors duration-200 ease-fx',
            'focus-visible:border-fx-accent-line focus-visible:outline-2',
            'focus-visible:outline-offset-2 focus-visible:outline-fx-focus',
            'motion-reduce:transition-none'
          )}
        />
      </div>

      <button
        type="submit"
        className={cn(
          'h-11 shrink-0 rounded-fx-pill border border-fx-line bg-fx-surface px-5',
          'text-fx-body-sm font-medium text-fx-ink',
          'transition-colors duration-200 ease-fx hover:bg-fx-surface-2',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fx-focus',
          'motion-reduce:transition-none'
        )}
      >
        {t('Search')}
      </button>

      {/* Announced to screen readers when the count changes, so a search is not
          a silent event for anyone not watching the grid. */}
      <p aria-live="polite" className="sr-only">
        {t(':count results', { count: resultCount })}
      </p>
    </form>
  )
}

/**
 * Previous / next with a page count between them.
 *
 * Numbered links are deliberately absent: with an unknown number of pages they
 * either wrap onto two rows or need an ellipsis algorithm, and on a listing
 * sorted by recency almost nobody navigates to page six directly. Prev/next
 * plus "Page 2 of 5" is the whole useful surface.
 */
function ListingPagination({ meta }: { meta: CmsCollectionMeta }) {
  const { t } = useTranslations()

  if (!meta.paginated || meta.last_page <= 1) {
    return null
  }

  const hasPrev = meta.current_page > 1
  const hasNext = meta.current_page < meta.last_page

  const linkClass = cn(
    'flex h-11 items-center gap-1.5 rounded-fx-pill border border-fx-line bg-fx-surface px-5',
    'text-fx-body-sm font-medium text-fx-ink',
    'transition-colors duration-200 ease-fx hover:bg-fx-surface-2',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fx-focus',
    'motion-reduce:transition-none'
  )

  return (
    <nav
      aria-label={t('Pagination')}
      className="flex flex-wrap items-center justify-center gap-4 pt-fx-stack-sm"
    >
      {/* A disabled control is rendered as a `span`, never as a link with
          `aria-disabled` — there is no previous page to go to, so there is no
          destination to announce. */}
      {hasPrev ? (
        <Link
          href={listingUrl({ page: meta.current_page - 1 })}
          preserveScroll
          rel="prev"
          className={linkClass}
        >
          <ChevronLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
          {t('Previous')}
        </Link>
      ) : (
        <span className={cn(linkClass, 'opacity-40')} aria-hidden="true">
          <ChevronLeft className="size-4 rtl:rotate-180" />
          {t('Previous')}
        </span>
      )}

      <p className="text-fx-meta text-fx-ink-faint">
        {t('Page :current of :last', {
          current: meta.current_page,
          last: meta.last_page,
        })}
      </p>

      {hasNext ? (
        <Link
          href={listingUrl({ page: meta.current_page + 1 })}
          preserveScroll
          rel="next"
          className={linkClass}
        >
          {t('Next')}
          <ChevronRight aria-hidden="true" className="size-4 rtl:rotate-180" />
        </Link>
      ) : (
        <span className={cn(linkClass, 'opacity-40')} aria-hidden="true">
          {t('Next')}
          <ChevronRight className="size-4 rtl:rotate-180" />
        </span>
      )}
    </nav>
  )
}

/**
 * The index band — a grid of other pages.
 *
 * The rows come from the server, resolved fresh on every request rather than
 * from the page cache, so publishing a service makes it appear here
 * immediately. See `PageRenderService::withCollections()`.
 *
 * THE EMPTY STATE IS A DECISION, not an oversight. Before the first service is
 * published there is nothing to list, and the editor chooses between two honest
 * outcomes: a sentence explaining that (`empty_message`), or the whole band
 * disappearing. What it must never do is render a heading over an empty grid.
 */
export function CollectionIndex({ section, index }: SectionComponentProps) {
  // `locale` drives `Intl` date formatting on dated listings, so a blog index
  // dates itself correctly in every language the site ships.
  const { t, locale } = useTranslations()

  const settings = section.settings

  const layout = readOption(settings, 'layout', LAYOUTS, 'card')
  const columns = readOption(settings, 'columns', COLUMNS, '3')
  const align = readOption(settings, 'align', ALIGNMENTS, 'center')
  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'lg')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'stagger')
  const showDate = readBoolean(settings, 'show_date', false)

  const preset = cardPreset(animation)
  const headerPreset = animation === 'stagger' ? 'fade' : preset

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const highlight = readString(section.data, 'heading_highlight')
  const emptyMessage = readString(section.data, 'empty_message')
  const cta = section.cta ?? null

  // Defensive: `collection` is attached server-side, but a section rendered in
  // the admin preview has never been through that step.
  const cards = useMemo(
    () => (Array.isArray(section.collection) ? section.collection : []),
    [section.collection]
  )

  /*
   * Defensive: `collection_meta` is attached server-side alongside the rows,
   * but a section rendered in the admin preview has never been through that
   * step. A listing with no meta behaves exactly as one that is neither
   * searchable nor paginated, which is the correct degradation.
   */
  const meta = section.collection_meta
  const searchTerm = meta?.term ?? ''
  const isSearching = searchTerm !== ''

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)
  const isEmpty = cards.length === 0

  /*
   * A search that matched nothing must NOT remove the band.
   *
   * Without this the whole section — heading, search box and all — disappears
   * the moment somebody searches for a word that is not there, leaving them on
   * a page with no way to clear the search and no explanation. An empty search
   * result is a different state from an empty listing and gets its own message
   * below.
   */
  if (isEmpty && !emptyMessage && !isSearching) {
    return null
  }

  if (!hasHeader && isEmpty && !cta && !isSearching) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  const sectionHeadingLevel: HeadingLevel = index === 0 ? 'h1' : 'h2'
  // A card title sits one level below the section's own heading, so the page
  // outline stays contiguous wherever an editor drags this band.
  const cardHeadingLevel = sectionHeadingLevel === 'h1' ? 'h2' : 'h3'

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Index') })}
    >
      <div className="flex flex-col gap-fx-stack-lg">
        {hasHeader ? (
          <SectionHeader
            eyebrow={eyebrow}
            heading={headingNode}
            subheading={subheading}
            headingLevel={sectionHeadingLevel}
            headingSize={sectionHeadingLevel}
            align={align}
            preset={headerPreset}
            {...(headingId ? { headingId } : {})}
          />
        ) : null}

        {meta?.searchable ? (
          <Reveal
            preset={headerPreset}
            className={cn('flex', align === 'center' && 'justify-center')}
          >
            <ListingSearch
              term={searchTerm}
              anchor={section.anchor ?? undefined}
              resultCount={meta.total}
            />
          </Reveal>
        ) : null}

        {isEmpty ? (
          <Reveal
            preset={headerPreset}
            className={cn(
              'flex flex-col items-center gap-3 rounded-fx-xl border border-dashed',
              'border-fx-line bg-fx-surface px-6 py-fx-stack-lg text-center'
            )}
          >
            {isSearching ? (
              <>
                <SearchX aria-hidden="true" className="size-6 text-fx-ink-faint" />
                <p className="text-fx-body text-pretty text-fx-ink-soft">
                  {t('Nothing matched “:term”.', { term: searchTerm })}
                </p>
                {/* The way out. A dead-end empty state with no way to clear
                    the search is the most common failure of this pattern. */}
                <Link
                  href={listingUrl({ q: null, page: null })}
                  preserveScroll
                  className={cn(
                    'text-fx-body-sm font-medium text-fx-accent-text underline',
                    'decoration-fx-accent-line underline-offset-4',
                    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fx-focus'
                  )}
                >
                  {t('Clear search')}
                </Link>
              </>
            ) : (
              <>
                <ImageOff aria-hidden="true" className="size-6 text-fx-ink-faint" />
                <p className="text-fx-body text-pretty text-fx-ink-soft">
                  {emptyMessage}
                </p>
              </>
            )}
          </Reveal>
        ) : (
          <ul className={cn('grid grid-cols-1 gap-5', COLUMN_CLASSES[columns])}>
            {cards.map((card, position) => (
              <IndexCard
                key={card.uuid}
                card={card}
                index={position}
                layout={layout}
                preset={preset}
                headingLevel={cardHeadingLevel}
                showDate={showDate}
                locale={locale}
              />
            ))}
          </ul>
        )}

        {meta ? <ListingPagination meta={meta} /> : null}

        {cta ? (
          <Reveal
            preset={headerPreset}
            className={cn('flex', align === 'center' && 'justify-center')}
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

export default CollectionIndex
