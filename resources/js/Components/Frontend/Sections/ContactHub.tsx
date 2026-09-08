import { useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { CheckCircle2, Mail, MapPin } from 'lucide-react'

import { NavIcon, isRegisteredNavIcon } from '@/Components/Public/NavIcon'
import { Section } from '@/Components/Public/Section'
import { fxButton } from '@/Components/Public/fxButton'
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
  readNumber,
  readOption,
  readString,
  trimmed,
} from '@/Components/Frontend/Sections/Shared/values'
import type { CmsSectionBlock } from '@/Types/cms'
import type { SectionComponentProps } from '@/Types/sections'

const SIDES = ['start', 'end'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['sm', 'default', 'lg'] as const
const ANIMATIONS = ['none', 'fade', 'rise'] as const

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

const FIELD_CLASS = cn(
  'w-full rounded-fx-xs border bg-fx-surface px-4 py-3',
  'text-fx-body text-fx-ink placeholder:text-fx-ink-faint',
  'transition-[border-color] duration-200 ease-fx',
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fx-focus',
  'motion-reduce:transition-none'
)

/**
 * One labelled field. The `<label>` is always real and visible — a contact
 * form is not the place for placeholder-as-label, and an enquiry that fails
 * validation needs the field named when it is announced.
 */
function Field({
  id,
  label,
  error,
  children,
}: {
  id: string
  label: string
  error?: string | undefined
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-fx-body-sm font-medium text-fx-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-fx-body-sm text-fx-danger-text">
          {error}
        </p>
      ) : null}
    </div>
  )
}

/**
 * The enquiry form.
 *
 * Owns its own submit and never navigates: `preserveState`/`preserveScroll`
 * keep the visitor where they were. The destination inbox is NOT sent — only
 * the section UUID, which `ContactController` resolves server-side.
 */
function ContactForm({
  sectionUuid,
  source,
  buttonLabel,
  successMessage,
  consentLabel,
  showCompany,
  showPhone,
}: {
  sectionUuid: string
  source: string | undefined
  buttonLabel: string
  successMessage: string
  consentLabel: string
  showCompany: boolean
  showPhone: boolean
}) {
  const { t } = useTranslations()
  const { loading, errors, submit, setErrors } = useForm()

  const [values, setValues] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    message: '',
    hp_channel: '',
  })
  const [consent, setConsent] = useState(false)
  const [done, setDone] = useState(false)

  const id = `contact-${sectionUuid}`
  const set = (key: keyof typeof values) => (event: { target: { value: string } }) =>
    setValues((current) => ({ ...current, [key]: event.target.value }))

  /*
   * Any server error that is not tied to a field this form renders — a rate
   * limit notice, a rejected `section`/`source`, an unexpected 4xx delivered
   * as an error bag. Without surfacing it, the response lands nowhere and the
   * form just sits there as if the click did nothing.
   */
  const RENDERED_FIELDS = ['name', 'email', 'company', 'phone', 'message', 'consent']
  const generalErrorKey = Object.keys(errors).find((key) => !RENDERED_FIELDS.includes(key))
  const generalError = generalErrorKey
    ? firstError(errors, generalErrorKey) ?? t('Something went wrong. Please try again.')
    : undefined

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (loading) {
      return
    }

    setErrors({})

    void submit({
      url: publicRoutes.contact,
      method: 'POST',
      data: {
        name: values.name,
        email: values.email,
        message: values.message,
        hp_channel: values.hp_channel,
        consent: consent ? 1 : 0,
        section: sectionUuid,
        ...(showCompany && values.company ? { company: values.company } : {}),
        ...(showPhone && values.phone ? { phone: values.phone } : {}),
        ...(source ? { source } : {}),
      },
      onSuccess: () => setDone(true),
    }).catch(() => {
      // `useForm` has already populated `errors`; an unhandled rejection here
      // would only be console noise.
    })
  }

  if (done) {
    return (
      <div
        role="status"
        className={cn(
          'flex items-start gap-3 rounded-fx-lg border border-fx-accent-line',
          'bg-fx-surface p-6 text-fx-body text-fx-ink'
        )}
      >
        <CheckCircle2 aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-fx-accent-text" />
        <p className="text-pretty">{successMessage}</p>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="flex flex-col gap-4 rounded-fx-xl border border-fx-line bg-fx-surface p-6 fx-raise-1 sm:p-8"
    >
      <Field id={`${id}-name`} label={t('Name')} error={firstError(errors, 'name')}>
        <input
          id={`${id}-name`}
          name="name"
          autoComplete="name"
          required
          value={values.name}
          onChange={set('name')}
          className={FIELD_CLASS}
        />
      </Field>

      <Field id={`${id}-email`} label={t('Email')} error={firstError(errors, 'email')}>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={values.email}
          onChange={set('email')}
          className={FIELD_CLASS}
        />
      </Field>

      {showCompany ? (
        <Field id={`${id}-company`} label={t('Company')} error={firstError(errors, 'company')}>
          <input
            id={`${id}-company`}
            name="company"
            autoComplete="organization"
            value={values.company}
            onChange={set('company')}
            className={FIELD_CLASS}
          />
        </Field>
      ) : null}

      {showPhone ? (
        <Field id={`${id}-phone`} label={t('Phone')} error={firstError(errors, 'phone')}>
          <input
            id={`${id}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            value={values.phone}
            onChange={set('phone')}
            className={FIELD_CLASS}
          />
        </Field>
      ) : null}

      <Field id={`${id}-message`} label={t('How can we help?')} error={firstError(errors, 'message')}>
        <textarea
          id={`${id}-message`}
          name="message"
          required
          rows={5}
          value={values.message}
          onChange={set('message')}
          className={cn(FIELD_CLASS, 'resize-y')}
        />
      </Field>

      {/*
        Honeypot — off-screen, empty for a person, filled by naive bots. The
        name is deliberately NOT `website` / `url` / `email`: browsers and
        password managers autofill those into hidden fields too, which used to
        make real people trip the trap. A neutral name they don't recognise,
        plus `autoComplete="off"`, keeps autofill out. A filled value is
        dropped silently server-side — never surfaced as an error.
      */}
      <div aria-hidden="true" className="sr-only">
        <label htmlFor={`${id}-hp`}>{t('Leave this field empty')}</label>
        <input
          id={`${id}-hp`}
          name="hp_channel"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          // The big password managers each honour their own opt-out attribute;
          // without these a manager fills the hidden field for a real person
          // and the server files their enquiry as spam.
          data-lpignore="true"
          data-1p-ignore=""
          data-form-type="other"
          value={values.hp_channel}
          onChange={set('hp_channel')}
        />
      </div>

      <div className="flex items-start gap-2.5">
        <input
          id={`${id}-consent`}
          name="consent"
          type="checkbox"
          checked={consent}
          onChange={(event) => setConsent(event.target.checked)}
          aria-invalid={firstError(errors, 'consent') ? true : undefined}
          className="mt-0.5 size-4 shrink-0 rounded-fx-xs border border-fx-line-strong accent-fx-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fx-focus"
        />
        <label htmlFor={`${id}-consent`} className="text-fx-body-sm text-pretty text-fx-ink-soft">
          {consentLabel}
        </label>
      </div>

      {firstError(errors, 'consent') ? (
        <p role="alert" className="text-fx-body-sm text-fx-danger-text">
          {firstError(errors, 'consent')}
        </p>
      ) : null}

      {generalError ? (
        <p
          role="alert"
          className="rounded-fx-xs border border-fx-danger-line bg-fx-surface px-4 py-3 text-fx-body-sm text-fx-danger-text"
        >
          {generalError}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={loading}
        className={cn(
          fxButton({ tone: 'solid', scale: 'lg' }),
          'mt-1 inline-flex items-center justify-center',
          'disabled:pointer-events-none disabled:opacity-60'
        )}
      >
        {loading ? t('Sending…') : buttonLabel}
      </button>
    </form>
  )
}

/** One "reach us" row. Linked when the editor set a `body` (href). */
function DetailRow({ block }: { block: CmsSectionBlock }) {
  const label = trimmed(block.label)
  const value = trimmed(block.value)
  const href = trimmed(block.body)
  const icon = block.icon ?? undefined

  if (!label && !value) {
    return null
  }

  const valueNode = href ? (
    <a
      href={href}
      className="text-fx-body font-medium text-fx-ink underline decoration-fx-accent-line underline-offset-4 hover:decoration-current"
      {...(/^https?:/i.test(href) ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {value}
    </a>
  ) : (
    <span className="text-fx-body font-medium text-fx-ink">{value}</span>
  )

  return (
    <li className="flex items-start gap-3">
      <span
        aria-hidden="true"
        className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-fx-md bg-fx-wash-accent text-fx-accent-text"
      >
        {isRegisteredNavIcon(icon) ? (
          <NavIcon name={icon} className="size-4" />
        ) : (
          <Mail className="size-4" />
        )}
      </span>
      <span className="flex flex-col gap-0.5">
        <span className="text-fx-meta uppercase tracking-wide text-fx-ink-faint">{label}</span>
        {value ? valueNode : null}
      </span>
    </li>
  )
}

/**
 * Static map via OpenStreetMap's embed — no API key, no tracking, works
 * everywhere. Renders only with real coordinates; the address and a
 * directions link stand in when there are none.
 */
function MapPanel({
  lat,
  lng,
  zoom,
  address,
}: {
  lat: number | undefined
  lng: number | undefined
  zoom: number
  address: string | undefined
}) {
  const { t } = useTranslations()

  if (lat === undefined || lng === undefined) {
    if (!address) {
      return null
    }

    return (
      <div className="rounded-fx-lg border border-fx-line bg-fx-surface-2 p-5">
        <p className="flex items-start gap-2 text-fx-body text-fx-ink-soft">
          <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-fx-accent-text" />
          <span className="whitespace-pre-line text-pretty">{address}</span>
        </p>
      </div>
    )
  }

  const span = 0.01 / Math.max(1, zoom - 12)
  const bbox = [lng - span, lat - span, lng + span, lat + span].join('%2C')
  const src = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat}%2C${lng}`
  const directions = `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=${zoom}/${lat}/${lng}`

  return (
    <figure className="flex flex-col gap-3">
      <div className="overflow-hidden rounded-fx-lg border border-fx-line bg-fx-surface-2">
        <iframe
          title={t('Map')}
          src={src}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="h-64 w-full border-0"
        />
      </div>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 text-fx-meta text-fx-ink-faint">
        {address ? <span className="whitespace-pre-line">{address}</span> : <span />}
        <a
          href={directions}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-fx-accent-text underline decoration-fx-accent-line underline-offset-4 hover:decoration-current"
        >
          {t('Get directions')}
        </a>
      </figcaption>
    </figure>
  )
}

/**
 * The scheduler embed — an iframe to whatever booking URL the editor pasted.
 *
 * A split: the invitation on the left, the widget on the right at a width that
 * suits it (these embeds are ~28rem of real content, so a full-bleed iframe is
 * mostly the vendor's own whitespace). Stacks on a phone.
 */
function SchedulerPanel({
  url,
  heading,
  text,
}: {
  url: string
  heading: string | undefined
  text: string | undefined
}) {
  const { t } = useTranslations()

  return (
    <div className="grid gap-fx-stack-md lg:grid-cols-[1fr_minmax(0,32rem)] lg:items-center lg:gap-12">
      <div className="flex flex-col gap-2">
        <p className="text-fx-eyebrow uppercase text-fx-accent-text">
          {t('Book a call')}
        </p>
        <h3 className="text-fx-subheading font-semibold text-balance text-fx-ink">
          {heading ?? t('Rather book a time?')}
        </h3>
        {text ? (
          <p className="max-w-md text-fx-body text-pretty text-fx-ink-soft">{text}</p>
        ) : null}
      </div>

      <div className="overflow-hidden rounded-fx-xl border border-fx-line bg-fx-surface fx-raise-1">
        <iframe
          title={t('Book a meeting')}
          src={url}
          loading="lazy"
          className="h-[34rem] w-full border-0"
        />
      </div>
    </div>
  )
}

/**
 * Contact Hub — the working part of a contact page.
 *
 * LAYOUT. Two columns from `lg`: the enquiry form on the editor's chosen side,
 * the "reach us" column (contact details, map, then scheduler) on the other.
 * Below `lg` everything stacks and the form comes first — a visitor on a phone
 * came to send a message, not to read an address.
 *
 * EVERYTHING IS CMS-DRIVEN. The destination inbox, the scheduler URL, the map
 * pin, the details and the copy are all section fields. The map is a keyless
 * OpenStreetMap embed and the scheduler is an iframe to a pasted URL, so
 * neither needs a per-vendor integration or an API key.
 *
 * Renders `null` only when there is neither a header nor a heading — the form
 * itself is always worth showing once the section exists.
 */
export function ContactHub({ section, index }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const side = readOption(settings, 'form_side', SIDES, 'start')
  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'lg')
  const animation = readOption(settings, 'animation', ANIMATIONS, 'fade')

  const eyebrow = trimmed(section.eyebrow)
  const heading = trimmed(section.heading)
  const subheading = trimmed(section.subheading)
  const highlight = readString(section.data, 'heading_highlight')

  const source = readString(settings, 'form_source')
  const buttonLabel = readString(settings, 'button_label') ?? t('Send Enquiry')
  const successMessage =
    readString(section.data, 'success_message') ??
    t('Thanks — your message is with us. We reply within one working day.')
  const consentLabel =
    readString(section.data, 'consent_label') ??
    t('I’m happy for QTECH to use these details to reply to my enquiry.')
  const showCompany = readBoolean(settings, 'show_company', true)
  const showPhone = readBoolean(settings, 'show_phone', true)

  const meetingUrl = readString(settings, 'meeting_url')
  const meetingHeading = readString(section.data, 'meeting_heading')
  const meetingText = readString(section.data, 'meeting_text')

  const showMap = readBoolean(settings, 'show_map', false)
  const mapAddress = readString(section.data, 'map_address')
  const mapLat = readNumber(settings, 'map_lat')
  const mapLng = readNumber(settings, 'map_lng')
  const mapZoom = readNumber(settings, 'map_zoom') ?? 14

  const details = useMemo(
    () => blocksOfType(section.blocks, 'detail').filter((b) => trimmed(b.label) || trimmed(b.value)),
    [section.blocks]
  )

  const headingNode = useMemo(
    () => highlightHeading(heading, highlight),
    [heading, highlight]
  )

  const headingId = heading ? `section-${section.uuid}-heading` : undefined
  const sectionHeadingLevel: HeadingLevel = index === 0 ? 'h1' : 'h2'

  const hasMap = showMap && (Boolean(mapAddress) || (mapLat !== undefined && mapLng !== undefined))
  const hasAside = details.length > 0 || hasMap

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      {...(section.anchor ? { id: section.anchor } : {})}
      {...(headingId
        ? { 'aria-labelledby': headingId }
        : { 'aria-label': t('Contact') })}
    >
      <div className="flex flex-col gap-fx-stack-xl">
        {(eyebrow || heading || subheading) ? (
          <SectionHeader
            eyebrow={eyebrow}
            heading={headingNode}
            subheading={subheading}
            headingLevel={sectionHeadingLevel}
            headingSize={sectionHeadingLevel}
            align="start"
            preset={animation}
            className="max-w-2xl"
            {...(headingId ? { headingId } : {})}
          />
        ) : null}

        {/*
          The form and the "reach us" column sit side by side and are close in
          height — a compact details list over a fixed-height map, against the
          form. `items-start` so a shorter column never stretches to leave a
          void beside the taller one. The scheduler is NOT in this row: it is
          tall and would force one side to a wall of blank space.
        */}
        <div
          className={cn(
            'grid gap-fx-stack-lg lg:items-start',
            hasAside && 'lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-12'
          )}
        >
          <Reveal
            preset={animation}
            className={cn(
              'w-full',
              !hasAside && 'mx-auto max-w-xl',
              side === 'end' && hasAside && 'lg:order-last'
            )}
          >
            <ContactForm
              sectionUuid={section.uuid}
              source={source}
              buttonLabel={buttonLabel}
              successMessage={successMessage}
              consentLabel={consentLabel}
              showCompany={showCompany}
              showPhone={showPhone}
            />
          </Reveal>

          {hasAside ? (
            <Reveal preset={animation} className="flex flex-col gap-fx-stack-md">
              {details.length > 0 ? (
                <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
                  {details.map((detail) => (
                    <DetailRow key={detail.uuid} block={detail} />
                  ))}
                </ul>
              ) : null}

              {hasMap ? (
                <MapPanel lat={mapLat} lng={mapLng} zoom={mapZoom} address={mapAddress} />
              ) : null}
            </Reveal>
          ) : null}
        </div>

        {meetingUrl ? (
          <Reveal
            preset={animation}
            className="flex flex-col gap-fx-stack-md border-t border-fx-line pt-fx-stack-lg"
          >
            <SchedulerPanel url={meetingUrl} heading={meetingHeading} text={meetingText} />
          </Reveal>
        ) : null}
      </div>
    </Section>
  )
}

export default ContactHub
