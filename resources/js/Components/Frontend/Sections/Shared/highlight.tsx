import type { ReactNode } from 'react'

/**
 * The accent treatment for highlighted heading words.
 *
 * Drawn as a background gradient rather than a `border-bottom` or an absolutely
 * positioned bar for two reasons: `box-decoration-break: clone` makes it wrap
 * correctly across lines (a positioned bar cannot), and it reads as editorial
 * emphasis rather than as a link, which an `underline` on a heading always
 * does.
 *
 * The mark is mixed from `--foreground`, so it inverts with the theme
 * automatically and introduces no hue — the palette is deliberately neutral and
 * hierarchy is carried by type, space and elevation.
 */
const HIGHLIGHT_CLASS = [
  'relative',
  // Accent ink for the emphasised run, plus a swash beneath it. Both read
  // `--fx-*` first and fall back to the admin token, so the same helper renders
  // correctly in a CMS preview pane where the public scope is not mounted.
  // `--fx-accent-text` is the contrast-safe cut of the accent (see
  // frontend.css) and it rebinds on inverted bands, so this can never become
  // the low-contrast element on a dark section.
  '[color:var(--fx-accent-text,inherit)]',
  '[background-image:linear-gradient(to_right,color-mix(in_oklab,var(--fx-accent,var(--foreground))_22%,transparent),color-mix(in_oklab,var(--fx-accent,var(--foreground))_6%,transparent))]',
  '[background-size:100%_0.26em]',
  '[background-position:0_92%]',
  '[background-repeat:no-repeat]',
  '[box-decoration-break:clone]',
  '[-webkit-box-decoration-break:clone]',
].join(' ')

/** Escape a value for literal use inside a `RegExp`. */
function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/**
 * Split `heading` into plain and accented runs.
 *
 * `heading_highlight` is a comma-separated list of **plain text** phrases, and
 * this is the reason why: an editor must never be able to put raw markup into a
 * headline. Nothing here injects HTML — matches become React elements, so the
 * worst a bad value can do is fail to match.
 *
 * Phrases are matched longest-first so that a list like `"team, your team"`
 * accents the longer phrase instead of leaving a stray fragment, and matching
 * is case-insensitive because a translator will not reproduce the headline's
 * capitalisation by hand.
 */
export function highlightHeading(
  heading: string | null | undefined,
  highlight: string | null | undefined
): ReactNode {
  const text = heading?.trim()

  if (!text) {
    return null
  }

  const phrases = (highlight ?? '')
    .split(',')
    .map((phrase) => phrase.trim())
    .filter((phrase) => phrase !== '')
    .sort((a, b) => b.length - a.length)

  if (phrases.length === 0) {
    return text
  }

  const pattern = new RegExp(`(${phrases.map(escapeRegExp).join('|')})`, 'gi')

  // `String.split` with a capturing group interleaves the separators, so odd
  // indices are the matches and even indices are the surrounding text.
  const parts = text.split(pattern)

  if (parts.length === 1) {
    return text
  }

  return parts.map((part, index) => {
    if (part === '') {
      return null
    }

    return index % 2 === 1 ? (
      <span key={`hl-${index}`} className={HIGHLIGHT_CLASS}>
        {part}
      </span>
    ) : (
      <span key={`tx-${index}`}>{part}</span>
    )
  })
}
