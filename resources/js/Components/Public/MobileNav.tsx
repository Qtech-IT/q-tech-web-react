import { useEffect, useMemo, useState } from 'react'
import { Link, router } from '@inertiajs/react'
import { ArrowRight, ChevronDown, Menu, X } from 'lucide-react'

import { Button } from '@/Components/UI/Button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from '@/Components/UI/Sheet'
import { ctaTone, fxButton } from '@/Components/Public/fxButton'
import { readMegaPanel } from '@/Components/Public/navSlots'
import type { MegaPanel } from '@/Components/Public/navSlots'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import type { NavCta, NavItem, NavNode } from '@/Types/navigation'

export interface MobileNavProps {
  items: NavNode[]
  ctas?: NavCta[] | undefined
  className?: string | undefined
  currentUrl?: string | undefined
  /** Repeated inside the overlay so the brand never leaves the viewport. */
  siteName?: string | undefined
  logo?: string | undefined
  logoDark?: string | undefined
}

function isRouterLink(item: NavItem | NavCta): boolean {
  if (item.newTab) return false
  if ('type' in item && (item.type === 'external' || item.type === 'anchor')) {
    return false
  }
  return Boolean(item.href?.startsWith('/'))
}

function isActive(href: string | undefined, currentUrl: string | undefined) {
  if (!href || !currentUrl) return false
  if (href === '/') return currentUrl === '/'
  return currentUrl === href || currentUrl.startsWith(`${href}/`)
}

/**
 * One link inside an expanded section.
 *
 * `size` mirrors the desktop panel's two weights: rail entries are the routes
 * an editor promoted and read a notch larger, grid entries are the taxonomy.
 * Keeping the same distinction on both surfaces is why a CMS menu behaves
 * identically at every breakpoint instead of flattening on a phone.
 */
function DrawerLink({
  item,
  size,
  currentUrl,
  onNavigate,
}: {
  item: NavItem
  size: 'rail' | 'grid'
  currentUrl?: string | undefined
  onNavigate: () => void
}) {
  const { t } = useTranslations()

  // A `heading` child carries no destination and must never become a link.
  if (!item.href) {
    return null
  }

  const active = isActive(item.href, currentUrl)

  const className = cn(
    // 44px minimum: this is the only nav on a touch device.
    'fx-focus flex min-h-11 items-center rounded-fx-xs',
    'transition-colors duration-200 ease-fx motion-reduce:transition-none',
    // One notch under the section rows above them, and the grid one notch
    // under the rail, so three levels are legible at interface scale.
    size === 'rail'
      ? 'text-[0.9375rem] font-semibold text-fx-ink'
      : 'text-[0.875rem] text-fx-ink-soft hover:text-fx-ink',
    active && 'text-fx-accent-text'
  )

  return (
    <li>
      {isRouterLink(item) ? (
        <Link
          href={item.href}
          className={className}
          onClick={onNavigate}
          {...(active ? { 'aria-current': 'page' as const } : {})}
        >
          {t(item.label)}
        </Link>
      ) : (
        <a
          href={item.href}
          className={className}
          onClick={onNavigate}
          {...(active ? { 'aria-current': 'page' as const } : {})}
          {...(item.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        >
          {t(item.label)}
          {item.newTab ? (
            <span className="sr-only"> {t('(opens in a new tab)')}</span>
          ) : null}
        </a>
      )}
    </li>
  )
}

/**
 * An expanded section's body: the same rail → groups → featured → footer
 * sequence the desktop panel renders, stacked into one column.
 *
 * Everything is read through `readMegaPanel`, so there is exactly one
 * interpretation of the `settings` convention across both surfaces — a change
 * to the authoring contract cannot land on desktop and miss mobile.
 */
function DrawerPanel({
  panel,
  sectionId,
  triggerLabel,
  currentUrl,
  onNavigate,
}: {
  panel: MegaPanel
  sectionId: string
  triggerLabel: string
  currentUrl?: string | undefined
  onNavigate: () => void
}) {
  const { t } = useTranslations()
  const { rail, groups, meta, featured } = panel

  return (
    <div className="pt-0.5 pb-4">
      {rail.length > 0 ? (
        <ul aria-label={triggerLabel} className="flex flex-col">
          {rail.map((item) => (
            <DrawerLink
              key={item.id}
              item={item}
              size="rail"
              onNavigate={onNavigate}
              {...(currentUrl ? { currentUrl } : {})}
            />
          ))}
        </ul>
      ) : null}

      {groups.map((group) => {
        const headed = group.label !== ''
        const labelId = `${sectionId}-${group.id}`

        return (
          <div key={group.id} className="mt-4 first:mt-0">
            {headed ? (
              <p
                id={labelId}
                className="mb-1 flex items-center gap-2 text-[0.75rem] font-semibold tracking-[0.09em] text-fx-ink-faint uppercase"
              >
                <span aria-hidden="true" className="size-1.5 shrink-0 bg-fx-accent" />
                {t(group.label)}
              </p>
            ) : null}

            <ul
              className="flex flex-col"
              {...(headed
                ? { 'aria-labelledby': labelId }
                : { 'aria-label': triggerLabel })}
            >
              {group.links.map((link) => (
                <DrawerLink
                  key={link.id}
                  item={link}
                  size="grid"
                  onNavigate={onNavigate}
                  {...(currentUrl ? { currentUrl } : {})}
                />
              ))}
            </ul>
          </div>
        )
      })}

      {featured?.result || featured?.link ? (
        <div className="mt-4 flex items-start gap-3 border-t border-fx-line pt-4">
          {featured.logo ? (
            <img
              src={featured.logo.url}
              alt={
                featured.logo.alt
                  ? t(featured.logo.alt)
                  : featured.client
                    ? t(featured.client)
                    : ''
              }
              // The payload's own dimensions when it has them, so the browser
              // knows the aspect ratio before bytes arrive — but the CSS box is
              // a fixed square regardless, because the library holds anything
              // from a 10px placeholder to a 1600px hero and the overlay
              // scrolls under this card.
              width={featured.logo.width ?? 56}
              height={featured.logo.height ?? 56}
              loading="lazy"
              decoding="async"
              className="size-14 shrink-0 rounded-fx-sm bg-fx-surface-2 object-cover object-center"
            />
          ) : null}

          <div className="min-w-0">
            {featured.client ? (
              <p className="text-[0.72rem] font-bold tracking-widest text-fx-ink uppercase">
                {t(featured.client)}
              </p>
            ) : null}

            {featured.result ? (
              <p className="mt-1 text-fx-body-sm text-pretty text-fx-ink-soft">
                {t(featured.result)}
              </p>
            ) : null}

            {featured.link ? (
              <a
                href={featured.link.href}
                onClick={onNavigate}
                className="fx-focus mt-1 inline-block rounded-fx-xs text-fx-body-sm font-medium text-fx-ink underline underline-offset-4"
              >
                {t(featured.link.label)}
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      {meta.footer ? (
        <Link
          href={meta.footer.href}
          onClick={onNavigate}
          className="fx-focus mt-2 inline-flex min-h-11 items-center gap-2 rounded-fx-xs text-[0.875rem] font-semibold text-fx-ink"
        >
          {t(meta.footer.label)}
          <ArrowRight aria-hidden="true" className="size-4 shrink-0" />
        </Link>
      ) : null}
    </div>
  )
}

/**
 * Mobile navigation — a full-screen canvas overlay, not a side sheet.
 *
 * A drawer sliding over a dimmed page is an app-shell gesture; a marketing menu
 * on a phone is a *page*, so it takes the whole viewport and keeps the brand in
 * place. The type is set at interface scale rather than display scale, so the
 * entire menu — six sections plus the CTA — is readable in one screen on the
 * smallest phone we support. Nothing about the panel announces
 * itself as chrome: no border, no radius, no shadow, no visible container.
 *
 * Focus trapping, Escape-to-close, outside-click dismissal, `aria-modal` and
 * focus restoration to the trigger come from Radix's Dialog underneath `Sheet`
 * — not reimplemented here. `hideClose` suppresses Radix's own 16px corner
 * button so this component can render the large X the design calls for.
 *
 * Two things Radix does NOT handle that are handled explicitly:
 *  1. Closing on Inertia navigation. Client-side routing does not unmount the
 *     overlay, so without this the menu stays open over the new page.
 *  2. Body scroll lock. `app.css` neutralises Radix's lock with
 *     `body[data-scroll-locked] { overflow: unset !important }` (added for
 *     sticky headers), so the lock is reapplied here via a class the override
 *     does not touch.
 *
 * Disclosure sections are real `<button aria-expanded aria-controls>` elements
 * — the same pattern as `DesktopNav`, minus hover intent, because hover does
 * not exist on touch. A section that carries its own destination splits the
 * same way the desktop bar does: the label navigates, a separate 44px chevron
 * expands, and only the chevron owns the disclosure attributes.
 *
 * `data-site="public"` is repeated on the panel: Radix portals `SheetContent`
 * to `document.body`, which is outside the layout root that normally scopes the
 * public design tokens.
 */
export function MobileNav({
  items,
  ctas,
  className,
  currentUrl,
  siteName,
  logo,
  logoDark,
}: MobileNavProps) {
  const { t } = useTranslations()
  const [open, setOpen] = useState(false)
  const [expanded, setExpanded] = useState<string | null>(null)

  // Close on client-side navigation.
  useEffect(() => {
    const stop = router.on('navigate', () => setOpen(false))
    return () => stop()
  }, [])

  // Reapply the scroll lock that app.css deliberately disables for Radix.
  useEffect(() => {
    if (typeof document === 'undefined') return
    const body = document.body
    if (open) body.classList.add('nav-scroll-locked')
    else body.classList.remove('nav-scroll-locked')
    return () => body.classList.remove('nav-scroll-locked')
  }, [open])

  // A closed menu forgets which section was open: reopening should present the
  // whole menu, not the middle of one branch.
  useEffect(() => {
    if (!open) setExpanded(null)
  }, [open])

  const visible = useMemo(
    () => items.filter((item) => item.hideOn !== 'mobile'),
    [items]
  )

  // Parsed once per payload rather than per expand, so opening a section is a
  // pure render and never walks three levels of children on the tap.
  const panels = useMemo(() => {
    const map = new Map<string, MegaPanel>()

    for (const node of visible) {
      if (node.display !== 'link' && (node.children?.length ?? 0) > 0) {
        map.set(node.id, readMegaPanel(node))
      }
    }

    return map
  }, [visible])

  if (visible.length === 0) return null

  const brand = siteName?.trim() || 'QTECH'
  const close = () => setOpen(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {/* A bare glyph. A bordered pill here would be the only boxed control
            in the bar and would read as the page's primary action. */}
        <button
          type="button"
          aria-label={t('Open menu')}
          className={cn(
            'fx-focus inline-flex size-11 shrink-0 items-center justify-center rounded-fx-xs',
            'bg-transparent text-fx-ink',
            'transition-colors duration-200 ease-fx hover:text-fx-accent-text motion-reduce:transition-none',
            className
          )}
        >
          <Menu aria-hidden="true" className="size-7" strokeWidth={1.75} />
        </button>
      </SheetTrigger>

      <SheetContent
        side="right"
        hideClose
        data-site="public"
        className={cn(
          // Full-bleed canvas: every one of the sheet's own affordances —
          // width cap, border, radius, shadow — is switched off.
          'inset-0 h-dvh w-full max-w-none border-0 bg-fx-canvas p-0 shadow-none sm:max-w-none',
          'gap-0 text-fx-ink',
          'data-[state=open]:duration-200 data-[state=closed]:duration-150'
        )}
      >
        {/* The overlay is a dialog and needs an accessible name; the visible
            brand is a link, so the name is supplied off-screen instead. */}
        <SheetTitle className="sr-only">{t('Menu')}</SheetTitle>

        <div className="flex h-(--header-height) shrink-0 items-center justify-between px-fx-gutter">
          <Link
            href="/"
            onClick={close}
            className="fx-focus flex shrink-0 items-center gap-2 rounded-fx-sm"
            aria-label={t('Go to homepage')}
          >
            {logo ? (
              <>
                <img
                  src={logo}
                  alt={brand}
                  width={132}
                  height={36}
                  className={cn('h-8 w-auto', logoDark && 'dark:hidden')}
                />
                {logoDark ? (
                  <img
                    src={logoDark}
                    alt={brand}
                    width={132}
                    height={36}
                    className="hidden h-8 w-auto dark:block"
                  />
                ) : null}
              </>
            ) : (
              <span className="text-fx-subheading tracking-[-0.03em] text-fx-ink">
                {brand}
              </span>
            )}
          </Link>

          <SheetClose
            aria-label={t('Close menu')}
            className="fx-focus -me-2 inline-flex size-12 items-center justify-center rounded-fx-xs text-fx-ink transition-colors duration-200 ease-fx hover:text-fx-accent-text motion-reduce:transition-none"
          >
            <X aria-hidden="true" className="size-8" strokeWidth={1.5} />
          </SheetClose>
        </div>

        <nav
          aria-label={t('Primary')}
          className="flex-1 overflow-y-auto overscroll-contain px-fx-gutter pt-3 pb-6"
        >
          {/* No gap between rows. At 16px the type is small enough that the
              rows' own 10px padding already separates them; adding more would
              re-open the vertical gaps the larger scale needed and push the
              list past the fold on a 667px screen. */}
          <ul className="flex flex-col">
            {visible.map((node) => {
              const panel = panels.get(node.id) ?? null
              const isOpen = expanded === node.id
              const sectionId = `mobile-nav-${node.id}`
              const active = isActive(node.href, currentUrl)

              /* Interface, not display type. Every larger scale tried here
                 (2rem, 1.5rem, then 1.125rem) turned six items into a wall and
                 pushed the CTA toward the fold; 1rem semibold is the size an
                 enterprise product menu is set at, and it is what the whole
                 menu is budgeted against:

                   64 header + 12 top pad
                   + 6 × 44 rows (the touch target, not the type, sets this)
                   + 24 bottom pad + 89 CTA footer (h-12 button + 32 pad + rule)
                   = 453px  →  fits a 667px viewport with ~210px to spare,
                 and still fits with two CTAs and a 20px-larger header.

                 `min-h-11` stays regardless: 44px is a tap-target requirement
                 and has nothing to do with how large the type is. The vertical
                 padding drops to 10px so the rhythm tightens with the type
                 instead of leaving the row floating in its old box.

                 The underline is the only state the row carries — no fill, no
                 tint — so an open section and the current page read as the same
                 kind of emphasis.

                 `justify-start`, not `justify-between`: a chevron pinned to the
                 far edge of the viewport reads as a table row. It belongs to
                 the label, so it sits directly after it. */
              const rowClass = cn(
                'flex min-h-11 w-full items-center justify-start gap-2 py-2.5 text-left',
                'text-[1rem] leading-[1.35] font-semibold tracking-[-0.01em] text-fx-ink',
                'fx-focus rounded-fx-xs',
                'underline-offset-[0.35em] decoration-2 decoration-fx-accent',
                'transition-colors duration-200 ease-fx motion-reduce:transition-none',
                isOpen || active ? 'underline' : 'no-underline'
              )

              const rowChevron = (
                <ChevronDown
                  aria-hidden="true"
                  className={cn(
                    'size-4 shrink-0 text-fx-ink-faint',
                    'transition-transform duration-200 ease-fx motion-reduce:transition-none',
                    isOpen && 'rotate-180'
                  )}
                />
              )

              if (!panel) {
                if (!node.href) return null

                return (
                  <li key={node.id}>
                    {isRouterLink(node) ? (
                      <Link
                        href={node.href}
                        onClick={close}
                        {...(active ? { 'aria-current': 'page' as const } : {})}
                        className={rowClass}
                      >
                        {t(node.label)}
                      </Link>
                    ) : (
                      <a
                        href={node.href}
                        onClick={close}
                        className={rowClass}
                        {...(node.newTab
                          ? { target: '_blank', rel: 'noopener noreferrer' }
                          : {})}
                      >
                        {t(node.label)}
                        {node.newTab ? (
                          <span className="sr-only">
                            {' '}
                            {t('(opens in a new tab)')}
                          </span>
                        ) : null}
                      </a>
                    )}
                  </li>
                )
              }

              /* The same rule the desktop bar follows: a section the editor
                 gave a destination must be able to reach it. The label is a
                 link and takes the tap; the chevron beside it is a separate
                 44px control that only expands, so a touch user is never sent
                 to the page just because they wanted to see what is inside.
                 Only the chevron carries `aria-expanded`/`aria-controls`. */
              const toggle = (
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : node.id)}
                  aria-expanded={isOpen}
                  aria-controls={sectionId}
                  aria-label={t('Show :label links', { label: t(node.label) })}
                  className="fx-focus -me-2 inline-flex size-11 shrink-0 items-center justify-center rounded-fx-xs"
                >
                  {rowChevron}
                </button>
              )

              return (
                <li key={node.id}>
                  {node.href ? (
                    /* `justify-start`, not `justify-between`: the no-href rows
                       put their chevron immediately after the label, and
                       pushing this one to the far edge made a menu where
                       "Services" looked like a different kind of row from
                       "Technologies" purely because it happened to carry a
                       destination. The affordance must not shift position based
                       on a data detail the visitor cannot see. */
                    <div className="flex items-center justify-start gap-1">
                      {isRouterLink(node) ? (
                        <Link
                          href={node.href}
                          onClick={close}
                          {...(active ? { 'aria-current': 'page' as const } : {})}
                          className={cn(rowClass, 'w-auto')}
                        >
                          {t(node.label)}
                        </Link>
                      ) : (
                        <a
                          href={node.href}
                          onClick={close}
                          className={cn(rowClass, 'w-auto')}
                          {...(node.newTab
                            ? { target: '_blank', rel: 'noopener noreferrer' }
                            : {})}
                        >
                          {t(node.label)}
                          {node.newTab ? (
                            <span className="sr-only">
                              {' '}
                              {t('(opens in a new tab)')}
                            </span>
                          ) : null}
                        </a>
                      )}

                      {toggle}
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setExpanded(isOpen ? null : node.id)}
                      aria-expanded={isOpen}
                      aria-controls={sectionId}
                      className={rowClass}
                    >
                      <span>{t(node.label)}</span>
                      {rowChevron}
                    </button>
                  )}

                  {/* `hidden`, not unmounted: the section keeps its DOM order
                      so the collapsed row above it stays the accessible name
                      of what follows. */}
                  <div id={sectionId} hidden={!isOpen}>
                    <DrawerPanel
                      panel={panel}
                      sectionId={sectionId}
                      triggerLabel={t(node.label)}
                      onNavigate={close}
                      {...(currentUrl ? { currentUrl } : {})}
                    />
                  </div>
                </li>
              )
            })}
          </ul>
        </nav>

        {ctas && ctas.length > 0 ? (
          <div className="flex shrink-0 flex-col gap-2 border-t border-fx-line px-fx-gutter py-4">
            {ctas.map((cta, position) => (
              <Button
                key={cta.href}
                asChild
                className={cn(
                  /* `md`, not `lg`: a 56px button under 16px menu type is the
                     heaviest thing on the screen. `md` keeps the CTA the
                     largest target without out-shouting the menu itself.

                     The tone is the editor's "Button style" — the same
                     resolution the desktop bar runs, so one CTA cannot be
                     ghost on desktop and solid on a phone. Where they left it
                     unset the drawer's own positional rule applies:

                     `solid`, not `inverse`: both paint a near-black pill by
                     default, but `solid` is the tone wired to the admin's
                     primary-button colour, so this CTA follows a rebrand
                     instead of staying hard-coded to the ink token. */
                  fxButton({
                    tone: ctaTone(
                      cta.variant,
                      position === 0 ? 'solid' : 'outline'
                    ),
                    scale: 'md',
                  }),
                  'w-full'
                )}
              >
                {isRouterLink(cta) ? (
                  <Link href={cta.href} onClick={close}>
                    {t(cta.label)}
                  </Link>
                ) : (
                  <a
                    href={cta.href}
                    onClick={close}
                    {...(cta.newTab
                      ? { target: '_blank', rel: 'noopener noreferrer' }
                      : {})}
                  >
                    {t(cta.label)}
                  </a>
                )}
              </Button>
            ))}
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}

export default MobileNav
