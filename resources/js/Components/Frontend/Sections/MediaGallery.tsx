import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
import { SectionMedia } from '@/Components/Frontend/Sections/Shared/SectionMedia'
import {
  readOption,
  readString,
  trimmed,
} from '@/Components/Frontend/Sections/Shared/values'
import type { CmsSectionBlock } from '@/Types/cms'
import type { SectionComponentProps } from '@/Types/sections'

const DISPLAYS = ['slider', 'grid'] as const
const RATIOS = ['wide', 'screen', 'classic', 'square'] as const
const COLUMNS = ['2', '3'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'stagger'] as const

/**
 * `aspect-ratio` on the FRAME, `object-cover` on the image — so a mixed set of
 * uploads still lines up and every box is reserved before its file arrives.
 */
const RATIO_CLASSES = {
  wide: 'aspect-[16/9]',
  screen: 'aspect-[16/10]',
  classic: 'aspect-[4/3]',
  square: 'aspect-square',
} as const

const COLUMN_CLASSES = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
} as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

/** A row worth rendering — an image with a URL. */
function hasImage(block: CmsSectionBlock): boolean {
  return Boolean(block.media?.url)
}

/** The alt text for one shot: the editor's override, else the asset's own. */
function altFor(block: CmsSectionBlock): string {
  return trimmed(block.description) ?? block.media?.alt_text?.trim() ?? ''
}

/**
 * The slider: one large image, thumbnails beneath, previous/next either side.
 *
 * NO AUTOPLAY, and there is no setting for one. Content that moves without
 * being asked fails WCAG 2.2.2 unless it can be paused, and on a portfolio the
 * reader is the one deciding which shot to study.
 *
 * KEYBOARD. Left/right arrows move between shots while the slider has focus,
 * and every thumbnail is a real button in the tab order — so the gallery is
 * fully operable without a pointer, which a swipe-only carousel is not.
 *
 * ANNOUNCEMENTS. The live region reports "3 of 8" on change rather than the
 * image itself, because the images already carry alt text and announcing both
 * would read the same content twice.
 */
function GallerySlider({
  shots,
  ratio,
}: {
  shots: CmsSectionBlock[]
  ratio: (typeof RATIOS)[number]
}) {
  const { t } = useTranslations()
  const [active, setActive] = useState(0)
  const thumbRefs = useRef<Array<HTMLButtonElement | null>>([])

  const total = shots.length
  const current = shots[Math.min(active, total - 1)]

  const go = useCallback(
    (next: number) => {
      // Wraps deliberately: at the last shot, "next" returning to the first is
      // less surprising than a control that silently stops responding.
      setActive(((next % total) + total) % total)
    },
    [total]
  )

  // An editor deleting the shot that is currently open must not leave the
  // slider pointing past the end of the list.
  useEffect(() => {
    if (active > total - 1) {
      setActive(0)
    }
  }, [active, total])

  if (!current) {
    return null
  }

  return (
    <div
      role="group"
      aria-roledescription={t('Gallery')}
      aria-label={t('Project images')}
      className="flex flex-col gap-4"
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault()
          go(active - 1)
        }

        if (event.key === 'ArrowRight') {
          event.preventDefault()
          go(active + 1)
        }
      }}
    >
      <div className="relative">
        <div
          className={cn(
            // `relative` is load-bearing: `SectionMedia` with `fill` is
            // `absolute inset-0` and resolves against the nearest positioned
            // ancestor, so without this the image escapes its ratio box.
            'relative w-full overflow-hidden rounded-fx-xl border border-fx-line',
            'bg-fx-surface-2 fx-raise-2',
            RATIO_CLASSES[ratio]
          )}
        >
          <SectionMedia
            key={current.uuid}
            media={current.media}
            fill
            className="h-full w-full"
            mediaClassName="h-full w-full object-cover"
          />
        </div>

        {total > 1 ? (
          <>
            <SliderButton
              side="start"
              label={t('Previous image')}
              onClick={() => go(active - 1)}
            />
            <SliderButton
              side="end"
              label={t('Next image')}
              onClick={() => go(active + 1)}
            />
          </>
        ) : null}
      </div>

      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
        {trimmed(current.label) ? (
          <p className="text-fx-body-sm text-fx-ink-soft">{trimmed(current.label)}</p>
        ) : (
          <span />
        )}

        {total > 1 ? (
          <p aria-live="polite" className="text-fx-meta text-fx-ink-faint">
            {t(':current of :total', { current: active + 1, total })}
          </p>
        ) : null}
      </div>

      {total > 1 ? (
        <ul className="flex flex-wrap gap-2">
          {shots.map((shot, index) => (
            <li key={shot.uuid}>
              <button
                type="button"
                ref={(node) => {
                  thumbRefs.current[index] = node
                }}
                onClick={() => setActive(index)}
                aria-current={index === active ? 'true' : undefined}
                className={cn(
                  'relative block overflow-hidden rounded-fx-sm border',
                  'transition-[border-color,opacity] duration-200 ease-fx',
                  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fx-focus',
                  'motion-reduce:transition-none',
                  index === active
                    ? 'border-fx-accent-line opacity-100'
                    : 'border-fx-line opacity-60 hover:opacity-100'
                )}
              >
                <span className="block h-14 w-20 bg-fx-surface-2">
                  {shot.media?.url ? (
                    <img
                      src={shot.media.url}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : null}
                </span>
                {/* Named for a screen reader, since the thumbnail itself is
                    decorative — the large image carries the real alt text. */}
                <span className="sr-only">
                  {t('Show image :n', { n: index + 1 })}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

/** Previous/next, floated over the frame's edge. */
function SliderButton({
  side,
  label,
  onClick,
}: {
  side: 'start' | 'end'
  label: string
  onClick: () => void
}) {
  const Icon = side === 'start' ? ChevronLeft : ChevronRight

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'absolute top-1/2 flex size-10 -translate-y-1/2 items-center justify-center',
        'rounded-fx-pill border border-fx-line bg-fx-surface text-fx-ink',
        'shadow-fx-2 transition-colors duration-200 ease-fx hover:bg-fx-surface-2',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fx-focus',
        'motion-reduce:transition-none',
        // Logical insets so the pair flips with `dir` in Arabic.
        side === 'start' ? 'start-3' : 'end-3'
      )}
    >
      <Icon aria-hidden="true" className="size-5 rtl:rotate-180" />
      <span className="sr-only">{label}</span>
    </button>
  )
}

/**
 * The gallery band — a set of images, as a slider or a grid.
 *
 * Renders `null` when there is neither a header nor one image with a file
 * behind it: a gallery an editor has created but not filled is a normal
 * editorial state, not a hole to paint.
 */
export function MediaGallery({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const display = readOption(settings, 'display', DISPLAYS, 'slider')
  const ratio = readOption(settings, 'ratio', RATIOS, 'screen')
  const columns = readOption(settings, 'columns', COLUMNS, '2')
  const theme = readOption(settings, 'theme', THEMES, 'subtle')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'lg')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'fade')

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const highlight = readString(section.data, 'heading_highlight')
  const cta = section.cta ?? null

  const shots = useMemo(
    () => blocksOfType(section.blocks, 'shot').filter(hasImage),
    [section.blocks]
  )

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)

  if (!hasHeader && shots.length === 0) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  const sectionHeadingLevel: HeadingLevel = index === 0 ? 'h1' : 'h2'
  const preset = animation === 'stagger' ? 'stagger' : animation

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Gallery') })}
    >
      <div className="flex flex-col gap-fx-stack-lg">
        {hasHeader ? (
          <SectionHeader
            eyebrow={eyebrow}
            heading={headingNode}
            subheading={subheading}
            headingLevel={sectionHeadingLevel}
            headingSize={sectionHeadingLevel}
            align="start"
            preset={animation === 'stagger' ? 'fade' : preset}
            {...(headingId ? { headingId } : {})}
          />
        ) : null}

        {shots.length > 0 ? (
          display === 'slider' ? (
            <Reveal preset={animation === 'stagger' ? 'fade' : preset}>
              <GallerySlider shots={shots} ratio={ratio} />
            </Reveal>
          ) : (
            <ul className={cn('grid grid-cols-1 gap-5', COLUMN_CLASSES[columns])}>
              {shots.map((shot, position) => (
                <Reveal
                  as="li"
                  key={shot.uuid}
                  preset={preset}
                  index={position}
                  className="flex flex-col gap-2"
                >
                  <figure className="flex flex-col gap-2">
                    <div
                      className={cn(
                        'relative w-full overflow-hidden rounded-fx-lg border border-fx-line',
                        'bg-fx-surface-2 fx-raise-1',
                        RATIO_CLASSES[ratio]
                      )}
                    >
                      <SectionMedia
                        media={shot.media}
                        fill
                        className="h-full w-full"
                        mediaClassName="h-full w-full object-cover"
                      />
                    </div>

                    {trimmed(shot.label) ? (
                      <figcaption className="text-fx-meta text-fx-ink-faint">
                        {trimmed(shot.label)}
                      </figcaption>
                    ) : null}
                  </figure>
                </Reveal>
              ))}
            </ul>
          )
        ) : null}

        {cta ? (
          <Reveal preset={animation === 'stagger' ? 'fade' : preset} className="flex">
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

export default MediaGallery
