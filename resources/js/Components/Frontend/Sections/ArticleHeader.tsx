import { useMemo, useState } from 'react'
import {
  CalendarDays,
  Check,
  Clock,
  Link as LinkIcon,
  Linkedin,
  Twitter,
} from 'lucide-react'

import { Section } from '@/Components/Public/Section'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import { blocksOfType } from '@/Components/Frontend/Sections/Shared/blocks'
import { Reveal } from '@/Components/Frontend/Sections/Shared/Reveal'
import { SectionMedia } from '@/Components/Frontend/Sections/Shared/SectionMedia'
import {
  readBoolean,
  readOption,
  readString,
  trimmed,
} from '@/Components/Frontend/Sections/Shared/values'
import type { CmsSectionBlock } from '@/Types/cms'
import type { SectionComponentProps } from '@/Types/sections'

const ALIGNMENTS = ['start', 'center'] as const
const SHAPES = ['wide', 'landscape', 'classic'] as const
const THEMES = ['default', 'subtle'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise'] as const

/**
 * `aspect-ratio` on the FRAME, `object-cover` on the image — so the editor's
 * chosen shape holds whatever they upload and the box is reserved before the
 * file arrives. That is what keeps this section's contribution to CLS at zero.
 */
const SHAPE_CLASSES = {
  wide: 'aspect-[21/9]',
  landscape: 'aspect-[16/9]',
  classic: 'aspect-[4/3]',
} as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
} as const

/**
 * The author's initials — by CODE POINT, not by UTF-16 unit.
 *
 * `name.slice(0, 1)` cuts an astral-plane character (an emoji, many CJK
 * extensions) in half and renders the replacement glyph. Spreading a string
 * iterates code points, which is correct for every name this will ever see.
 */
function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean)
  const picked = words.length > 1 ? [words[0], words[words.length - 1]] : words.slice(0, 1)

  return picked
    .map((word) => [...(word ?? '')][0] ?? '')
    .join('')
    .toUpperCase()
}

/** A tag worth rendering — has a label. */
function hasContent(block: CmsSectionBlock): boolean {
  return Boolean(trimmed(block.label))
}

/**
 * Share links for an article.
 *
 * PLAIN LINKS AND A CLIPBOARD CALL — no third-party SDKs. A LinkedIn or X share
 * button loaded from their script tag is a tracker on every article page,
 * present whether or not anybody clicks it, and it needs consent before it may
 * even load. Two `https://…/share?url=` links and `navigator.clipboard` do the
 * same job, load nothing, and work with JavaScript disabled for the two links.
 *
 * The copy button is the one that needs JS, so it is the only one rendered as a
 * `<button>`, and it falls back to doing nothing visible rather than erroring
 * where the Clipboard API is unavailable (insecure origins, older browsers).
 */
function ShareRow({ title }: { title: string }) {
  const { t } = useTranslations()
  const [copied, setCopied] = useState(false)

  // Resolved at render rather than stored: the canonical URL of an article is
  // wherever it is being read, and an SSR pass has no location to read.
  const url = typeof window === 'undefined' ? '' : window.location.href

  const itemClass = cn(
    'flex size-9 items-center justify-center rounded-fx-pill border border-fx-line',
    'bg-fx-surface text-fx-ink-faint',
    'transition-colors duration-200 ease-fx hover:bg-fx-surface-2 hover:text-fx-ink',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fx-focus',
    'motion-reduce:transition-none'
  )

  async function copy() {
    if (!url || typeof navigator === 'undefined' || !navigator.clipboard) {
      return
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      // Denied permission or an insecure origin. The two share links still
      // work, so there is nothing useful to tell the reader here.
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-fx-meta text-fx-ink-faint">{t('Share')}</span>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={itemClass}
      >
        <Linkedin aria-hidden="true" className="size-4" />
        <span className="sr-only">{t('Share on LinkedIn')}</span>
      </a>

      <a
        href={`https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className={itemClass}
      >
        <Twitter aria-hidden="true" className="size-4" />
        <span className="sr-only">{t('Share on X')}</span>
      </a>

      <button type="button" onClick={copy} className={itemClass}>
        {copied ? (
          <Check aria-hidden="true" className="size-4 text-fx-mark-teal" />
        ) : (
          <LinkIcon aria-hidden="true" className="size-4" />
        )}
        {/* The label changes rather than a toast appearing, and `aria-live`
            announces it — a copy confirmation nobody can perceive is not a
            confirmation. */}
        <span className="sr-only" aria-live="polite">
          {copied ? t('Link copied') : t('Copy link')}
        </span>
      </button>
    </div>
  )
}

/**
 * The opening block of a blog post or case study.
 *
 * WHAT IT IS FOR. A marketing hero sells; this orients. Category, title,
 * standfirst, who wrote it, when, and how long it takes — the things a reader
 * checks before committing. See `ArticleHeaderType` for why the date is a field
 * rather than the page's publish timestamp.
 *
 * MEASURE. The text runs on the prose measure even though the lead image goes
 * full width. A standfirst set across 1320px is unreadable, and dropping the
 * image to the same width wastes the one element on the page that benefits from
 * scale.
 *
 * EVERY REGION IS OPTIONAL AND DEGRADES ON ITS OWN. No author renders the date
 * alone; neither renders no meta row at all rather than an empty rule; no image
 * simply ends the header after the tags.
 *
 * Renders `null` when there is no title, no standfirst and no image — the state
 * a section is in between "added" and "written".
 */
export function ArticleHeader({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const align = readOption(settings, 'align', ALIGNMENTS, 'start')
  const shape = readOption(settings, 'media_shape', SHAPES, 'landscape')
  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'default')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'rise')
  const showShare = readBoolean(settings, 'show_share', true)

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const standfirst = trimmed(section.subheading)
  const author = readString(section.data, 'author_name')
  const authorRole = readString(section.data, 'author_role')
  const publishedLabel = readString(section.data, 'published_label')
  const readTime = readString(section.data, 'read_time')
  const media = section.media ?? null

  const tags = useMemo(
    () => blocksOfType(section.blocks, 'tag').filter(hasContent),
    [section.blocks]
  )

  if (!heading && !standfirst && !media) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  // Position 0 owns the page's single `h1` — which on an article page it always
  // is, but the rule is positional so an editor reordering sections cannot
  // produce a page with two `h1`s or none.
  const Heading = index === 0 ? 'h1' : 'h2'
  const centered = align === 'center'

  const hasMeta = Boolean(author || publishedLabel || readTime)

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      /* Read by the sibling rule in `frontend.css` that collapses the doubled
         band padding between this header and the article body under it. */
      data-section-type="article.header"
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Article header') })}
    >
      <div className="flex flex-col gap-fx-stack-lg">
        <Reveal
          preset={animation}
          className={cn(
            // The prose measure, not the page measure — see the note above.
            'flex max-w-fx-prose flex-col gap-fx-stack-sm',
            centered && 'mx-auto items-center text-center'
          )}
        >
          {eyebrow ? (
            <p className="text-fx-eyebrow uppercase text-fx-accent-text">
              {eyebrow}
            </p>
          ) : null}

          {heading ? (
            <Heading
              {...(headingId ? { id: headingId } : {})}
              className="text-balance text-fx-title text-fx-ink"
            >
              {heading}
            </Heading>
          ) : null}

          {standfirst ? (
            <p className="text-pretty text-fx-lead text-fx-ink-soft">
              {standfirst}
            </p>
          ) : null}

          {hasMeta ? (
            <div
              className={cn(
                'mt-fx-stack-sm flex flex-wrap items-center gap-x-4 gap-y-3',
                'border-t border-fx-line pt-fx-stack-sm',
                centered && 'justify-center'
              )}
            >
              {author ? (
                <div className="flex items-center gap-3">
                  {/* Initials rather than a photo. One `media_id` column
                      exists and the lead image owns it — see the type's note. */}
                  <span
                    aria-hidden="true"
                    className={cn(
                      'flex size-9 shrink-0 items-center justify-center rounded-fx-pill',
                      'bg-fx-wash-accent text-fx-meta font-semibold text-fx-accent-text'
                    )}
                  >
                    {initialsOf(author)}
                  </span>

                  <span className="flex flex-col">
                    <span className="text-fx-body-sm font-medium text-fx-ink">
                      {author}
                    </span>
                    {authorRole ? (
                      <span className="text-fx-meta text-fx-ink-faint">
                        {authorRole}
                      </span>
                    ) : null}
                  </span>
                </div>
              ) : null}

              {/* A hairline between the byline and the timings, but only when
                  both sides exist — a rule with nothing on one side of it
                  reads as a rendering fault. */}
              {author && (publishedLabel || readTime) ? (
                <span
                  aria-hidden="true"
                  className="hidden h-8 w-px bg-fx-line sm:block"
                />
              ) : null}

              {publishedLabel || readTime ? (
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-fx-meta text-fx-ink-faint">
                  {publishedLabel ? (
                    <span className="flex items-center gap-1.5">
                      <CalendarDays aria-hidden="true" className="size-3.5" />
                      {publishedLabel}
                    </span>
                  ) : null}

                  {readTime ? (
                    <span className="flex items-center gap-1.5">
                      <Clock aria-hidden="true" className="size-3.5" />
                      {readTime}
                    </span>
                  ) : null}
                </div>
              ) : null}

              {showShare && heading ? (
                // Pushed to the far end of the meta row on wide screens and
                // wrapping underneath on narrow ones, so it never competes
                // with the byline for the first thing read.
                <div className="w-full sm:ms-auto sm:w-auto">
                  <ShareRow title={heading} />
                </div>
              ) : null}
            </div>
          ) : null}

          {tags.length > 0 ? (
            <ul className={cn('flex flex-wrap gap-2 pt-1', centered && 'justify-center')}>
              {tags.map((tag) => (
                <li
                  key={tag.uuid}
                  className={cn(
                    'rounded-fx-pill border border-fx-line bg-fx-surface-2 px-3 py-1',
                    'text-fx-meta font-medium text-fx-ink-soft'
                  )}
                >
                  {trimmed(tag.label)}
                </li>
              ))}
            </ul>
          ) : null}
        </Reveal>

        {media ? (
          <Reveal preset={animation}>
            <div
              className={cn(
                // `relative` is load-bearing, not decoration. `SectionMedia`
                // with `fill` renders `absolute inset-0`, which resolves
                // against the nearest POSITIONED ancestor — without this that
                // is the `<Section>`, so the lead image escaped its aspect box
                // and stretched over the whole band at every viewport.
                'relative w-full overflow-hidden rounded-fx-xl border border-fx-line',
                'bg-fx-surface-2 fx-raise-2',
                SHAPE_CLASSES[shape]
              )}
            >
              <SectionMedia
                media={media}
                fill
                // The lead image of an article is above the fold by
                // definition, so it loads eagerly — a lazily loaded one here
                // is a guaranteed LCP regression.
                priority={index === 0}
                className="h-full w-full"
                mediaClassName="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        ) : null}
      </div>
    </Section>
  )
}

export default ArticleHeader
