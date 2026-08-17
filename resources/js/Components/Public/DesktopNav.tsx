import { useCallback, useEffect, useId, useMemo, useRef } from 'react'
import type {
  CSSProperties,
  FocusEvent as ReactFocusEvent,
  KeyboardEvent,
  PointerEvent as ReactPointerEvent,
  ReactNode,
} from 'react'
import { Link, router } from '@inertiajs/react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import type { Transition } from 'motion/react'
import { ArrowRight, ChevronDown } from 'lucide-react'

import { readMegaPanel, splitIntro } from '@/Components/Public/navSlots'
import type { MegaPanel, NavPanelGroup } from '@/Components/Public/navSlots'
import { useHoverIntent } from '@/Hooks/useHoverIntent'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import type { NavItem, NavNode } from '@/Types/navigation'

export interface DesktopNavProps {
  items: NavNode[]
  className?: string | undefined
  /** Marks the item matching the current URL. */
  currentUrl?: string | undefined
  /**
   * Fires when a panel opens or closes. The header uses it to go opaque, so an
   * overlay header does not leave the panel floating on a transparent bar.
   */
  onOpenChange?: ((open: boolean) => void) | undefined
}

function isActive(href: string | undefined, currentUrl: string | undefined) {
  if (!href || !currentUrl) return false
  if (href === '/') return currentUrl === '/'
  return currentUrl === href || currentUrl.startsWith(`${href}/`)
}

/** External and anchor targets must not go through Inertia's client router. */
function isRouterLink(item: Pick<NavItem, 'href' | 'type' | 'newTab'>): boolean {
  if (item.newTab) return false
  if (item.type === 'external' || item.type === 'anchor') return false
  return Boolean(item.href?.startsWith('/'))
}

/** Any descendant, at any depth, pointing at the current page. */
function hasActiveDescendant(
  node: NavItem,
  currentUrl: string | undefined
): boolean {
  return (node.children ?? []).some(
    (child) =>
      isActive(child.href, currentUrl) || hasActiveDescendant(child, currentUrl)
  )
}

/* -----------------------------------------------------------------------------
   Link primitives
   -------------------------------------------------------------------------- */

interface AnchorProps {
  href: string
  className: string
  onNavigate: () => void
  newTab?: boolean | undefined
  current?: boolean | undefined
  routed: boolean
  children: ReactNode
}

/**
 * One anchor, rendered through Inertia or the browser as the target demands.
 *
 * Extracted because this panel renders up to forty links and every one of them
 * needs the same four decisions (router vs anchor, new-tab rel, `aria-current`,
 * close-on-navigate). Repeating that inline is how one of them ends up missing
 * `rel="noopener"`.
 */
function PanelAnchor({
  href,
  className,
  onNavigate,
  newTab,
  current,
  routed,
  children,
}: AnchorProps) {
  const { t } = useTranslations()

  if (routed) {
    return (
      <Link
        href={href}
        className={className}
        onClick={onNavigate}
        {...(current ? { 'aria-current': 'page' as const } : {})}
      >
        {children}
      </Link>
    )
  }

  return (
    <a
      href={href}
      className={className}
      onClick={onNavigate}
      {...(current ? { 'aria-current': 'page' as const } : {})}
      {...(newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {children}
      {newTab ? <span className="sr-only"> {t('(opens in a new tab)')}</span> : null}
    </a>
  )
}

/* -----------------------------------------------------------------------------
   Left rail
   -------------------------------------------------------------------------- */

interface RegionProps {
  panel: MegaPanel
  currentUrl?: string | undefined
  onNavigate: () => void
}

/**
 * The panel's left rail: what this section IS, then the four or five routes
 * into it that matter most, then one piece of proof.
 *
 * Tinted rather than bordered. The grid beside it is already a dense field of
 * text, and a rule between the two would read as a table gridline; a change of
 * material reads as a change of purpose.
 *
 * `<p>`, not `<h2>`, for the title. This is styled text naming a disclosure —
 * `aria-labelledby` already names the lists — and injecting headings above the
 * page's `h1` would corrupt the document outline for the sake of type size.
 */
function PanelRail({ panel, currentUrl, onNavigate }: RegionProps) {
  const { t } = useTranslations()
  const { meta, rail, featured } = panel
  const intro = splitIntro(meta.intro, meta.introLink)

  const introLinkClass =
    'fx-focus rounded-fx-xs underline decoration-fx-accent decoration-2 underline-offset-4 transition-colors duration-200 ease-fx hover:text-fx-accent-text motion-reduce:transition-none'

  return (
    <div className="bg-fx-surface-2 px-fx-gutter py-10 xl:py-12">
      {meta.title ? (
        <p className="text-[1.75rem] leading-[1.15] font-semibold tracking-[-0.028em] text-fx-ink xl:text-[2rem]">
          {t(meta.title)}
          {/* A separate accent character, never baked into the CMS string —
              an editor should not have to type punctuation to get a colour. */}
          <span aria-hidden="true" className="text-fx-accent">
            .
          </span>
        </p>
      ) : null}

      {meta.intro ? (
        <p className="mt-3 max-w-[34ch] text-[0.95rem] leading-[1.65] text-pretty text-fx-ink-soft">
          {intro ? (
            <>
              {intro.before}
              {isRouterLink({ href: intro.href }) ? (
                <Link
                  href={intro.href}
                  className={introLinkClass}
                  onClick={onNavigate}
                >
                  {intro.label}
                </Link>
              ) : (
                <a href={intro.href} className={introLinkClass} onClick={onNavigate}>
                  {intro.label}
                </a>
              )}
              {intro.after}
            </>
          ) : (
            // The label was not found in the text (or there is no link). The
            // intro renders as the plain string it is — markup is never
            // injected into editor copy.
            t(meta.intro)
          )}
        </p>
      ) : null}

      {rail.length > 0 ? (
        <ul className="mt-8 flex flex-col gap-1">
          {rail.map((item) => {
            const current = isActive(item.href, currentUrl)

            return (
              <li key={item.id}>
                <PanelAnchor
                  href={item.href as string}
                  routed={isRouterLink(item)}
                  onNavigate={onNavigate}
                  newTab={item.newTab}
                  current={current}
                  className={cn(
                    'fx-focus inline-block rounded-fx-xs py-1.5',
                    'text-[1.05rem] leading-[1.4] font-medium text-fx-ink',
                    'underline decoration-transparent decoration-2 underline-offset-4',
                    'transition-colors duration-200 ease-fx motion-reduce:transition-none',
                    'hover:text-fx-accent-text hover:decoration-fx-accent',
                    current && 'text-fx-accent-text decoration-fx-accent'
                  )}
                >
                  {t(item.label)}
                </PanelAnchor>
              </li>
            )
          })}
        </ul>
      ) : null}

      {featured ? (
        <>
          <hr className="my-8 border-0 border-t border-fx-line" />
          <FeaturedCard featured={featured} onNavigate={onNavigate} />
        </>
      ) : null}
    </div>
  )
}

/**
 * The proof card at the foot of the rail.
 *
 * WITH an image: a 64px thumbnail on the left and the copy beside it. A square
 * image reads as an object the sentence is *about*, which is what a case-study
 * card is; the same image stretched across the top of the column would read as
 * a banner, i.e. as decoration.
 *
 * WITHOUT one: the wordmark treatment — an uppercase client name above the
 * sentence. No box, no tile, no icon in either state: this is the last thing in
 * a tinted column, so it already reads as a separate object and a border around
 * it would be the panel's fourth container in 400px.
 *
 * Not inside the rail's `<ul>` — a heading-plus-link block inside a list of
 * links would make that list announce a count including something that is not
 * a navigation item.
 */
function FeaturedCard({
  featured,
  onNavigate,
}: {
  featured: NonNullable<MegaPanel['featured']>
  onNavigate: () => void
}) {
  const { t } = useTranslations()
  const { client, result, link, logo } = featured

  const linkNode = link ? (
    <PanelAnchor
      href={link.href}
      routed={isRouterLink({ href: link.href })}
      onNavigate={onNavigate}
      className={cn(
        'fx-focus mt-2 inline-block rounded-fx-xs',
        'text-[0.9rem] font-medium text-fx-ink underline underline-offset-4',
        'transition-colors duration-200 ease-fx motion-reduce:transition-none',
        'hover:text-fx-accent-text'
      )}
    >
      {t(link.label)}
    </PanelAnchor>
  ) : null

  if (logo) {
    return (
      <div className="flex items-start gap-3.5">
        <img
          src={logo.url}
          // Named by the sentence beside it when the editor gave no alt, so a
          // screen reader is not read a filename.
          alt={logo.alt ? t(logo.alt) : client ? t(client) : ''}
          // Intrinsic dimensions from the payload when the media record has
          // them, so the browser reserves the ratio before the bytes land.
          // They are NOT trusted for layout: the media library holds anything
          // from a 10×10 placeholder to a 1600×936 hero, so the CSS box is a
          // fixed 64px square with `object-cover` and a centred focal point.
          // The panel opens on hover — an image sized by its own file here is
          // the easiest layout shift in the whole header to cause.
          width={logo.width ?? 64}
          height={logo.height ?? 64}
          loading="lazy"
          decoding="async"
          className="size-16 shrink-0 rounded-fx-sm bg-fx-surface object-cover object-center"
        />

        <div className="min-w-0">
          {client ? (
            <p className="text-[0.72rem] font-bold tracking-widest text-fx-ink uppercase">
              {t(client)}
            </p>
          ) : null}

          {result ? (
            <p className="mt-1 max-w-[30ch] text-[0.9rem] leading-[1.55] text-pretty text-fx-ink-soft">
              {t(result)}
            </p>
          ) : null}

          {linkNode}
        </div>
      </div>
    )
  }

  return (
    <div>
      {client ? (
        <p className="text-[0.8rem] font-bold tracking-widest text-fx-ink uppercase">
          {t(client)}
        </p>
      ) : null}

      {result ? (
        <p className="mt-2.5 max-w-[34ch] text-[0.9rem] leading-[1.6] text-pretty text-fx-ink-soft">
          {t(result)}
        </p>
      ) : null}

      {linkNode}
    </div>
  )
}

/* -----------------------------------------------------------------------------
   Main grid
   -------------------------------------------------------------------------- */

/**
 * One group of links.
 *
 * COLUMN-MAJOR FLOW
 * -----------------
 * `column-count`, not a CSS grid. A grid fills row-major, which turns an
 * alphabetical list into a crossword — the reader's eye goes A, B across the
 * gap instead of down. Multi-column fills the first column to its balanced
 * height and only then starts the next, so the list reads top-to-bottom per
 * column with no need to pre-chunk the array in JS (which would then have to
 * re-chunk on every column-count change).
 *
 * `break-inside-avoid` on each item stops a link splitting across the fold.
 *
 * A group whose label is an empty string renders NO heading at all. That is a
 * documented authoring state, not a missing value: Technologies and Industries
 * are plain link fields by design.
 */
function PanelGroup({
  group,
  labelledBy,
  fallbackLabel,
  currentUrl,
  onNavigate,
}: {
  group: NavPanelGroup
  labelledBy: string
  fallbackLabel: string
  currentUrl?: string | undefined
  onNavigate: () => void
}) {
  const { t } = useTranslations()
  const headed = group.label !== ''

  return (
    <div
      className="min-w-0"
      // Span the same number of tracks the group flows internally, so two
      // groups sit side by side at their authored proportions instead of
      // stacking. Inline because the value is data, and a template literal
      // class would not survive Tailwind's source scan.
      style={{ gridColumn: `span ${group.columns} / span ${group.columns}` }}
    >
      {headed ? (
        <p
          id={labelledBy}
          className="mb-4 flex items-center gap-2.5 text-[0.78rem] font-semibold tracking-[0.08em] text-fx-ink-soft uppercase"
        >
          <span
            aria-hidden="true"
            className="size-2 shrink-0 bg-fx-accent"
          />
          {t(group.label)}
        </p>
      ) : null}

      <ul
        style={
          {
            columnCount: group.columns,
            columnGap: '2rem',
          } as CSSProperties
        }
        {...(headed
          ? { 'aria-labelledby': labelledBy }
          : { 'aria-label': fallbackLabel })}
      >
        {group.links.map((link) => {
          const current = isActive(link.href, currentUrl)

          return (
            <li key={link.id} className="break-inside-avoid">
              <PanelAnchor
                href={link.href as string}
                routed={isRouterLink(link)}
                onNavigate={onNavigate}
                newTab={link.newTab}
                current={current}
                className={cn(
                  'fx-focus flex min-h-[2.6rem] items-center rounded-fx-xs pe-2',
                  'text-[0.95rem] leading-[1.4] text-fx-ink',
                  'transition-colors duration-200 ease-fx motion-reduce:transition-none',
                  'hover:text-fx-accent-text',
                  current && 'text-fx-accent-text'
                )}
              >
                {t(link.label)}
              </PanelAnchor>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

/**
 * The link field, plus the panel's one closing action.
 *
 * The grid's track count is the SUM of its groups' columns, so "2 columns" and
 * "1 column" resolve to a 3-track field in which each group occupies exactly
 * the width it asked for. Authoring a fourth group simply narrows the tracks
 * rather than wrapping to a second row.
 */
function PanelGrid({ panel, currentUrl, onNavigate, listId, triggerLabel }: RegionProps & {
  listId: string
  triggerLabel: string
}) {
  const { t } = useTranslations()
  const { groups, meta, totalColumns } = panel

  if (groups.length === 0) {
    return null
  }

  return (
    <div className="flex min-w-0 flex-col px-fx-gutter py-10 xl:py-12 xl:ps-12">
      <div
        className="grid min-w-0 gap-x-8 gap-y-10 xl:gap-x-12"
        style={{ gridTemplateColumns: `repeat(${totalColumns}, minmax(0, 1fr))` }}
      >
        {groups.map((group) => (
          <PanelGroup
            key={group.id}
            group={group}
            labelledBy={`${listId}-${group.id}`}
            fallbackLabel={triggerLabel}
            onNavigate={onNavigate}
            {...(currentUrl ? { currentUrl } : {})}
          />
        ))}
      </div>

      {meta.footer ? (
        <div className="mt-10">
          <PanelAnchor
            href={meta.footer.href}
            routed={isRouterLink({ href: meta.footer.href })}
            onNavigate={onNavigate}
            className={cn(
              'group/all fx-focus inline-flex items-center gap-2 rounded-fx-xs',
              'text-[0.95rem] font-bold text-fx-ink',
              'transition-colors duration-200 ease-fx motion-reduce:transition-none',
              'hover:text-fx-accent-text'
            )}
          >
            {t(meta.footer.label)}
            <ArrowRight
              aria-hidden="true"
              className={cn(
                'size-4 shrink-0 transition-transform duration-200 ease-fx',
                'group-hover/all:translate-x-1 motion-reduce:transition-none',
                'motion-reduce:group-hover/all:translate-x-0'
              )}
            />
          </PanelAnchor>
        </div>
      ) : null}
    </div>
  )
}

/* -----------------------------------------------------------------------------
   Nav
   -------------------------------------------------------------------------- */

/**
 * Primary desktop navigation with a hover-intent mega menu.
 *
 * WHY NOT `DropdownMenu`
 * ---------------------
 * Radix's `DropdownMenu` is wrong here twice over. It is click-triggered by
 * design — there is no hover on a menu button, and there should not be, because
 * `role="menu"` describes an application menu whose items are commands. Site
 * navigation is a list of links, and wrapping `<ul><li><a>` in `role="menu"`
 * also fails `aria-required-children`.
 *
 * This is a **disclosure**: `<button aria-expanded aria-controls>` revealing
 * plain `<ul>`s of links. That is the correct pattern for navigation, and it is
 * also what makes hover legitimate — a disclosure may be opened by any gesture,
 * whereas a menu button has a defined keyboard contract that hover breaks.
 *
 * TRIGGERS WITH A DESTINATION
 * ---------------------------
 * A top-level item may itself point somewhere (`/services`), and that page has
 * to be reachable. Such an item renders as a LINK plus a separate chevron
 * button: the link navigates, the chevron discloses, and only the chevron
 * carries `aria-expanded`/`aria-controls` because only it owns the panel. An
 * item with no destination keeps the single-button form.
 *
 * HOVER INTENT (timings live in `useHoverIntent`)
 * ----------------------------------------------
 * Opening is debounced ~100ms so that sweeping the pointer across the bar on
 * the way to the CTA does not fire four panels in sequence. Closing is delayed
 * ~260ms because the pointer's path from a trigger to the item it is aiming at
 * is a diagonal that briefly leaves both the trigger and the panel; closing on
 * the first `pointerleave` snaps the menu shut mid-travel.
 *
 * Moving between two triggers while a panel is already open swaps immediately —
 * the open delay guards only the transition from "nothing open" to "something
 * open". And because the mega panel is ONE `motion.div` with a constant key, a
 * swap re-renders its children in place: no exit animation, no unmount, and
 * therefore none of the collapse-and-reopen flicker a per-node key causes.
 */
export function DesktopNav({
  items,
  className,
  currentUrl,
  onOpenChange,
}: DesktopNavProps) {
  const { t } = useTranslations()
  const reduceMotion = useReducedMotion()
  const baseId = useId()

  const {
    openId,
    intendOpen,
    intendClose,
    keepOpen,
    openNow,
    closeNow,
    toggleNow,
  } = useHoverIntent()

  const panelRef = useRef<HTMLDivElement>(null)
  /**
   * The disclosure control per node — the whole trigger when it is a plain
   * button, the chevron button when the label is a real link. Escape falls back
   * to this when the panel was opened by hover and no element "owns" it.
   */
  const triggers = useRef(new Map<string, HTMLElement | null>())
  /**
   * The element that actually opened the current panel. A link + chevron pair
   * has two focusable members, and Escape must return the caret to the one the
   * visitor used, not to whichever the map happens to hold.
   */
  const openedBy = useRef<HTMLElement | null>(null)
  /** Set when a panel was opened by ArrowDown, so focus moves into it. */
  const focusPanelOnOpen = useRef(false)

  const visible = useMemo(
    () => items.filter((item) => item.hideOn !== 'desktop'),
    [items]
  )

  /**
   * Every panel is parsed once for the whole menu, not per open.
   *
   * Parsing walks three levels of children, and the hover path re-renders this
   * component on each pointer event. Keying the work to `visible` — which only
   * changes when the CMS payload does — takes it off that path entirely.
   */
  const panels = useMemo(() => {
    const map = new Map<string, MegaPanel>()

    for (const node of visible) {
      if (node.display !== 'link' && (node.children?.length ?? 0) > 0) {
        map.set(node.id, readMegaPanel(node))
      }
    }

    return map
  }, [visible])

  const activeNode = useMemo(
    () => visible.find((node) => node.id === openId) ?? null,
    [openId, visible]
  )

  useEffect(() => {
    onOpenChange?.(openId !== null)
  }, [onOpenChange, openId])

  // Client-side navigation does not unmount the header, so without this the
  // panel would stay open over the page the visitor just asked for.
  useEffect(() => router.on('navigate', () => closeNow()), [closeNow])

  // Move focus into the panel only when it was opened with ArrowDown. The
  // panel mounts in the same commit as `openId`, so this effect runs after it
  // is in the DOM.
  useEffect(() => {
    if (openId === null || !focusPanelOnOpen.current) {
      return
    }

    focusPanelOnOpen.current = false
    panelRef.current?.querySelector<HTMLElement>('a[href]')?.focus()
  }, [openId])

  const focusTrigger = useCallback((id: string) => {
    const owner = openedBy.current

    if (owner && owner.isConnected) {
      owner.focus()

      return
    }

    triggers.current.get(id)?.focus()
  }, [])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape' && openId !== null) {
        event.stopPropagation()
        const id = openId
        closeNow()
        // Escape must return focus to where it came from, otherwise the
        // keyboard user is dropped at the top of the document.
        focusTrigger(id)
      }
    },
    [closeNow, focusTrigger, openId]
  )

  /**
   * ArrowDown opens and moves into the panel. Bound to the trigger GROUP, so it
   * works from the label link as well as from the chevron — a keyboard user who
   * tabbed onto "Services" should not have to tab once more to reach its
   * contents.
   */
  const handleTriggerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>, id: string) => {
      if (event.key === 'ArrowDown') {
        event.preventDefault()
        openedBy.current = event.target instanceof HTMLElement ? event.target : null
        focusPanelOnOpen.current = true
        openNow(id)
      }
    },
    [openNow]
  )

  /** Click/tap on a disclosure control: it, not hover, now owns the panel. */
  const handleDisclose = useCallback(
    (event: { currentTarget: HTMLElement }, id: string) => {
      openedBy.current = event.currentTarget
      toggleNow(id)
    },
    [toggleNow]
  )

  // Tab out of the whole nav (or a click that lands elsewhere) closes.
  const handleBlur = useCallback(
    (event: ReactFocusEvent<HTMLDivElement>) => {
      if (openId === null) {
        return
      }

      const next = event.relatedTarget

      if (next instanceof Node && event.currentTarget.contains(next)) {
        return
      }

      closeNow()
    },
    [closeNow, openId]
  )

  /**
   * Hover intent is for pointing devices only.
   *
   * A touch tap synthesises `pointerenter` immediately before `click`. Acting
   * on it would open the panel and then let the click toggle it straight back
   * shut, so touch is routed exclusively through `onClick` — which is also what
   * makes the first tap on a trigger open the panel instead of navigating.
   */
  const isHoverPointer = (event: ReactPointerEvent) =>
    event.pointerType === 'mouse' || event.pointerType === 'pen'

  if (visible.length === 0) {
    return null
  }

  const activePanel = activeNode ? (panels.get(activeNode.id) ?? null) : null
  const isMega = activeNode?.display === 'mega' && activePanel !== null
  const panelId = activeNode ? `${baseId}-panel-${activeNode.id}` : undefined
  const listId = `${baseId}-list`

  const hoverHandlers = {
    onPointerEnter: (event: ReactPointerEvent) => {
      if (isHoverPointer(event)) keepOpen()
    },
    onPointerLeave: (event: ReactPointerEvent) => {
      if (isHoverPointer(event)) intendClose()
    },
  }

  // Fast enough that the panel feels attached to the pointer rather than
  // animated at it. Static under `prefers-reduced-motion`.
  const panelTransition: Transition = reduceMotion
    ? { duration: 0 }
    : { duration: 0.18, ease: [0.22, 1, 0.36, 1] }

  return (
    <div
      // `contents` so the <nav> and the absolutely-positioned panel become
      // direct children of the header's flex row / positioning context. The
      // caller's `className` therefore goes on the <nav>, not here — a margin
      // on a `display: contents` box is discarded.
      className="contents"
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      <nav
        aria-label={t('Primary')}
        // Full bar height: the open indicator is a bar flush with the header's
        // bottom edge, which is only possible if the trigger reaches it.
        className={cn('hidden self-stretch lg:block', className)}
      >
        <ul className="flex h-full items-stretch gap-1 xl:gap-2">
          {visible.map((node) => {
            const panel = panels.get(node.id) ?? null
            const hasPanel = panel !== null
            const expanded = openId === node.id
            // `active` lights the indicator and may be true because a CHILD is
            // the current page; `selfActive` is the only one that may become
            // `aria-current="page"`, which describes this link's own target.
            const selfActive = isActive(node.href, currentUrl)
            const active = selfActive || hasActiveDescendant(node, currentUrl)
            const lit = expanded || active

            const triggerBase = cn(
              'inline-flex h-full items-center text-fx-label font-medium text-fx-ink',
              'transition-colors duration-200 ease-fx motion-reduce:transition-none',
              'hover:text-fx-accent-text fx-focus rounded-fx-xs',
              lit && 'text-fx-accent-text'
            )

            const triggerClass = cn(
              'group/nav relative gap-1.5 px-3 xl:px-4',
              triggerBase
            )

            /**
             * A thick accent bar welded to the header's bottom edge, not a pill
             * behind the label. A filled hover state is the admin dropdown's
             * gesture and makes a marketing bar read as a toolbar; a bar at the
             * seam reads as the panel's own tab.
             */
            const indicator = (
              <span
                aria-hidden="true"
                className={cn(
                  'pointer-events-none absolute inset-x-0 bottom-0 h-[3px] origin-center',
                  'bg-fx-accent transition-transform duration-200 ease-fx',
                  'motion-reduce:transition-none',
                  lit ? 'scale-x-100' : 'scale-x-0'
                )}
              />
            )

            if (!hasPanel) {
              // A `heading` node with no destination and no children is not a
              // link and must never be rendered as one.
              if (!node.href) return null

              return (
                <li key={node.id} className="flex">
                  <PanelAnchor
                    href={node.href}
                    routed={isRouterLink(node)}
                    onNavigate={intendClose}
                    newTab={node.newTab}
                    current={active}
                    className={triggerClass}
                  >
                    {t(node.label)}
                    {indicator}
                  </PanelAnchor>
                </li>
              )
            }

            const isDropdown = node.display !== 'mega'

            const chevron = (
              <ChevronDown
                aria-hidden="true"
                className={cn(
                  'size-3.5 shrink-0 transition-transform duration-200 ease-fx',
                  'motion-reduce:transition-none',
                  // Points UP while its own panel is open.
                  expanded && 'rotate-180'
                )}
              />
            )

            /**
             * Hover intent belongs to the trigger GROUP.
             *
             * With a link and a chevron side by side, hanging the handlers off
             * either one alone would fire `pointerleave` the moment the pointer
             * crossed the seam between them and start the close timer under the
             * visitor's own hand. React's enter/leave are element-scoped like
             * the native events, so on the wrapper they fire once for the pair.
             */
            const groupHover = {
              onPointerEnter: (event: ReactPointerEvent) => {
                if (!isHoverPointer(event)) return
                // Hover owns no element: Escape falls back to the map.
                openedBy.current = null
                intendOpen(node.id)
              },
              onPointerLeave: (event: ReactPointerEvent) => {
                if (isHoverPointer(event)) intendClose()
              },
            }

            /**
             * A trigger the editor gave a destination is a LINK first.
             *
             * Rendering it as a bare `<button>` — which is all this used to do —
             * makes the destination unreachable: clicking "Services" opened the
             * panel and nothing else, so `/service` could not be visited from
             * the nav at all. The label therefore navigates, and the disclosure
             * moves to its own small chevron button carrying `aria-expanded` and
             * `aria-controls`. The link must NOT carry them: it does not own the
             * panel, and announcing a link as expandable then navigating on
             * Enter is the contradiction that breaks screen-reader users.
             *
             * On touch this reads exactly as it does on a desktop: the label is
             * a link and takes the first tap, the chevron discloses. Nothing
             * hijacks that first tap.
             */
            const trigger = node.href ? (
              <div
                className="group/nav relative flex h-full items-stretch"
                {...groupHover}
                onKeyDown={(event) => handleTriggerKeyDown(event, node.id)}
              >
                <PanelAnchor
                  href={node.href}
                  routed={isRouterLink(node)}
                  onNavigate={closeNow}
                  newTab={node.newTab}
                  current={selfActive}
                  className={cn(triggerBase, 'ps-3 pe-1.5 xl:ps-4')}
                >
                  {t(node.label)}
                </PanelAnchor>

                <button
                  type="button"
                  ref={(element) => {
                    triggers.current.set(node.id, element)
                  }}
                  aria-expanded={expanded}
                  {...(expanded && panelId ? { 'aria-controls': panelId } : {})}
                  // The label beside it is the visible name; this control needs
                  // one of its own or it announces as an unlabelled "button".
                  aria-label={t('Show :label menu', { label: t(node.label) })}
                  className={cn(triggerBase, 'ps-1 pe-3 xl:pe-4')}
                  onClick={(event) => handleDisclose(event, node.id)}
                >
                  {chevron}
                </button>

                {indicator}
              </div>
            ) : (
              /* No destination (a `heading` node): the label IS the disclosure
                 and behaves exactly as it always has. */
              <button
                type="button"
                ref={(element) => {
                  triggers.current.set(node.id, element)
                }}
                aria-expanded={expanded}
                {...(expanded && panelId ? { 'aria-controls': panelId } : {})}
                className={triggerClass}
                {...groupHover}
                onClick={(event) => handleDisclose(event, node.id)}
                onKeyDown={(event) => handleTriggerKeyDown(event, node.id)}
              >
                {t(node.label)}
                {chevron}
                {indicator}
              </button>
            )

            return (
              <li key={node.id} className="relative flex">
                {trigger}

                {/* A dropdown is anchored to its trigger rather than to the
                    viewport, so it is rendered here inside the <li>. That
                    removes any need to measure the trigger's offset — the
                    browser positions it, and it cannot drift on resize. */}
                <AnimatePresence initial={false}>
                  {isDropdown && expanded && panelId ? (
                    <motion.div
                      key={`dropdown-${node.id}`}
                      id={panelId}
                      ref={panelRef}
                      className="absolute top-full left-0 z-10 min-w-56"
                      {...hoverHandlers}
                      initial={reduceMotion ? false : { opacity: 0, y: -6 }}
                      animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                      exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -4 }}
                      transition={panelTransition}
                    >
                      <div className="rounded-b-fx-md border border-fx-line bg-fx-canvas p-2 shadow-fx-3">
                        {panel.groups.map((group) => (
                          <PanelGroup
                            key={group.id}
                            group={{ ...group, columns: 1 }}
                            labelledBy={`${listId}-${group.id}`}
                            fallbackLabel={t(node.label)}
                            onNavigate={closeNow}
                            {...(currentUrl ? { currentUrl } : {})}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* The mega panel spans the viewport, flush under the bar. Positioned
          against the header's `relative` wrapper rather than the container, so
          the rail's tint bleeds to the left edge of the screen. */}
      <AnimatePresence initial={false}>
        {isMega && activeNode && activePanel && panelId ? (
          <motion.div
            // Constant key across nodes. This is what makes trigger-to-trigger
            // movement swap the panel's CONTENTS instead of unmounting one
            // panel and mounting another — the latter reads as a flicker.
            key="fx-nav-panel"
            id={panelId}
            className="absolute inset-x-0 top-full hidden lg:block"
            {...hoverHandlers}
            initial={reduceMotion ? false : { opacity: 0, y: -6 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0, y: -4 }}
            transition={panelTransition}
          >
            <div
              ref={panelRef}
              // Flush under the bar: no rounding, no floating card. The panel
              // is a continuation of the header surface, which is what
              // separates a mega menu from a dropdown. Fully opaque — 400px of
              // translucent panel over body copy is a contrast failure waiting
              // for the wrong background image.
              className="border-b border-fx-line bg-fx-canvas shadow-fx-3"
            >
              {/* A panel an editor has only half-filled must not render a
                  23% column beside 77% of nothing — with no groups the rail
                  takes the full measure. */}
              <div
                className={cn(
                  'grid items-stretch',
                  activePanel.groups.length > 0
                    ? 'grid-cols-[minmax(0,23%)_minmax(0,1fr)]'
                    : 'grid-cols-1'
                )}
              >
                <PanelRail
                  panel={activePanel}
                  onNavigate={closeNow}
                  {...(currentUrl ? { currentUrl } : {})}
                />
                <PanelGrid
                  panel={activePanel}
                  listId={listId}
                  triggerLabel={t(activeNode.label)}
                  onNavigate={closeNow}
                  {...(currentUrl ? { currentUrl } : {})}
                />
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <AnimatePresence initial={false}>
        {activeNode ? (
          <motion.div
            key="fx-nav-scrim"
            aria-hidden="true"
            // Behind the header's own surface (which owns the z-50 stacking
            // context) but above the page, so the panel reads as the only lit
            // surface without the scrim tinting the bar itself.
            className="fixed inset-0 -z-10 hidden bg-fx-ink/25 lg:block"
            onPointerDown={closeNow}
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
          />
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default DesktopNav
