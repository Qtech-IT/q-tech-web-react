/**
 * Cookie consent: the stored shape, and the one way to read and write it.
 *
 * WHY THE CHOICE LIVES IN A COOKIE AND NOT IN `localStorage`
 * ----------------------------------------------------------
 * The server has to be able to see it. Any decision that depends on consent —
 * whether to inject an analytics tag into the document, whether a response may
 * be cached with a personalised body — happens before a single line of
 * JavaScript runs, and `localStorage` is invisible at that moment.
 *
 * WHY THE STORED VALUE IS VERSIONED
 * ---------------------------------
 * Consent is granted for a specific set of categories. Adding a category later
 * means the visitor has never been asked about it, and silently treating their
 * old "accept all" as covering it is exactly the thing consent law exists to
 * prevent. Bumping `CONSENT_VERSION` invalidates every stored answer and asks
 * again — which is the correct, if inconvenient, behaviour.
 */

export const CONSENT_COOKIE_NAME = 'qtech_cookie_consent'

/** One year. The common regulatory ceiling for a consent record. */
export const CONSENT_MAX_AGE = 60 * 60 * 24 * 365

/** Bump when the CATEGORIES change. See the note above. */
export const CONSENT_VERSION = 1

/**
 * The categories.
 *
 * `necessary` is not a choice and is never presented as one — a toggle a
 * visitor cannot move is a dark pattern in the other direction, so it renders
 * as a locked, explained row rather than as a disabled switch.
 */
export const CONSENT_CATEGORIES = ['necessary', 'analytics', 'marketing'] as const

export type ConsentCategory = (typeof CONSENT_CATEGORIES)[number]

export type ConsentChoices = Record<ConsentCategory, boolean>

export interface StoredConsent {
  v: number
  choices: ConsentChoices
  /** ISO timestamp of the decision — the evidence half of a consent record. */
  at: string
}

/** Nothing but strictly necessary cookies. Also the pre-decision state. */
export const DENY_ALL: ConsentChoices = {
  necessary: true,
  analytics: false,
  marketing: false,
}

export const ALLOW_ALL: ConsentChoices = {
  necessary: true,
  analytics: true,
  marketing: true,
}

/**
 * Fired on `window` whenever a decision is stored, and when the footer asks
 * for the preferences panel.
 *
 * A custom event rather than a React context because the two ends live in
 * different trees — the banner is mounted by the layout, the "Cookie settings"
 * control is inside the footer's link list — and because a third-party script
 * loader (the actual consumer of this decision) is not a React component at
 * all.
 */
export const CONSENT_CHANGED_EVENT = 'qtech:cookie-consent'
export const CONSENT_OPEN_EVENT = 'qtech:cookie-preferences'

/** Parse a stored record, or `null` when there is no usable decision. */
export function parseConsent(raw: string | undefined): StoredConsent | null {
  if (!raw) {
    return null
  }

  try {
    const parsed: unknown = JSON.parse(raw)

    if (typeof parsed !== 'object' || parsed === null) {
      return null
    }

    const record = parsed as Partial<StoredConsent>

    // A record from an older category set is not a decision about the current
    // one — see the versioning note above.
    if (record.v !== CONSENT_VERSION || typeof record.choices !== 'object') {
      return null
    }

    const choices = record.choices as Partial<ConsentChoices>

    return {
      v: CONSENT_VERSION,
      at: typeof record.at === 'string' ? record.at : new Date().toISOString(),
      choices: {
        // Never read from storage: it is true by definition, and a tampered
        // cookie must not be able to turn strictly necessary cookies "off"
        // and take the site's own session with it.
        necessary: true,
        analytics: choices.analytics === true,
        marketing: choices.marketing === true,
      },
    }
  } catch {
    // A malformed cookie is not a decision. Asking again is the safe answer.
    return null
  }
}

export function serialiseConsent(choices: ConsentChoices): string {
  const record: StoredConsent = {
    v: CONSENT_VERSION,
    choices: { ...choices, necessary: true },
    at: new Date().toISOString(),
  }

  return JSON.stringify(record)
}

/** Ask the mounted banner to open its preferences panel. */
export function openCookiePreferences(): void {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent(CONSENT_OPEN_EVENT))
}
