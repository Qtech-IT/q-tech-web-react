import { Section, sectionVariants } from '@/Components/Public/Section'
import { fxButton } from '@/Components/Public/fxButton'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import { Reveal } from '@/Components/Frontend/Sections/Shared/Reveal'
import { SectionCta } from '@/Components/Frontend/Sections/Shared/SectionCta'
import { SectionMedia } from '@/Components/Frontend/Sections/Shared/SectionMedia'
import {
  readOption,
  readString,
  trimmed,
} from '@/Components/Frontend/Sections/Shared/values'
import type { SectionComponentProps } from '@/Types/sections'

const TONES = ['accent', 'muted', 'inverted'] as const
const ALIGNMENTS = ['center', 'between'] as const

/**
 * Scrim strength for the optional background image.
 *
 * `cta.band` exposes no overlay field, so this is not an editor decision: the
 * copy sits directly on artwork this code has never seen, and a band whose
 * headline is unreadable converts nobody. The veil is drawn in the surface
 * colour by `SectionMedia`, so it works in both themes.
 */
const IMAGE_SCRIM = 82

/**
 * The closing conversion band.
 *
 * `tone` is not a colour choice — the palette is deliberately neutral — it is a
 * choice of *emphasis mechanism*:
 *
 * - `accent`   → an elevated inset panel on the page background. The strongest
 *                option: elevation and inset margin separate it from the section
 *                above without introducing hue.
 * - `muted`    → a flat subtle band, for a quiet mid-page nudge.
 * - `inverted` → a full-width inverted band; flips with the theme so it always
 *                sits at the opposite end of the scale from the page.
 *
 * The inverted surface classes come from `sectionVariants` rather than being
 * re-typed, so the `--foreground` / `--muted-foreground` / `--border` overrides
 * that keep nested text legible cannot drift from the `Section` component.
 */
export function CtaBand({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings
  const data = section.data

  const tone = readOption(settings, 'tone', TONES, 'accent')
  const align = readOption(settings, 'align', ALIGNMENTS, 'center')

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const consentNote = readString(data, 'consent_note')

  const media = section.media ?? null
  const hasMedia = Boolean(media?.url)

  const primaryCta = section.cta ?? null
  const secondaryCta = section.secondary_cta ?? null
  const hasCta = Boolean(
    trimmed(primaryCta?.label) || trimmed(secondaryCta?.label)
  )

  // `cta_id` is required by the section type, but a band can be saved before its
  // target page exists, and a heading with no action is not a CTA band.
  if (!heading && !hasCta) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  const centered = align === 'center'
  const inset = tone === 'accent'
  /** A CTA band is not normally first, but if it is, it owns the `h1`. */
  const HeadingTag = index === 0 ? 'h1' : 'h2'

  const copy = (
    <div
      className={cn(
        'flex flex-col gap-fx-stack-sm',
        centered && 'items-center text-center'
      )}
    >
      {eyebrow ? (
        <p className="text-fx-eyebrow uppercase text-fx-ink-faint">{eyebrow}</p>
      ) : null}

      {heading ? (
        <HeadingTag
          {...(headingId ? { id: headingId } : {})}
          className={cn(
            'text-balance text-fx-ink',
            index === 0 ? 'text-fx-display' : 'text-fx-title'
          )}
        >
          {heading}
        </HeadingTag>
      ) : null}

      {subheading ? (
        <p
          className={cn(
            'text-fx-lead text-pretty text-fx-ink-soft',
            !centered && 'max-w-[58ch]'
          )}
        >
          {subheading}
        </p>
      ) : null}
    </div>
  )

  const body = (
    <Reveal
      preset="rise"
      className={cn(
        'relative flex flex-col gap-fx-stack-lg',
        centered && 'mx-auto max-w-3xl items-center',
        !centered && 'lg:flex-row lg:items-center lg:justify-between lg:gap-12'
      )}
    >
      <div className={cn(!centered && 'lg:flex-1')}>{copy}</div>

      {hasCta || consentNote ? (
        <div
          className={cn(
            'flex flex-col gap-3',
            centered && 'items-center',
            !centered && 'lg:shrink-0'
          )}
        >
          {hasCta ? (
            <div
              className={cn(
                'flex flex-col gap-3 sm:flex-row sm:items-center',
                centered && 'sm:justify-center'
              )}
            >
              <SectionCta
                cta={primaryCta}
                size="lg"
                fallbackVariant="default"
                buttonClassName={fxButton({
                  // `accent` renders an inset inverted panel and `inverted` a
                  // full-width one, so both need the inverted button skin —
                  // the accent fill would drop under 3:1 against a light
                  // inverted band in dark mode.
                  tone: tone === 'muted' ? 'solid' : 'inverse',
                  scale: 'lg',
                })}
              />
              <SectionCta
                cta={secondaryCta}
                size="lg"
                fallbackVariant="outline"
                buttonClassName={fxButton({ tone: 'outline', scale: 'lg' })}
              />
            </div>
          ) : null}

          {consentNote ? (
            <p
              className={cn(
                'text-fx-meta text-fx-ink-faint',
                centered ? 'max-w-md text-center' : 'max-w-sm'
              )}
            >
              {consentNote}
            </p>
          ) : null}
        </div>
      ) : null}
    </Reveal>
  )

  const backdrop = hasMedia ? (
    <div className="absolute inset-0 -z-10">
      <SectionMedia media={media} overlayOpacity={IMAGE_SCRIM} fill />
    </div>
  ) : null

  return (
    <Section
      spacing="default"
      background={tone === 'inverted' ? 'inverted' : inset ? 'default' : 'subtle'}
      clip={!inset}
      // `isolate` keeps the negative-z backdrop inside this section instead of
      // sliding behind the page background.
      className={cn(hasMedia && !inset && 'isolate')}
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Get in touch') })}
    >
      {inset ? (
        <div
          className={cn(
            sectionVariants({ background: 'inverted', spacing: 'none' }),
            'isolate overflow-hidden rounded-fx-2xl px-6 py-fx-band-sm fx-raise-4 sm:px-10 lg:px-16'
          )}
        >
          {backdrop}
          {body}
        </div>
      ) : (
        <>
          {backdrop}
          {body}
        </>
      )}
    </Section>
  )
}

export default CtaBand
