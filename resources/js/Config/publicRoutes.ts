/**
 * Public endpoint paths, in one place.
 *
 * There is no Ziggy `route()` helper wired into this bundle, so every public
 * form would otherwise carry its own string literal — and the day a path
 * changes, the compiler has nothing to say about the three components still
 * posting to the old one. Naming them here does not give us route-name safety,
 * but it does give us one file to change and one place to grep.
 *
 * Keep these in step with `routes/web.php`.
 */
export const publicRoutes = {
  /** `POST` — newsletter signup. Throttled to 6/min per IP. */
  subscribe: '/subscribe',

  /** `POST` — switch the visitor's language. Throttled to 20/min per IP. */
  locale: (code: string) => `/locale/${encodeURIComponent(code)}`,
} as const
