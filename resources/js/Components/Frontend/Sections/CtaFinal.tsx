import { useMemo } from 'react'

import { Section } from '@/Components/Public/Section'
import { fxButton } from '@/Components/Public/fxButton'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import { highlightHeading } from '@/Components/Frontend/Sections/Shared/highlight'
import { Reveal } from '@/Components/Frontend/Sections/Shared/Reveal'
import { SectionCta } from '@/Components/Frontend/Sections/Shared/SectionCta'
import { SectionMedia } from '@/Components/Frontend/Sections/Shared/SectionMedia'
import {
  readBoolean,
  readOption,
  readString,
  trimmed,
} from '@/Components/Frontend/Sections/Shared/values'
import type { SectionComponentProps } from '@/Types/sections'

const TONES = ['ink', 'brand', 'violet', 'teal', 'amber', 'rose'] as const
const ALIGNMENTS = ['start', 'center'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const

/**
 * The panel's paint.
 *
 * Every tone is a DARK gradient with the hue mixed into it rather than the hue
 * at full strength: a saturated amber panel with white copy on it fails
 * contrast outright, and one dark enough to pass is no longer amber. Mixing
 * ~28% of the hue into the inverse surface keeps the panel unmistakably tinted
 * and keeps `--fx-inverse-ink` legible on every one of them.
 *
 * `ink` is the untinted case and stays a plain inverse surface — the reference
 * design's black card.
 */
const PANEL_CLASSES = {
  ink: 'bg-[linear-gradient(135deg,var(--fx-inverse),color-mix(in_oklab,var(--fx-inverse)_88%,var(--fx-ink)))]',
  brand:
    'bg-[linear-gradient(135deg,var(--fx-inverse),color-mix(in_oklab,var(--fx-inverse)_72%,var(--fx-mark-brand)))]',
  violet:
    'bg-[linear-gradient(135deg,var(--fx-inverse),color-mix(in_oklab,var(--fx-inverse)_72%,var(--fx-mark-violet)))]',
  teal: 'bg-[linear-gradient(135deg,var(--fx-inverse),color-mix(in_oklab,var(--fx-inverse)_72%,var(--fx-mark-teal)))]',
  amber:
    'bg-[linear-gradient(135deg,var(--fx-inverse),color-mix(in_oklab,var(--fx-inverse)_72%,var(--fx-mark-amber)))]',
  rose: 'bg-[linear-gradient(135deg,var(--fx-inverse),color-mix(in_oklab,var(--fx-inverse)_72%,var(--fx-mark-rose)))]',
} as const

/** The glow in the panel's far corner. Decoration — no contrast duty. */
const GLOW_CLASSES = {
  ink: 'bg-fx-accent/25',
  brand: 'bg-fx-mark-brand/30',
  violet: 'bg-fx-mark-violet/30',
  teal: 'bg-fx-mark-teal/30',
  amber: 'bg-fx-mark-amber/30',
  rose: 'bg-fx-mark-rose/30',
} as const

/**
 * The closing call to action.
 *
 * HOW `merge_footer` WORKS, AND WHY IT IS DONE THIS WAY
 * ----------------------------------------------------
 * The reference design has a dark card sitting ON the footer, with the
 * footer's colour rising to meet its lower half. The obvious implementations
 * are both wrong:
 *
 *  - A negative bottom margin on the section pulls the footer UP over the
 *    panel's own shadow and breaks the moment the footer's top padding
 *    changes.
 *  - Rendering the panel inside the footer makes a CMS section a child of
 *    global chrome — an editor could no longer reorder or remove it.
 *
 * So the section paints its own lower half in the footer's colour instead: an
 * absolutely positioned band pinned to the bottom, exactly as tall as the
 * space below the panel's midpoint. The panel then genuinely sits on a
 * continuous field of that colour, the footer continues it below, and neither
 * component knows anything about the other's box.
 *
 * The band is `-z-10` under an `isolate` section, so it paints above the page
 * background and below the panel — and because it is a sibling rather than a
 * margin, turning `merge_footer` off simply stops rendering it.
 *
 * Renders `null` when there is neither a headline nor a button — the one
 * section here that is nothing without an ask.
 */
export function CtaFinal({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const tone = readOption(settings, 'tone', TONES, 'ink')
  const align = readOption(settings, 'align', ALIGNMENTS, 'start')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'default')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'rise')
  const mergeFooter = readBoolean(settings, 'merge_footer', true)

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const highlight = readString(section.data, 'heading_highlight')
  const footnote = readString(section.data, 'footnote')
  const media = section.media ?? null
  const cta = section.cta ?? null
  const secondaryCta = section.secondary_cta ?? null

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  if (!heading && !cta && !secondaryCta) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  const HeadingTag = index === 0 ? 'h1' : 'h2'
  const centered = align === 'center'

  // A centred panel drops the artwork: a centred headline with a picture
  // beside it has no axis, which is what the field's help text says.
  const showMedia = Boolean(media) && !centered

  return (
    <Section
      spacing={spacing}
      background="default"
      className="isolate"
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Get started') })}
    >
      {mergeFooter ? (
        /*
         * The footer's colour, rising to the panel's midpoint. `h-1/2` is
         * measured against the SECTION, whose height is the panel plus its
         * vertical padding — so the band always meets the panel around the
         * middle regardless of how much copy the editor wrote.
         */
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-fx-inverse"
        />
      ) : null}

      <Reveal preset={animation}>
        <div
          className={cn(
            'relative isolate overflow-hidden rounded-fx-xl',
            'px-6 py-12 sm:px-10 sm:py-14 lg:px-14 lg:py-16',
            'text-fx-inverse-ink shadow-fx-4',
            PANEL_CLASSES[tone],
            /*
             * The panel is a dark surface wherever the page's theme sits, so
             * it rebinds the public ink/line tokens locally — the same
             * technique `Section`'s `inverted` variant uses. Without this,
             * anything nested inside (the footnote, a button's hairline)
             * would ask for `--fx-ink` and get the PAGE's ink, which on a
             * light page is near-black on a near-black panel.
             */
            '[--fx-canvas:var(--fx-inverse)]',
            '[--fx-ink:var(--fx-inverse-ink)]',
            '[--fx-ink-soft:color-mix(in_oklab,var(--fx-inverse-ink)_76%,transparent)]',
            '[--fx-ink-faint:color-mix(in_oklab,var(--fx-inverse-ink)_62%,transparent)]',
            '[--fx-line:color-mix(in_oklab,var(--fx-inverse-ink)_18%,transparent)]',
            '[--fx-accent-text:var(--fx-accent-on-inverse)]',
            '[--fx-focus:var(--fx-accent-on-inverse)]',
            // Buttons are authored for the page canvas; on this panel the
            // primary fill would be near-black on near-black. Same rebinding,
            // same reasoning, as the inverted band.
            '[--fx-btn-primary:var(--fx-inverse-ink)]',
            '[--fx-btn-primary-ink:var(--fx-inverse)]',
            '[--fx-btn-primary-hover:color-mix(in_oklab,var(--fx-inverse-ink)_88%,var(--fx-inverse))]',
            '[--fx-btn-secondary:transparent]',
            '[--fx-btn-secondary-ink:var(--fx-inverse-ink)]',
            '[--fx-btn-secondary-hover:color-mix(in_oklab,var(--fx-inverse-ink)_10%,transparent)]'
          )}
        >
          <span
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute -top-24 -right-16 -z-10',
              'size-72 rounded-full blur-3xl',
              GLOW_CLASSES[tone]
            )}
          />

          <div
            className={cn(
              'flex flex-col gap-10',
              showMedia && 'lg:flex-row lg:items-center lg:justify-between'
            )}
          >
            <div
              className={cn(
                'flex flex-col gap-5',
                centered ? 'mx-auto max-w-2xl text-center items-center' : 'max-w-xl'
              )}
            >
              {eyebrow ? (
                <p className="text-fx-eyebrow uppercase text-fx-ink-faint">
                  {eyebrow}
                </p>
              ) : null}

              {heading ? (
                <HeadingTag
                  {...(headingId ? { id: headingId } : {})}
                  className="text-fx-title text-balance text-fx-ink"
                >
                  {headingNode}
                </HeadingTag>
              ) : null}

              {subheading ? (
                <p className="text-fx-lead text-pretty text-fx-ink-soft">
                  {subheading}
                </p>
              ) : null}

              {cta || secondaryCta ? (
                <div
                  className={cn(
                    'flex flex-wrap gap-3 pt-2',
                    centered && 'justify-center'
                  )}
                >
                  <SectionCta
                    cta={cta}
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
                </div>
              ) : null}

              {footnote ? (
                <p className="text-fx-meta text-fx-ink-faint">{footnote}</p>
              ) : null}
            </div>

            {showMedia ? (
              /*
               * Hidden below `lg` rather than stacked: on a phone the artwork
               * would push the buttons — the only thing this section exists
               * for — below the fold. It is decoration, so it goes.
               */
              <div
                aria-hidden="true"
                className="hidden w-full max-w-md shrink-0 lg:block"
              >
                <SectionMedia
                  media={media}
                  fallbackRatio="4 / 3"
                  className="w-full"
                  mediaClassName="w-full object-contain"
                />
              </div>
            ) : null}
          </div>
        </div>
      </Reveal>
    </Section>
  )
}

export default CtaFinal
