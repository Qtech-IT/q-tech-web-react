import type { NavItem, NavMedia, NavNode } from '@/Types/navigation'

/**
 * Header composition read out of the CMS, not out of this file.
 *
 * `NavigationService::present()` forwards every menu item's `settings` JSON
 * verbatim, so an editor composes the header by filling that blob in rather
 * than by anyone shipping a new column or a new component. This module is the
 * single place that interprets it. Two conventions live here:
 *
 *   Top-level node   settings.display  = 'mega' | 'dropdown' | 'link'
 *                    settings.slot     = 'nav' | 'utility' | 'search'
 *                    settings.panel    = { title, intro, intro_link, footer }
 *                    settings.featured = { client, result, link, logo }
 *
 *   Child of a panel settings.slot     = 'rail' (left rail link)
 *                                      | 'grid' (a column group)
 *                    settings.columns  = 1 | 2 | 3   (grid groups only)
 *
 *   Grandchild       a plain link inside a grid group
 *
 * Everything is read defensively. `settings` is an untyped blob a human edits,
 * so a wrong type is normal input, not an exception — a bad value degrades the
 * region to "absent" and the header composes without it. Nothing here invents
 * a link, a label or a promo.
 */

/* -----------------------------------------------------------------------------
   Primitive readers
   -------------------------------------------------------------------------- */

function readString(
  settings: Record<string, unknown> | undefined,
  key: string
): string | undefined {
  const value = settings?.[key]

  if (typeof value !== 'string') {
    return undefined
  }

  const trimmed = value.trim()

  return trimmed === '' ? undefined : trimmed
}

/** A plain JSON object, or `undefined` for anything else (including arrays). */
function readObject(
  settings: Record<string, unknown> | undefined,
  key: string
): Record<string, unknown> | undefined {
  const value = settings?.[key]

  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined
  }

  return value as Record<string, unknown>
}

/* -----------------------------------------------------------------------------
   Header regions
   -------------------------------------------------------------------------- */

/** Where an editor has asked a top-level header item to render. */
export type NavSlot = 'nav' | 'utility' | 'search'

const SLOTS: readonly NavSlot[] = ['nav', 'utility', 'search']

/**
 * The region a top-level item belongs to. Anything unrecognised falls back to
 * `nav`, so a typo in the admin costs an item its placement, never visibility.
 */
export function navSlot(item: NavItem): NavSlot {
  const value = readString(item.settings, 'slot')

  return SLOTS.includes(value as NavSlot) ? (value as NavSlot) : 'nav'
}

export interface HeaderRegions {
  nav: NavNode[]
  utility: NavNode[]
  /** First search-slotted item only; a header has one search affordance. */
  search: NavNode | null
}

/**
 * Split the primary menu into its header regions in a single pass.
 *
 * Returned as one object rather than three `filter()` calls so the header can
 * memoise the whole partition on one dependency, and so an item can never be
 * counted twice by two independent predicates drifting apart.
 */
export function partitionHeaderItems(items: NavNode[]): HeaderRegions {
  const regions: HeaderRegions = { nav: [], utility: [], search: null }

  for (const item of items) {
    switch (navSlot(item)) {
      case 'utility':
        regions.utility.push(item)
        break
      case 'search':
        // A second search item is dropped rather than rendered: two search
        // affordances in one bar is an authoring mistake, not a layout.
        if (!regions.search && item.href) regions.search = item
        break
      default:
        regions.nav.push(item)
    }
  }

  return regions
}

/* -----------------------------------------------------------------------------
   Mega panel
   -------------------------------------------------------------------------- */

/** A label + destination pair authored inside `settings`. Both are required. */
export interface NavLinkRef {
  label: string
  href: string
}

function readLinkRef(
  settings: Record<string, unknown> | undefined,
  key: string
): NavLinkRef | undefined {
  const raw = readObject(settings, key)
  const label = readString(raw, 'label')
  const href = readString(raw, 'href')

  // A link needs both halves. A label with no destination is dead text; a
  // destination with no label is an empty focusable anchor.
  return label && href ? { label, href } : undefined
}

function readMedia(
  settings: Record<string, unknown> | undefined,
  key: string
): NavMedia | undefined {
  const raw = readObject(settings, key)
  const url = readString(raw, 'url')

  if (!url) {
    return undefined
  }

  const width = raw?.['width']
  const height = raw?.['height']

  return {
    url,
    // A client mark sits beside its own result sentence, so the mark itself is
    // decorative unless the editor gave it a better name.
    alt: readString(raw, 'alt') ?? '',
    ...(typeof width === 'number' ? { width } : {}),
    ...(typeof height === 'number' ? { height } : {}),
  }
}

/** The panel's editorial header: what it is, in the editor's own words. */
export interface NavPanelMeta {
  /** Rendered with a trailing accent full stop the string must NOT contain. */
  title: string | undefined
  intro: string | undefined
  /** One phrase inside `intro` that becomes a link. */
  introLink: NavLinkRef | undefined
  /** "All Services →", bottom-left of the grid. */
  footer: NavLinkRef | undefined
}

/** The proof card at the foot of the rail. */
export interface NavFeatured {
  /** Wordmark text. Used only when there is no `logo`. */
  client: string
  result: string | undefined
  link: NavLinkRef | undefined
  /** Client mark. Preferred over the wordmark when present. */
  logo: NavMedia | undefined
}

/** One heading + its links in the main grid. */
export interface NavPanelGroup {
  id: string
  /** Empty string means "no heading" — an intentional authoring state. */
  label: string
  /** 1–3. Drives the group's own multi-column flow AND its grid span. */
  columns: number
  links: NavItem[]
}

export interface MegaPanel {
  meta: NavPanelMeta
  /** Left-rail links, in author order. */
  rail: NavItem[]
  groups: NavPanelGroup[]
  featured: NavFeatured | null
  /** Sum of every group's columns; the grid's track count. */
  totalColumns: number
}

const MAX_GROUP_COLUMNS = 3

/**
 * Which region of a panel a child belongs to.
 *
 * Explicit `settings.slot` wins. When it is missing the shape decides: an item
 * that owns children can only be a group, and a bare link can only be a rail
 * entry. That inference is what stops a menu authored before this convention
 * existed from rendering as an empty panel.
 */
function childSlot(item: NavItem): 'rail' | 'grid' {
  const value = readString(item.settings, 'slot')

  if (value === 'rail' || value === 'grid') {
    return value
  }

  return (item.children?.length ?? 0) > 0 ? 'grid' : 'rail'
}

/**
 * Read a panel out of a top-level node.
 *
 * Returns a fully-formed object even for a node the editor has barely filled
 * in — `rail`/`groups` empty, `featured` null — because the renderer's job is
 * then to omit those regions, not to branch on undefined.
 */
export function readMegaPanel(node: NavNode): MegaPanel {
  const panel = readObject(node.settings, 'panel')
  const featuredRaw = readObject(node.settings, 'featured')

  const rail: NavItem[] = []
  const groups: NavPanelGroup[] = []

  for (const child of node.children ?? []) {
    if (child.type === 'separator') {
      continue
    }

    if (childSlot(child) === 'rail') {
      // A rail entry with no destination is a heading in the wrong place.
      if (child.href) rail.push(child)

      continue
    }

    const links = (child.children ?? []).filter(
      (link) => link.type !== 'separator' && Boolean(link.href)
    )

    // An empty group would render a heading over nothing.
    if (links.length === 0) {
      continue
    }

    const columns = Number(child.settings?.['columns'] ?? 1)

    groups.push({
      id: child.id,
      // Deliberately not `readString`: an empty label is the documented way to
      // ask for a headless group, so it must survive as ''.
      label: (child.label ?? '').trim(),
      columns: Number.isFinite(columns)
        ? Math.min(Math.max(Math.trunc(columns), 1), MAX_GROUP_COLUMNS)
        : 1,
      links,
    })
  }

  const client = readString(featuredRaw, 'client')
  const logo = readMedia(featuredRaw, 'logo') ?? node.media

  return {
    meta: {
      // Falls back to the trigger's own label so a panel is never headless
      // just because the editor skipped one field.
      title: readString(panel, 'title') ?? (node.label.trim() || undefined),
      intro: readString(panel, 'intro'),
      introLink: readLinkRef(panel, 'intro_link'),
      footer: readLinkRef(panel, 'footer'),
    },
    rail,
    groups,
    // A card with neither a name nor a mark has nothing to identify; it is
    // dropped rather than rendered as a floating sentence.
    featured:
      client || logo
        ? {
            client: client ?? '',
            result: readString(featuredRaw, 'result'),
            link: readLinkRef(featuredRaw, 'link'),
            logo,
          }
        : null,
    totalColumns: Math.max(
      groups.reduce((total, group) => total + group.columns, 0),
      1
    ),
  }
}

/** `intro` split around the one phrase that becomes a link. */
export interface NavIntroParts {
  before: string
  label: string
  href: string
  after: string
}

/**
 * Locate `link.label` inside `intro`.
 *
 * A string search, never HTML: the intro is editor-authored plain text, and
 * interpolating markup into it would hand every editor an XSS primitive for
 * the sake of an underline. When the label is not present in the text the
 * caller renders the intro plain — a link is dropped, never invented.
 */
export function splitIntro(
  intro: string | undefined,
  link: NavLinkRef | undefined
): NavIntroParts | null {
  if (!intro || !link) {
    return null
  }

  const index = intro.indexOf(link.label)

  if (index === -1) {
    return null
  }

  return {
    before: intro.slice(0, index),
    label: link.label,
    href: link.href,
    after: intro.slice(index + link.label.length),
  }
}
