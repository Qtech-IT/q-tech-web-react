import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { CheckCircle2, Mail } from 'lucide-react'

import { Section } from '@/Components/Public/Section'
import { fxButton } from '@/Components/Public/fxButton'
import { SafeImage } from '@/Components/UI/SafeImage'
import { publicRoutes } from '@/Config/publicRoutes'
import { useForm } from '@/Hooks/useForm'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import { blocksOfType } from '@/Components/Frontend/Sections/Shared/blocks'
import { highlightHeading } from '@/Components/Frontend/Sections/Shared/highlight'
import { Reveal } from '@/Components/Frontend/Sections/Shared/Reveal'
import { SectionHeader } from '@/Components/Frontend/Sections/Shared/SectionHeader'
import type { HeadingLevel } from '@/Components/Frontend/Sections/Shared/SectionHeader'
import {
  readBoolean,
  readOption,
  readString,
  trimmed,
} from '@/Components/Frontend/Sections/Shared/values'
import type { SectionComponentProps } from '@/Types/sections'

const LAYOUTS = ['centered', 'split'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise', 'stagger'] as const

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

/** The first error for a field. Laravel sends either a string or an array. */
function firstError(errors: Record<string, unknown>, field: string): string | undefined {
  const raw = errors[field]

  if (typeof raw === 'string') {
    return raw
  }

  if (Array.isArray(raw) && typeof raw[0] === 'string') {
    return raw[0]
  }

  return undefined
}

/**
 * The newsletter form.
 *
 * WHY THIS OWNS ITS OWN SUBMIT RATHER THAN NAVIGATING
 * ---------------------------------------------------
 * `preserveState`/`preserveScroll` keep the visitor exactly where they were —
 * this section is usually the last thing before the footer, and a full visit
 * would throw them back to the top of a long page as a reward for signing up.
 *
 * THREE THINGS ARE LOAD-BEARING FOR ACCESSIBILITY
 *
 *  1. The input has a real `<label>`, visually hidden. A placeholder is not a
 *     label: it disappears on focus, and most screen readers do not announce
 *     it as the field's name.
 *  2. The error is wired with `aria-describedby` + `aria-invalid` and lives in
 *     a `role="alert"`, so it is announced when it appears rather than only
 *     being visible.
 *  3. The success state is also a live region — the form is replaced, and a
 *     visitor who cannot see that needs to be told it happened.
 *
 * The honeypot is an off-screen input a person never focuses (`tabIndex={-1}`,
 * `aria-hidden`, `autoComplete="off"`) and most naive bots fill. The server
 * rejects a filled one — see `SubscribeRequest`.
 */
function SignupForm({
  sectionUuid,
  placeholder,
  buttonLabel,
  consentLabel,
  successMessage,
  source,
  showConsent,
  align,
}: {
  sectionUuid: string
  placeholder: string
  buttonLabel: string
  consentLabel: string | undefined
  successMessage: string
  source: string | undefined
  showConsent: boolean
  align: 'center' | 'start'
}) {
  const { t } = useTranslations()
  const { loading, errors, submit, setErrors } = useForm()

  const [email, setEmail] = useState('')
  const [hpChannel, setHpChannel] = useState('')
  const [consent, setConsent] = useState(!showConsent)
  const [done, setDone] = useState(false)

  const fieldId = `newsletter-${sectionUuid}`
  const errorId = `${fieldId}-error`
  const consentId = `${fieldId}-consent`

  const emailError = firstError(errors, 'email')
  const consentError = firstError(errors, 'consent')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (loading) {
      return
    }

    setErrors({})

    void submit({
      url: publicRoutes.subscribe,
      method: 'POST',
      data: {
        email,
        hp_channel: hpChannel,
        // Always sent, whether or not the box is shown: the server requires
        // it, and a form that renders no checkbox has consent documented
        // elsewhere — see the `show_consent` field's help text.
        consent: consent ? 1 : 0,
        ...(source ? { source } : {}),
      },
      onSuccess: () => {
        setDone(true)
        setEmail('')
      },
    }).catch(() => {
      // Swallowed on purpose: `useForm` has already put the validation errors
      // into `errors`, which is what the form renders. An unhandled rejection
      // here would only be console noise.
    })
  }

  if (done) {
    return (
      <p
        role="status"
        className={cn(
          'flex items-center gap-3 rounded-fx-lg border border-fx-accent-line',
          'bg-fx-surface px-5 py-4 text-fx-body text-fx-ink',
          align === 'center' && 'justify-center'
        )}
      >
        <CheckCircle2
          aria-hidden="true"
          className="size-5 shrink-0 text-fx-accent-text"
        />
        {successMessage}
      </p>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn(
        'flex w-full flex-col gap-3',
        align === 'center' && 'items-center'
      )}
    >
      <div
        className={cn(
          'flex w-full flex-col gap-3 sm:flex-row',
          align === 'center' && 'sm:max-w-xl'
        )}
      >
        <div className="relative flex-1">
          <label htmlFor={fieldId} className="sr-only">
            {t('Email address')}
          </label>

          <Mail
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-fx-ink-faint"
          />

          <input
            id={fieldId}
            type="email"
            name="email"
            inputMode="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder={placeholder}
            aria-invalid={emailError ? true : undefined}
            aria-describedby={emailError ? errorId : undefined}
            className={cn(
              'h-14 w-full rounded-fx-xs border bg-fx-surface pr-4 pl-12',
              'text-fx-body text-fx-ink placeholder:text-fx-ink-faint',
              'transition-[border-color,box-shadow] duration-200 ease-fx',
              'focus-visible:outline-2 focus-visible:outline-offset-2',
              'focus-visible:outline-fx-focus motion-reduce:transition-none',
              emailError
                ? 'border-fx-danger-line'
                : 'border-fx-line hover:border-fx-accent-line'
            )}
          />
        </div>

        {/* Honeypot. Off-screen rather than `display: none` — some bots skip
            hidden inputs, and `sr-only` keeps it in the layout tree while
            putting it outside the viewport. The name is deliberately not
            `website` / `url` / `email`: browsers autofill those into hidden
            fields too and used to trip real people. A filled value is dropped
            silently server-side. */}
        <div aria-hidden="true" className="sr-only">
          <label htmlFor={`${fieldId}-hp`}>{t('Leave this field empty')}</label>
          <input
            id={`${fieldId}-hp`}
            type="text"
            name="hp_channel"
            tabIndex={-1}
            autoComplete="off"
            value={hpChannel}
            onChange={(event) => setHpChannel(event.target.value)}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={cn(
            fxButton({ tone: 'solid', scale: 'lg' }),
            'inline-flex shrink-0 items-center justify-center',
            'disabled:pointer-events-none disabled:opacity-60'
          )}
        >
          {loading ? t('Subscribing…') : buttonLabel}
        </button>
      </div>

      {showConsent ? (
        <div
          className={cn(
            'flex w-full items-start gap-2.5',
            align === 'center' && 'sm:max-w-xl'
          )}
        >
          <input
            id={consentId}
            type="checkbox"
            name="consent"
            checked={consent}
            onChange={(event) => setConsent(event.target.checked)}
            aria-invalid={consentError ? true : undefined}
            className={cn(
              'mt-0.5 size-4 shrink-0 rounded-fx-xs border border-fx-line-strong',
              'accent-fx-accent focus-visible:outline-2 focus-visible:outline-offset-2',
              'focus-visible:outline-fx-focus'
            )}
          />
          <label
            htmlFor={consentId}
            className="text-fx-body-sm text-pretty text-fx-ink-soft"
          >
            {consentLabel}
          </label>
        </div>
      ) : null}

      {emailError || consentError ? (
        <p
          id={errorId}
          role="alert"
          className={cn(
            'text-fx-body-sm text-fx-danger-text',
            align === 'center' && 'text-center'
          )}
        >
          {emailError ?? consentError}
        </p>
      ) : null}
    </form>
  )
}

/**
 * The overlapping row of faces from the reference design.
 *
 * Decorative as a GROUP: each photo is a real person, but the row says
 * "people are behind this", not "here is Ada". The images carry their alt text
 * where the media library has one, so an editor who wants them announced can
 * make that happen without a code change.
 */
function FaceCluster({
  faces,
  label,
  align,
}: {
  faces: { uuid: string; url: string; alt: string }[]
  label: string | undefined
  align: 'center' | 'start'
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3',
        align === 'center' && 'justify-center'
      )}
    >
      {label ? (
        <span className="text-fx-body-sm text-fx-ink-soft">{label}</span>
      ) : null}

      <ul className="flex items-center">
        {faces.map((face) => (
          <li key={face.uuid} className="-ml-2 first:ml-0">
            <SafeImage
              src={face.url}
              alt={face.alt}
              className={cn(
                'size-9 rounded-fx-pill object-cover',
                // The ring is drawn in the band's own surface colour, so the
                // circles separate on any of the three backgrounds without a
                // per-theme branch.
                'ring-2 ring-fx-canvas'
              )}
            />
          </li>
        ))}
      </ul>
    </div>
  )
}

/**
 * Newsletter signup.
 *
 * Renders `null` when there is no header at all — unlike every other section
 * here, the form itself is never the whole section: an email field with no
 * sentence explaining what it signs you up for is not something to ship.
 */
export function NewsletterSignup({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings
  const data = section.data

  const layout = readOption(settings, 'layout', LAYOUTS, 'centered')
  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'lg')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'rise')
  const showConsent = readBoolean(settings, 'show_consent', true)

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const highlight = readString(data, 'heading_highlight')
  const footnote = readString(data, 'footnote')
  const trustLabel = readString(data, 'trust_label')
  const source = readString(data, 'source')

  const placeholder = readString(data, 'placeholder') ?? t('Enter your email address')
  const buttonLabel = readString(data, 'button_label') ?? t('Subscribe')
  const consentLabel =
    readString(data, 'consent_label') ??
    t('Yes, email me occasional updates. I can unsubscribe at any time.')
  const successMessage =
    readString(data, 'success_message') ??
    t('You are on the list. Check your inbox to confirm.')

  const faces = useMemo(
    () =>
      blocksOfType(section.blocks, 'face')
        .filter((block) => Boolean(block.media?.url))
        .map((block) => ({
          uuid: block.uuid,
          url: block.media!.url,
          alt: block.media?.alt_text ?? trimmed(block.label) ?? '',
        })),
    [section.blocks]
  )

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const hasHeader = Boolean(eyebrow || heading || subheading)

  if (!hasHeader) {
    return null
  }

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  const sectionHeadingLevel: HeadingLevel = index === 0 ? 'h1' : 'h2'
  const split = layout === 'split'
  const align: 'center' | 'start' = split ? 'start' : 'center'

  const header = (
    <SectionHeader
      eyebrow={eyebrow}
      heading={headingNode}
      subheading={subheading}
      headingLevel={sectionHeadingLevel}
      headingSize={sectionHeadingLevel}
      align={align}
      preset={animation}
      {...(headingId ? { headingId } : {})}
    />
  )

  const form = (
    <Reveal
      preset={animation}
      className={cn('flex w-full flex-col gap-4', align === 'center' && 'items-center')}
    >
      <SignupForm
        sectionUuid={section.uuid}
        placeholder={placeholder}
        buttonLabel={buttonLabel}
        consentLabel={showConsent ? consentLabel : undefined}
        successMessage={successMessage}
        source={source}
        showConsent={showConsent}
        align={align}
      />

      {faces.length > 0 || trustLabel ? (
        <FaceCluster faces={faces} label={trustLabel} align={align} />
      ) : null}

      {footnote ? (
        <p
          className={cn(
            'text-fx-meta text-fx-ink-faint',
            align === 'center' && 'text-center'
          )}
        >
          {footnote}
        </p>
      ) : null}
    </Reveal>
  )

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Newsletter signup') })}
    >
      {split ? (
        <div className="grid items-center gap-fx-stack-xl lg:grid-cols-2 lg:gap-12">
          {header}
          {form}
        </div>
      ) : (
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-fx-stack-lg">
          {header}
          {form}
        </div>
      )}
    </Section>
  )
}

export default NewsletterSignup
