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

export interface NavItem {
  /** Stable key. The CMS will supply a uuid; placeholders use a slug. */
  id: string
  label: string
  href?: string
  type?: NavItemType
  /** Lucide icon name, resolved at render. Unknown names render nothing. */
  icon?: string
  badge?: NavBadge
  newTab?: boolean
  description?: string
  children?: NavItem[]
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
  variant?: 'default' | 'outline' | 'secondary' | 'ghost'
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
