/**
 * Admin-authored brand tokens, shared on EVERY route — public and `/backend`.
 *
 * Every field is optional even though the middleware always sends the full
 * set: this is a shared prop, and a layout must survive the server sending
 * less than it promises.
 *
 * The two consumers read the same payload but bind it to different token
 * families and are deliberately not interchangeable:
 *
 *  - `PublicLayout` feeds the whole `--fx-*` design system (accent, radius,
 *    both button skins). The public site IS the brand.
 *  - `BaseLayout` (admin) binds ONLY the accent points — primary button,
 *    active nav, focus ring, corner radius. Admin surfaces, borders, muted
 *    text and table backgrounds stay on the tuned neutral scale, because a
 *    colour picked for a landing page must not be able to break contrast in
 *    a dense data table.
 */
export interface BrandTokens {
  accent?: string
  accentInk?: string
  accentDark?: string
  accentInkDark?: string
  radius?: string
  /* Button skins are separate settings from the accent: the primary CTA on an
     enterprise site is usually near-black while the accent stays the link and
     focus colour. `buttonSecondary` is `transparent` by default. */
  buttonPrimary?: string
  buttonPrimaryInk?: string
  buttonSecondary?: string
  buttonSecondaryInk?: string
}
