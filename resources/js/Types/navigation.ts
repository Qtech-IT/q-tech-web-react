/**
 * Navigation contract.
 *
 * These shapes deliberately mirror what the CMS menu builder will eventually
 * emit, so swapping the placeholder config for server-driven data is a change
 * of *source*, not of *shape*. Nothing here may become required — a public
 * component must survive missing CMS data (see CLAUDE.md).
 */

/** Where a menu item points. `heading`/`separator` carry no destination. */
export type NavItemType =
  | 'internal'
  | 'external'
  | 'anchor'
  | 'heading'
  | 'separator'

export interface NavBadge {
  label: string
  /** Maps to Badge variants; unknown values fall back to `secondary`. */
  variant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

/**
 * An image attached to a menu item (`menu_items.media_id`).
 *
 * `NavigationService::present()` emits this as `null` for every item without
 * an attachment, which is most of them — so every consumer must treat it as
 * absent and fall back rather than assuming an image is there.
 */
export interface NavMedia {
  url: string
  alt?: string
  width?: number
  height?: number
}

export interface NavItem {
  /** Stable key. The CMS will supply a uuid; placeholders use a slug. */
  id: string
  label: string
  /** Item artwork — a mega panel's featured client mark uses this. */
  media?: NavMedia
  href?: string
  type?: NavItemType
  /** Lucide icon name, resolved at render. Unknown names render nothing. */
  icon?: string
  badge?: NavBadge
  newTab?: boolean
  description?: string
  children?: NavItem[]
  /**
   * The menu item's raw `settings` JSON, passed through verbatim by
   * `NavigationService::present()`.
   *
   * Typed as unknown values rather than a closed shape on purpose. This is an
   * open extension point an editor writes into, so the renderer's job is to
   * read it defensively (see `Components/Public/navSlots.ts`) — a closed
   * interface here would be a lie about data the backend does not validate.
   */
  settings?: Record<string, unknown>
}

/**
 * A top-level entry. `mega` renders a multi-column panel; `dropdown` a simple
 * list; a `link` has no children.
 */
export interface NavNode extends NavItem {
  display?: 'link' | 'dropdown' | 'mega'
  /** Column count for `mega`. Clamped to 1–4 at render. */
  columns?: number
  /** Hide on one breakpoint without duplicating the tree. */
  hideOn?: 'mobile' | 'desktop'
}

export interface NavCta {
  label: string
  href: string
  /**
   * The editor's "Button style". The dialog stores `solid` / `outline` /
   * `ghost`; `default` is what the server emits when nothing was chosen, and
   * `secondary` is a legacy value. The trailing `string & {}` keeps the union
   * as autocomplete while still accepting a value this build does not know —
   * `ctaTone()` in `fxButton.ts` is what resolves all of them.
   */
  variant?: 'solid' | 'outline' | 'ghost' | 'default' | 'secondary' | (string & {})
  newTab?: boolean
}

export interface FooterColumn {
  id: string
  title: string
  items: NavItem[]
}

export interface SocialLink {
  id: string
  label: string
  href: string
  /** Lucide icon name. */
  icon: string
}

export interface SiteNavigation {
  primary: NavNode[]
  ctas: NavCta[]
  footerColumns: FooterColumn[]
  legal: NavItem[]
  social: SocialLink[]
}
