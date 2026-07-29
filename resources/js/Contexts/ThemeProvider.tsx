import type { ReactNode } from 'react'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'

import type { ResolvedTheme, Theme, ThemeContextValue } from '@/Types/theme'
import {
  DEFAULT_THEME,
  LEGACY_THEME_COOKIE_NAME,
  THEME_COOKIE_MAX_AGE,
  THEME_COOKIE_NAME,
  isTheme,
} from '@/Types/theme'
import { getCookie, removeCookie, setCookie } from '@/Utils/helpers'

const DARK_QUERY = '(prefers-color-scheme: dark)'

const isBrowser = (): boolean =>
  typeof window !== 'undefined' && typeof document !== 'undefined'

/** Reads the media query without ever touching `window` on the server. */
function systemTheme(): ResolvedTheme {
  if (!isBrowser() || typeof window.matchMedia !== 'function') return 'light'
  return window.matchMedia(DARK_QUERY).matches ? 'dark' : 'light'
}

/**
 * The theme that is *already on screen*. The server stamps `class="dark"` (or
 * a blocking inline script does, when the cookie says `system`), so this is
 * the authoritative starting value — reading it instead of recomputing is what
 * keeps the provider from fighting the server and causing a flash.
 */
function stampedTheme(): ResolvedTheme {
  if (!isBrowser()) return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/**
 * Resolves the user's stated preference. Order:
 *   1. `qtech_theme` cookie          — explicit choice, always wins
 *   2. legacy `vite-ui-theme` cookie — migrated, then removed
 *   3. CMS default                   — first-time visitors only
 *   4. `system`
 */
function readPreference(cmsDefault: Theme | undefined, fallback: Theme): Theme {
  if (!isBrowser()) return cmsDefault ?? fallback

  const current = getCookie(THEME_COOKIE_NAME)
  if (isTheme(current)) return current

  const legacy = getCookie(LEGACY_THEME_COOKIE_NAME)
  if (isTheme(legacy)) return legacy

  return cmsDefault ?? fallback
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export interface ThemeProviderProps {
  children: ReactNode
  defaultTheme?: Theme
  /** Cookie name. Overridable for tests; production must use the default. */
  storageKey?: string
  /**
   * `site_theme_settings.theme_mode` from the CMS. Seeds the preference for a
   * visitor who has never chosen — it never overrides an explicit choice.
   */
  dbTheme?: Theme | string | undefined
}

export function ThemeProvider({
  children,
  defaultTheme = DEFAULT_THEME,
  storageKey = THEME_COOKIE_NAME,
  dbTheme,
}: ThemeProviderProps) {
  const cmsDefault = isTheme(dbTheme) ? dbTheme : undefined

  const [theme, setThemeState] = useState<Theme>(() =>
    readPreference(cmsDefault, defaultTheme)
  )

  // Seeded from the class the server already painted, so the first client
  // render agrees with the DOM instead of contradicting it.
  const [resolvedTheme, setResolvedTheme] = useState<ResolvedTheme>(stampedTheme)

  // Guards the very first effect run: the DOM is already correct at that
  // point, so we must not run the transition-suppressing swap.
  const hasMounted = useRef(false)

  /**
   * Writes the resolved theme to the DOM. Suppresses transitions for exactly
   * one frame so switching does not produce a staggered repaint of every
   * colour-transitioning element. No-ops when the DOM already matches, which
   * is what makes the initial load transition-free.
   */
  const paint = useCallback((next: ResolvedTheme) => {
    if (!isBrowser()) return

    const root = document.documentElement
    const alreadyCorrect =
      root.classList.contains(next) &&
      !root.classList.contains(next === 'dark' ? 'light' : 'dark')

    if (alreadyCorrect) {
      root.style.colorScheme = next
      return
    }

    root.classList.add('no-transitions')
    root.classList.remove('light', 'dark')
    root.classList.add(next)
    root.style.colorScheme = next

    // Two frames: one for the class to commit, one for the paint to settle.
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        root.classList.remove('no-transitions')
      })
    })
  }, [])

  // Adopt the server-stamped class on mount, and migrate the legacy cookie.
  useEffect(() => {
    if (!isBrowser()) return

    if (!isTheme(getCookie(storageKey)) && isTheme(getCookie(LEGACY_THEME_COOKIE_NAME))) {
      setCookie(storageKey, getCookie(LEGACY_THEME_COOKIE_NAME) as Theme, THEME_COOKIE_MAX_AGE)
      removeCookie(LEGACY_THEME_COOKIE_NAME)
    }

    setResolvedTheme(stampedTheme())
    hasMounted.current = true
    // Runs once; `storageKey` is a constant in production.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Apply preference changes. Skipped on the first pass — the server already
  // painted, and repainting there is precisely what caused the old flash.
  useEffect(() => {
    if (!isBrowser()) return

    const next: ResolvedTheme = theme === 'system' ? systemTheme() : theme

    if (!hasMounted.current) {
      setResolvedTheme(next)
      // Correct a server/client disagreement silently, without a transition.
      if (next !== stampedTheme()) paint(next)
      return
    }

    setResolvedTheme(next)
    paint(next)
  }, [theme, paint])

  // Follow the OS only while the user has actually asked for `system`.
  useEffect(() => {
    if (!isBrowser() || theme !== 'system' || typeof window.matchMedia !== 'function') {
      return
    }

    const media = window.matchMedia(DARK_QUERY)
    const onChange = (event: MediaQueryListEvent) => {
      const next: ResolvedTheme = event.matches ? 'dark' : 'light'
      setResolvedTheme(next)
      paint(next)
    }

    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [theme, paint])

  const setTheme = useCallback(
    (next: Theme) => {
      if (!isTheme(next)) return
      setCookie(storageKey, next, THEME_COOKIE_MAX_AGE)
      setThemeState(next)
    },
    [storageKey]
  )

  const resetTheme = useCallback(() => {
    removeCookie(storageKey)
    setThemeState(cmsDefault ?? defaultTheme)
  }, [storageKey, cmsDefault, defaultTheme])

  const value = useMemo<ThemeContextValue>(
    () => ({ defaultTheme, theme, resolvedTheme, setTheme, resetTheme }),
    [defaultTheme, theme, resolvedTheme, setTheme, resetTheme]
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
