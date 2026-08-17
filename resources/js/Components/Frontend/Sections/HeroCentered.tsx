import { useMemo } from 'react'
import { ArrowUpRight, Star, User } from 'lucide-react'

import { Section } from '@/Components/Public/Section'
import { fxButton } from '@/Components/Public/fxButton'
import { SafeImage } from '@/Components/UI/SafeImage'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import { blocksOfType } from '@/Components/Frontend/Sections/Shared/blocks'
import { Reveal } from '@/Components/Frontend/Sections/Shared/Reveal'
import { SectionCta } from '@/Components/Frontend/Sections/Shared/SectionCta'
import { WordReveal } from '@/Components/Frontend/Sections/Shared/WordReveal'
import {
  clamp,
  readNumber,
  readOption,
  readString,
  trimmed,
} from '@/Components/Frontend/Sections/Shared/values'
import type { CmsSectionBlock } from '@/Types/cms'
import type { SectionComponentProps } from '@/Types/sections'

const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise'] as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

/** One overlapping avatar chip in the trust row. */
function ReviewerAvatar({ block }: { block: CmsSectionBlock }) {
  const label = trimmed(block.label)
  const media = block.media ?? null

  return (
    <span
      className={cn(
        'flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full',
        'border-2 border-fx-canvas bg-fx-surface-2 text-fx-ink-faint',
        // The overlap is the whole point of a reviewer cluster — each chip
        // sits partly under the one before it, in DOM order left to right.
        '-ms-3 first:ms-0'
      )}
    >
      {media?.url ? (
        <SafeImage
          src={media.url}
          alt={label ?? ''}
          width={40}
          height={40}
          className="size-full object-cover"
        />
      ) : (
        <User aria-hidden="true" className="size-4" />
      )}
    </span>
  )
}

/**
 * A 0–5 rating as five stars, the fractional part rendered by clipping a
 * fully-filled row to `(rating / 5) * 100%` over an outline row beneath it —
 * the standard technique for a rating that is not a whole number, composed
 * here from `lucide-react`'s `Star` rather than five separately imported
 * icon states.
 */
function RatingStars({ rating }: { rating: number }) {
  const percent = clamp((rating / 5) * 100, 0, 100)

  return (
    <span className="relative inline-flex" aria-hidden="true">
      <span className="flex gap-0.5 text-fx-line-strong">
        {Array.from({ length: 5 }, (_, position) => (
          <Star key={position} className="size-4" fill="currentColor" />
        ))}
      </span>
      <span
        // A fixed warm gold rather than an `fx-*` token on purpose: a star
        // rating's colour is a near-universal convention independent of
        // brand accent, the same way an error state stays red regardless of
        // theme. Authored in oklch to match how every other colour in this
        // stylesheet is defined, rather than reaching into Tailwind's stock
        // palette this codebase otherwise never uses on the public site.
        className="absolute inset-0 flex gap-0.5 overflow-hidden text-[oklch(0.77_0.15_75)]"
        style={{ width: `${percent}%` }}
      >
        {Array.from({ length: 5 }, (_, position) => (
          <Star key={position} className="size-4 shrink-0" fill="currentColor" />
        ))}
      </span>
    </span>
  )
}

/**
 * Centered headline, one compound pill button, a reviewer/rating trust row,
 * and a logo strip — a deliberately simpler composition than `hero.flow`,
 * for a page that wants one clean statement rather than an illustration.
 *
 * TYPE — the headline runs at `--text-fx-hero` (36 → 72px), one step above
 * the shared display size, because in this composition it is the only thing
 * competing for the eye. Everything under it stays deliberately small: the
 * subheading sits at lead size in a narrow measure, and the trust row at
 * body-sm, so the drop from headline to support is the hierarchy.
 *
 * THE BUTTON — a solid pill with a round badge inset at its trailing edge.
 * Built ON TOP OF `fxButton` rather than hand-rolled, so it inherits the
 * site's own button behaviour — the 1px hover lift, the shadow step, the
 * focus outline, and the `motion-reduce` opt-out — and cannot drift from
 * every other button when those are tuned. Only radius and the trailing
 * padding that makes room for the badge are overridden. The badge itself is
 * a fixed visual signature of this hero (`aria-hidden`, purely decorative)
 * rather than a second CMS icon field, while the label/href/tracking under
 * it stay fully editable through the same `SectionCta` every section uses —
 * no second href-resolution or `rel` implementation here.
 *
 * TRUST ROW — avatars, then a star rating, then a caption, all optional
 * together: the row exists only when there is text for it, so a partially
 * filled-in hero cannot show a floating rating with no context.
 *
 * LOGO STRIP — a caption between two hairlines over a wrapped row of client
 * logos. Independent of the trust row: a hero can have one, the other, both,
 * or neither and still be a correct, unbroken composition.
 */
export function HeroCentered({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings
  const data = section.data

  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'lg')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'rise')
  const rating = clamp(readNumber(settings, 'rating_value') ?? 0, 0, 5)

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const trustLabel = readString(data, 'trust_label')
  const logosCaption = readString(data, 'logos_caption')

  const primaryCta = section.cta ?? null
  const hasCta = Boolean(
    trimmed(primaryCta?.label) && (trimmed(primaryCta?.href) || trimmed(primaryCta?.url))
  )

  const reviewers = useMemo(
    () => blocksOfType(section.blocks, 'reviewer'),
    [section.blocks]
  )
  const logos = useMemo(() => blocksOfType(section.blocks, 'logo'), [section.blocks])

  const isEmpty =
    !eyebrow && !heading && !subheading && !hasCta && !trustLabel && logos.length === 0

  if (isEmpty) {
    return null
  }

  const HeadingTag = index === 0 ? 'h1' : 'h2'
  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  const hasTrustRow = Boolean(trustLabel)
  const still = animation === 'none'

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      containerSize="wide"
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Introduction') })}
    >
      <div className="flex flex-col items-center gap-fx-stack-md text-center">
        {eyebrow ? (
          <Reveal preset={animation} trigger="mount" index={0}>
            <p className="inline-flex items-center gap-2.5 rounded-fx-pill border border-fx-line bg-fx-surface px-4 py-2 text-fx-eyebrow uppercase text-fx-ink-soft">
              <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-fx-accent" />
              {eyebrow}
            </p>
          </Reveal>
        ) : null}

        {heading ? (
          <WordReveal
            as={HeadingTag}
            text={heading}
            disabled={still}
            delay={0.05}
            {...(headingId ? { id: headingId } : {})}
            className={cn(
              'max-w-5xl text-balance text-fx-ink',
              index === 0 ? 'text-fx-hero' : 'text-fx-title'
            )}
          />
        ) : null}

        {subheading ? (
          <Reveal preset={animation} trigger="mount" index={3} className="mt-1">
            <p className="max-w-xl text-pretty text-fx-lead text-fx-ink-soft">
              {subheading}
            </p>
          </Reveal>
        ) : null}

        {hasCta || hasTrustRow ? (
          <Reveal preset={animation} trigger="mount" index={4} className="mt-fx-stack-sm">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:gap-6">
              {hasCta ? (
                // `relative` on the wrapper, not the button: the badge is a
                // sibling of the anchor rather than a child, so it can never
                // land inside the link's accessible name.
                <div className="relative inline-flex">
                  <SectionCta
                    cta={primaryCta}
                    size="lg"
                    fallbackVariant="default"
                    buttonClassName={cn(
                      fxButton({ tone: 'solid', scale: 'lg' }),
                      'h-16 rounded-fx-pill ps-9 pe-20 text-fx-body'
                    )}
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      'pointer-events-none absolute end-2 top-1/2 flex size-12 -translate-y-1/2',
                      'items-center justify-center rounded-full',
                      'bg-fx-btn-primary-ink text-fx-btn-primary'
                    )}
                  >
                    <ArrowUpRight className="size-5" />
                  </span>
                </div>
              ) : null}

              {hasTrustRow ? (
                <div className="flex flex-col items-center gap-1.5 sm:items-start">
                  <div className="flex items-center gap-3">
                    {reviewers.length > 0 ? (
                      <div className="flex" aria-hidden="true">
                        {reviewers.map((reviewer) => (
                          <ReviewerAvatar key={reviewer.uuid} block={reviewer} />
                        ))}
                      </div>
                    ) : null}

                    {rating > 0 ? <RatingStars rating={rating} /> : null}
                  </div>

                  <span className="text-fx-body-sm text-fx-ink-soft">{trustLabel}</span>
                </div>
              ) : null}
            </div>
          </Reveal>
        ) : null}
      </div>

      {logos.length > 0 || logosCaption ? (
        <div className="mt-fx-stack-xl flex flex-col items-center gap-fx-stack-lg">
          {logosCaption ? (
            <Reveal preset={animation} className="w-full">
              <div className="mx-auto flex w-full max-w-3xl items-center gap-5">
                <span aria-hidden="true" className="h-px flex-1 bg-fx-line" />
                <span className="shrink-0 text-fx-body-sm text-fx-ink-faint">
                  {logosCaption}
                </span>
                <span aria-hidden="true" className="h-px flex-1 bg-fx-line" />
              </div>
            </Reveal>
          ) : null}

          {logos.length > 0 ? (
            <ul
              aria-label={t('Trusted by')}
              className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8"
            >
              {logos.map((logo, position) => {
                const media = logo.media ?? null
                const label = trimmed(logo.label)

                if (!media?.url) {
                  return null
                }

                return (
                  <Reveal
                    as="li"
                    key={logo.uuid}
                    preset={still ? 'none' : 'stagger'}
                    index={position}
                    className="flex h-9 items-center"
                  >
                    <SafeImage
                      src={media.url}
                      alt={label ?? ''}
                      height={36}
                      className={cn(
                        // Full colour, not desaturated. A grayscale strip is
                        // the convention when logos would otherwise fight a
                        // busy page; here they sit alone under a quiet
                        // hairline, and muting them just made a seeded strip
                        // look unfinished. Only a small opacity step keeps
                        // them subordinate to the headline.
                        'h-9 w-auto object-contain opacity-90',
                        'transition-[opacity,transform] duration-300 ease-fx',
                        'hover:-translate-y-0.5 hover:opacity-100',
                        'motion-reduce:transition-none motion-reduce:hover:translate-y-0'
                      )}
                    />
                  </Reveal>
                )
              })}
            </ul>
          ) : null}
        </div>
      ) : null}
    </Section>
  )
}

export default HeroCentered
