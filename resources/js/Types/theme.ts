/**
 * Theme contract — shared by the React client and the Laravel server.
 *
 * There is exactly ONE source of truth for the visitor's theme: the
 * `qtech_theme` cookie. The server reads it to stamp `class="dark"` and
 * `style="color-scheme: …"` on `<html>` before first paint; the client writes
 * it on an explicit user toggle. Nothing else may override it.
 *
 * The CMS value (`site_theme_settings.theme_mode`) is a *default for
 * first-time visitors only* — it seeds the cookie when none exists and is
 * ignored from then on.
 */

/** What the user asked for. `system` defers to `prefers-color-scheme`. */
export type Theme = 'light' | 'dark' | 'system'

/** What is actually painted. Never `system`. */
export type ResolvedTheme = 'light' | 'dark'

/** Cookie name agreed with the backend. Changing this is a breaking change. */
export const THEME_COOKIE_NAME = 'qtech_theme'

/**
 * Pre-rename cookie. Existing admin users still carry it, so the provider
 * migrates its value across once and then deletes it.
 */
export const LEGACY_THEME_COOKIE_NAME = 'vite-ui-theme'

export const THEME_COOKIE_MAX_AGE = 60 * 60 * 24 * 365

export const DEFAULT_THEME: Theme = 'light'

export const THEMES: readonly Theme[] = ['light', 'dark', 'system'] as const

export function isTheme(value: unknown): value is Theme {
  return value === 'light' || value === 'dark' || value === 'system'
}

export interface ThemeContextValue {
  /** The fallback this provider was configured with. */
  defaultTheme: Theme
  /** The user's stated preference. */
  theme: Theme
  /**
   * The theme actually painted. During SSR and the very first client render
   * this mirrors the class the server already stamped on `<html>`, so it never
   * disagrees with what is on screen.
   */
  resolvedTheme: ResolvedTheme
  setTheme: (theme: Theme) => void
  resetTheme: () => void
}
