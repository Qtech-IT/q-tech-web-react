/**
 * Readers for the `data` / `settings` JSON bags.
 *
 * Both arrive as `Record<string, unknown> | null` and both are editor-writable,
 * so every read is a runtime question, not a compile-time one. Centralising the
 * narrowing here is what keeps `as string` casts — and the crashes they hide —
 * out of the section components.
 */

export type JsonBag = Record<string, unknown> | null | undefined

/** A non-empty trimmed string, or `undefined`. Never an empty string. */
export function trimmed(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined
  }

  const next = value.trim()

  return next === '' ? undefined : next
}

/** A non-empty string at `key`, or `undefined`. */
export function readString(bag: JsonBag, key: string): string | undefined {
  return trimmed(bag?.[key])
}

/**
 * A finite number at `key`, or `undefined`.
 *
 * Numeric JSON columns round-trip through MySQL as strings often enough that
 * accepting both is the only reliable behaviour — `overlay_opacity` arrives as
 * `0` from the defaults but as `"40"` from a number input.
 */
export function readNumber(bag: JsonBag, key: string): number | undefined {
  const raw = bag?.[key]

  if (typeof raw === 'number') {
    return Number.isFinite(raw) ? raw : undefined
  }

  if (typeof raw === 'string' && raw.trim() !== '') {
    const parsed = Number(raw)

    return Number.isFinite(parsed) ? parsed : undefined
  }

  return undefined
}

/**
 * A boolean at `key`, falling back to `fallback`.
 *
 * Switch fields persist as `1`/`0` and sometimes `"1"`/`"0"`, so a bare
 * truthiness check would read `"0"` as `true`.
 */
export function readBoolean(bag: JsonBag, key: string, fallback: boolean): boolean {
  const raw = bag?.[key]

  if (typeof raw === 'boolean') {
    return raw
  }

  if (typeof raw === 'number') {
    return raw !== 0
  }

  if (typeof raw === 'string') {
    const next = raw.trim().toLowerCase()

    if (['1', 'true', 'yes', 'on'].includes(next)) {
      return true
    }

    if (['0', 'false', 'no', 'off', ''].includes(next)) {
      return false
    }
  }

  return fallback
}

/**
 * A value at `key` constrained to `allowed`, falling back to `fallback`.
 *
 * This is the guard that lets a component index a static Tailwind class map
 * safely: an editor (or a stale row from before a select's options changed)
 * can never produce a key the map has no entry for, so no variant can ever
 * render as an unstyled element.
 */
export function readOption<T extends string>(
  bag: JsonBag,
  key: string,
  allowed: readonly T[],
  fallback: T
): T {
  const raw = bag?.[key]
  const candidate = typeof raw === 'number' ? String(raw) : trimmed(raw)

  return allowed.includes(candidate as T) ? (candidate as T) : fallback
}

/** Clamp to an inclusive range. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}
