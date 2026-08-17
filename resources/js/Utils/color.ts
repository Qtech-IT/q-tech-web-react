/**
 * Colour helpers for admin colour inputs.
 *
 * WHY THIS EXISTS
 * ---------------
 * Brand tokens are stored as raw CSS colour values, so any syntax the browser
 * accepts is valid: `#2f6df6`, `oklch(0.55 0.19 258)`, `hsl(220 90% 56%)`, or
 * the keyword `transparent`. `<input type="color">`, however, understands
 * exactly one syntax — `#rrggbb`. It has no concept of alpha, no concept of
 * `oklch()`, and no concept of "unset".
 *
 * So the picker is fed an *approximation* purely so its swatch opens on the
 * right colour, while the stored value stays untouched until the user actually
 * commits a new one. Nothing in here ever writes back on its own: these are
 * pure functions and the caller only persists on a real `change` event.
 *
 * No dependency is added for this — the OKLab→sRGB matrix is ~20 lines and
 * pulling a colour library in for one admin field would be the larger cost.
 */

/** Values that mean "paint nothing", where a picker would otherwise show black. */
const TRANSPARENT_KEYWORDS = new Set(['transparent', 'none', 'rgba(0,0,0,0)'])

/** The handful of keywords a brand field realistically carries. */
const NAMED: Record<string, string> = {
  black: '#000000',
  white: '#ffffff',
  red: '#ff0000',
  green: '#008000',
  blue: '#0000ff',
  gray: '#808080',
  grey: '#808080',
  silver: '#c0c0c0',
  navy: '#000080',
  teal: '#008080',
  orange: '#ffa500',
  purple: '#800080',
  yellow: '#ffff00',
}

export function isTransparentColor(value: string | null | undefined): boolean {
  if (typeof value !== 'string') return false

  return TRANSPARENT_KEYWORDS.has(value.trim().toLowerCase().replace(/\s+/g, ''))
}

function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n
}

function channelToHex(n: number): string {
  return Math.round(clamp01(n) * 255)
    .toString(16)
    .padStart(2, '0')
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${channelToHex(r)}${channelToHex(g)}${channelToHex(b)}`
}

/** The three numbers inside `fn(a b c / alpha)` or `fn(a, b, c)`. */
function readComponents(value: string, fn: string): number[] | null {
  const match = new RegExp(`^${fn}\\(([^)]*)\\)$`, 'i').exec(value)

  if (!match?.[1]) return null

  return match[1]
    .split('/')[0]!
    .trim()
    .split(/[\s,]+/)
    .filter((part) => part !== '')
    .map((part) =>
      part.endsWith('%') ? Number.parseFloat(part) / 100 : Number.parseFloat(part)
    )
}

/**
 * OKLCH → sRGB.
 *
 * `L` is accepted both as 0–1 and as a percentage (the CSS spec allows both);
 * anything above 1 is read as a percentage. Out-of-gamut results are clamped
 * per channel, which is what a picker swatch wants — an approximation that is
 * always renderable — rather than a gamut-mapped value.
 */
function oklchToHex(value: string): string | null {
  const parts = readComponents(value, 'oklch')

  if (!parts || parts.length < 3) return null

  const [rawL, rawC, rawH] = parts as [number, number, number]

  if (!Number.isFinite(rawL) || !Number.isFinite(rawC) || !Number.isFinite(rawH)) {
    return null
  }

  const L = rawL > 1 ? rawL / 100 : rawL
  const h = (rawH * Math.PI) / 180
  const a = rawC * Math.cos(h)
  const b = rawC * Math.sin(h)

  const l_ = L + 0.3963377774 * a + 0.2158037573 * b
  const m_ = L - 0.1055613458 * a - 0.0638541728 * b
  const s_ = L - 0.0894841775 * a - 1.291485548 * b

  const l = l_ * l_ * l_
  const m = m_ * m_ * m_
  const s = s_ * s_ * s_

  const linear = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ]

  const [r, g, bl] = linear.map((c) =>
    c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(clamp01(c), 1 / 2.4) - 0.055
  ) as [number, number, number]

  return rgbToHex(r, g, bl)
}

function rgbFunctionToHex(value: string): string | null {
  const parts = readComponents(value, 'rgba') ?? readComponents(value, 'rgb')

  if (!parts || parts.length < 3) return null

  const [r, g, b] = parts as [number, number, number]

  if (!Number.isFinite(r) || !Number.isFinite(g) || !Number.isFinite(b)) return null

  // `readComponents` already divided percentages by 100; 0–255 numbers need it.
  const norm = (n: number) => (n > 1 ? n / 255 : n)

  return rgbToHex(norm(r), norm(g), norm(b))
}

function hslToHex(value: string): string | null {
  const parts = readComponents(value, 'hsl') ?? readComponents(value, 'hsla')

  if (!parts || parts.length < 3) return null

  const [rawH, s, l] = parts as [number, number, number]

  if (!Number.isFinite(rawH) || !Number.isFinite(s) || !Number.isFinite(l)) return null

  const h = ((rawH % 360) + 360) % 360
  const sat = clamp01(s)
  const lig = clamp01(l)

  const c = (1 - Math.abs(2 * lig - 1)) * sat
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
  const m = lig - c / 2

  const table: Array<[number, number, number]> = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ]

  const [r, g, b] = table[Math.min(5, Math.floor(h / 60))]!

  return rgbToHex(r + m, g + m, b + m)
}

function expandHex(value: string): string | null {
  const hex = value.replace(/^#/, '')

  if (/^[0-9a-f]{3}$/i.test(hex)) {
    return `#${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`.toLowerCase()
  }

  // Alpha is dropped: `<input type="color">` cannot express it, and the stored
  // value — which keeps the alpha — is never overwritten from the picker's
  // rendering of it.
  if (/^[0-9a-f]{6}([0-9a-f]{2})?$/i.test(hex)) {
    return `#${hex.slice(0, 6)}`.toLowerCase()
  }

  return null
}

/**
 * A `#rrggbb` the picker can open on, for ANY stored CSS colour.
 *
 * This is display-only. It is deliberately lossy (alpha dropped, out-of-gamut
 * clamped, unknown syntax replaced by `fallback`) and must never be written
 * back to the setting unless the user changed the picker.
 */
export function toHexApprox(
  value: string | null | undefined,
  fallback = '#000000'
): string {
  const raw = typeof value === 'string' ? value.trim().toLowerCase() : ''

  if (raw === '') return fallback
  if (isTransparentColor(raw)) return fallback

  const compact = raw.replace(/\s+/g, ' ')

  return (
    expandHex(compact) ??
    NAMED[compact] ??
    oklchToHex(compact) ??
    rgbFunctionToHex(compact) ??
    hslToHex(compact) ??
    fallback
  )
}

/** Checkerboard fill for a swatch whose value paints nothing. */
export const CHECKERBOARD_STYLE = {
  backgroundImage:
    'linear-gradient(45deg, var(--muted-foreground) 25%, transparent 25%), linear-gradient(-45deg, var(--muted-foreground) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--muted-foreground) 75%), linear-gradient(-45deg, transparent 75%, var(--muted-foreground) 75%)',
  backgroundSize: '10px 10px',
  backgroundPosition: '0 0, 0 5px, 5px -5px, -5px 0',
  opacity: 0.35,
} as const
