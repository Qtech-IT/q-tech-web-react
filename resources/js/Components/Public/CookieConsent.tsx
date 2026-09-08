import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from '@inertiajs/react'
import { Cookie, X } from 'lucide-react'

import { fxButton } from '@/Components/Public/fxButton'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn, getCookie, setCookie } from '@/Utils/helpers'
import {
  ALLOW_ALL,
  CONSENT_CHANGED_EVENT,
  CONSENT_COOKIE_NAME,
  CONSENT_MAX_AGE,
  CONSENT_OPEN_EVENT,
  DENY_ALL,
  parseConsent,
  serialiseConsent,
} from '@/Types/cookieConsent'
import type { ConsentCategory, ConsentChoices } from '@/Types/cookieConsent'

export interface CookieConsentProps {
  /** Link to the cookie or privacy policy. Resolved from the legal menu. */
  policyHref?: string | undefined
  policyLabel?: string | undefined
}

/** The optional categories, in the order they are presented. */
const OPTIONAL: ConsentCategory[] = ['analytics', 'marketing']

/**
 * The cookie consent banner and its preferences panel.
 *
 * WHY "ACCEPT" AND "REJECT" ARE THE SAME SIZE AND THE SAME WEIGHT
 * --------------------------------------------------------------
 * A prominent "Accept all" beside a grey text "Reject" is the single most
 * common consent dark pattern and is explicitly non-compliant in the EU: a
 * refusal must be as easy as an acceptance. Both are real buttons, adjacent,
 * with the same prominence. That is a deliberate design constraint, not an
 * oversight, and it should not be "fixed".
 *
 * WHY IT DOES NOT RENDER UNTIL AFTER MOUNT
 * ----------------------------------------
 * The decision lives in a cookie the client reads. Rendering the banner during
 * the first paint and then hiding it once the cookie is read would flash a
 * consent bar at every returning visitor on every page load.
 *
 * WHY THE STRINGS GO THROUGH `t()`
 * --------------------------------
 * Consent copy is legal copy — the business, not a developer, owns its exact
 * wording, and it must be translatable. Every string here is a translation key
 * that the admin's Languages screen can edit without a deploy, which is the
 * same route every other piece of site chrome takes.
 *
 * FOCUS — the panel is a modal dialog, so it traps nothing but does move focus
 * to itself on open and restores it on close. Escape dismisses the panel back
 * to the banner rather than silently consenting to anything.
 */
export function CookieConsent({ policyHref, policyLabel }: CookieConsentProps) {
  const { t } = useTranslations()

  const [visible, setVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [choices, setChoices] = useState<ConsentChoices>(DENY_ALL)

  const panelRef = useRef<HTMLDivElement>(null)
  const restoreFocusTo = useRef<HTMLElement | null>(null)

  const persist = useCallback((next: ConsentChoices) => {
    setCookie(CONSENT_COOKIE_NAME, serialiseConsent(next), CONSENT_MAX_AGE)
    setChoices(next)
    setVisible(false)
    setShowPreferences(false)

    // Whoever loads analytics or marketing tags listens for this. Dispatched
    // after the cookie is written so a listener reading the cookie directly
    // sees the new value rather than the old one.
    window.dispatchEvent(
      new CustomEvent(CONSENT_CHANGED_EVENT, { detail: next })
    )
  }, [])

  // Mount: decide whether to ask at all.
  useEffect(() => {
    const stored = parseConsent(getCookie(CONSENT_COOKIE_NAME))

    if (stored) {
      setChoices(stored.choices)

      return
    }

    setVisible(true)
  }, [])

  // The footer's "Cookie settings" control reaches the banner through this.
  useEffect(() => {
    function handleOpen() {
      restoreFocusTo.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null

      const stored = parseConsent(getCookie(CONSENT_COOKIE_NAME))
      setChoices(stored?.choices ?? DENY_ALL)
      setVisible(true)
      setShowPreferences(true)
    }

    window.addEventListener(CONSENT_OPEN_EVENT, handleOpen)

    return () => window.removeEventListener(CONSENT_OPEN_EVENT, handleOpen)
  }, [])

  // Move focus into the panel when it opens; put it back when it closes.
  useEffect(() => {
    if (showPreferences) {
      panelRef.current?.focus()

      return
    }

    restoreFocusTo.current?.focus()
    restoreFocusTo.current = null
  }, [showPreferences])

  useEffect(() => {
    if (!showPreferences) {
      return
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        // Back to the banner — never a silent accept or a silent reject.
        setShowPreferences(false)
      }
    }

    window.addEventListener('keydown', handleKey)

    return () => window.removeEventListener('keydown', handleKey)
  }, [showPreferences])

  if (!visible) {
    return null
  }

  const policy =
    policyHref && policyHref.startsWith('/') ? (
      <Link href={policyHref} className="underline underline-offset-4 hover:text-fx-ink">
        {policyLabel ?? t('Cookie policy')}
      </Link>
    ) : policyHref ? (
      <a
        href={policyHref}
        className="underline underline-offset-4 hover:text-fx-ink"
        target="_blank"
        rel="noopener noreferrer"
      >
        {policyLabel ?? t('Cookie policy')}
      </a>
    ) : null

  return (
    <div
      // `fixed` + high z so it survives whatever the page is doing. Bottom
      // rather than a full-screen overlay: a modal that blocks the page before
      // a visitor has seen anything is the other consent dark pattern.
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-5"
      role={showPreferences ? 'dialog' : 'region'}
      {...(showPreferences ? { 'aria-modal': false } : {})}
      aria-label={t('Cookie preferences')}
    >
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          'mx-auto w-full max-w-3xl rounded-fx-xl border border-fx-line',
          'bg-fx-surface p-5 shadow-fx-4 outline-none sm:p-6'
        )}
      >
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="hidden size-10 shrink-0 items-center justify-center rounded-fx-md bg-fx-mark-amber/12 text-fx-mark-amber sm:flex"
          >
            <Cookie className="size-5" />
          </span>

          <div className="flex-1">
            <h2 className="text-fx-body font-semibold text-fx-ink">
              {t('We use cookies')}
            </h2>

            <p className="mt-1.5 text-fx-body-sm text-pretty text-fx-ink-soft">
              {t(
                'Some are needed to make the site work. The rest help us understand how it is used, and we only set those if you say yes.'
              )}{' '}
              {policy}
            </p>
          </div>

          {showPreferences ? (
            <button
              type="button"
              onClick={() => setShowPreferences(false)}
              className={cn(
                'rounded-fx-xs p-1.5 text-fx-ink-faint hover:text-fx-ink',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fx-focus'
              )}
            >
              <X aria-hidden="true" className="size-4" />
              <span className="sr-only">{t('Close preferences')}</span>
            </button>
          ) : null}
        </div>

        {showPreferences ? (
          <ul className="mt-5 flex flex-col gap-3 border-t border-fx-line pt-5">
            <li className="flex items-start justify-between gap-4">
              <div>
                <p className="text-fx-body-sm font-semibold text-fx-ink">
                  {t('Strictly necessary')}
                </p>
                <p className="text-fx-body-sm text-fx-ink-soft">
                  {t(
                    'Session, security and language. The site cannot work without them, so they are always on.'
                  )}
                </p>
              </div>
              {/* Text, not a disabled switch: a toggle that cannot move is
                  its own kind of dark pattern. */}
              <span className="shrink-0 pt-0.5 text-fx-meta font-semibold text-fx-ink-faint">
                {t('Always on')}
              </span>
            </li>

            {OPTIONAL.map((category) => (
              <li key={category} className="flex items-start justify-between gap-4">
                <div>
                  <label
                    htmlFor={`consent-${category}`}
                    className="text-fx-body-sm font-semibold text-fx-ink"
                  >
                    {category === 'analytics'
                      ? t('Analytics')
                      : t('Marketing')}
                  </label>
                  <p className="text-fx-body-sm text-fx-ink-soft">
                    {category === 'analytics'
                      ? t('Anonymous usage statistics, so we can see what needs fixing.')
                      : t('Lets us measure which campaigns brought you here.')}
                  </p>
                </div>

                <input
                  id={`consent-${category}`}
                  type="checkbox"
                  checked={choices[category]}
                  onChange={(event) =>
                    setChoices((current) => ({
                      ...current,
                      [category]: event.target.checked,
                    }))
                  }
                  className={cn(
                    'mt-1 size-4 shrink-0 rounded-fx-xs border border-fx-line-strong',
                    'accent-fx-accent focus-visible:outline-2 focus-visible:outline-offset-2',
                    'focus-visible:outline-fx-focus'
                  )}
                />
              </li>
            ))}
          </ul>
        ) : null}

        <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-end">
          {showPreferences ? (
            <button
              type="button"
              onClick={() => persist(choices)}
              className={fxButton({ tone: 'solid', scale: 'sm' })}
            >
              {t('Save my choices')}
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setShowPreferences(true)}
              className={fxButton({ tone: 'ghost', scale: 'sm' })}
            >
              {t('Manage preferences')}
            </button>
          )}

          {/* Reject and Accept: same size, same weight, adjacent. See the
              docblock — this is a compliance constraint, not a style. */}
          <button
            type="button"
            onClick={() => persist(DENY_ALL)}
            className={fxButton({ tone: 'outline', scale: 'sm' })}
          >
            {t('Reject non-essential')}
          </button>

          <button
            type="button"
            onClick={() => persist(ALLOW_ALL)}
            className={fxButton({ tone: 'outline', scale: 'sm' })}
          >
            {t('Accept all')}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CookieConsent
