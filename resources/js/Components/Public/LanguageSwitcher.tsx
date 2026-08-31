import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import { Check, Globe, Loader2 } from 'lucide-react'

import { publicRoutes } from '@/Config/publicRoutes'
import { useForm } from '@/Hooks/useForm'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'

export interface PublicLanguage {
  code: string
  name: string
  direction?: string | null
}

export interface LanguageSwitcherProps {
  languages: PublicLanguage[]
  currentCode: string
  className?: string | undefined
}

/**
 * The public language switcher.
 *
 * WHY THIS IS HAND-ROLLED AND NOT `Components/UI/DropdownMenu`
 * -----------------------------------------------------------
 * That component wraps its content in a Radix `Portal`, which renders to
 * `document.body` — OUTSIDE the `data-site="public"` subtree. Every `--fx-*`
 * token in `frontend.css` is scoped to that attribute, so a portalled panel
 * asking for `bg-fx-surface` and `text-fx-ink` got *nothing*: an invisible
 * menu of invisible text. Inside the footer it was worse, because the footer
 * rebinds those tokens locally for its dark surface and a portal cannot
 * inherit a local rebinding either.
 *
 * Rendered inline, the panel sits inside both scopes and is simply correct —
 * on the light page, on the dark footer, in either theme, with no portal
 * gymnastics and no duplicated token block.
 *
 * WHAT WE OWE FOR DROPPING RADIX — the keyboard contract, implemented here:
 * `aria-haspopup`/`aria-expanded` on the trigger, arrow keys and Home/End to
 * move through options, Escape to close, focus returned to the trigger on
 * close, and a pointerdown-outside listener to dismiss. `role="menu"` with
 * `role="menuitem"` children, so it is announced as a menu rather than as a
 * pile of buttons.
 *
 * WHY EACH OPTION POSTS INSTEAD OF BEING A LINK
 * ---------------------------------------------
 * Switching language changes server-side session state. As links they would be
 * GETs, and every crawler, prefetcher and "open all in tabs" would fire them —
 * leaving visitors in whichever language was fetched last.
 *
 * Renders nothing when there is one language or fewer.
 */
export function LanguageSwitcher({
  languages,
  currentCode,
  className,
}: LanguageSwitcherProps) {
  const { t } = useTranslations()
  const { loading, submit } = useForm()

  const [open, setOpen] = useState(false)
  const [pending, setPending] = useState<string | null>(null)

  const menuId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([])

  const current = useMemo(
    () => languages.find((language) => language.code === currentCode),
    [languages, currentCode]
  )

  const close = useCallback((restoreFocus = true) => {
    setOpen(false)

    if (restoreFocus) {
      triggerRef.current?.focus()
    }
  }, [])

  // Dismiss on an outside press. `pointerdown`, not `click`: a click fires
  // after focus has already moved, which on a touch device left the panel open
  // behind whatever the visitor actually tapped.
  useEffect(() => {
    if (!open) {
      return
    }

    function handlePointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => document.removeEventListener('pointerdown', handlePointerDown)
  }, [open])

  // Focus the current language when the panel opens, so arrowing starts from
  // where the visitor already is rather than from the top of the list.
  useEffect(() => {
    if (!open) {
      return
    }

    const index = Math.max(
      languages.findIndex((language) => language.code === currentCode),
      0
    )

    itemRefs.current[index]?.focus()
  }, [currentCode, languages, open])

  if (languages.length < 2) {
    return null
  }

  function switchTo(code: string) {
    if (loading || code === currentCode) {
      close()

      return
    }

    setPending(code)
    setOpen(false)

    void submit({
      url: publicRoutes.locale(code),
      method: 'POST',
      // NOT preserved: the whole page's copy changes, and `preserveState`
      // would keep the previous locale's props mounted underneath the new
      // ones. This is the one visit on the public site that must be a full
      // re-render.
      preserveState: false,
      preserveScroll: true,
    })
      .catch(() => {
        // The server rejects unknown or deactivated codes and flashes its own
        // message; nothing useful to add here.
      })
      .finally(() => setPending(null))
  }

  function moveFocus(from: number, delta: number) {
    const next = (from + delta + languages.length) % languages.length

    itemRefs.current[next]?.focus()
  }

  function handleItemKeyDown(event: React.KeyboardEvent, index: number) {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        moveFocus(index, 1)
        break
      case 'ArrowUp':
        event.preventDefault()
        moveFocus(index, -1)
        break
      case 'Home':
        event.preventDefault()
        itemRefs.current[0]?.focus()
        break
      case 'End':
        event.preventDefault()
        itemRefs.current[languages.length - 1]?.focus()
        break
      case 'Escape':
        event.preventDefault()
        close()
        break
      default:
        break
    }
  }

  return (
    <div ref={rootRef} className={cn('relative', className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((value) => !value)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault()
            setOpen(true)
          }
        }}
        className={cn(
          'inline-flex items-center gap-2 rounded-fx-xs px-2.5 py-1.5',
          'text-fx-body-sm text-fx-ink-soft',
          'transition-colors duration-200 ease-fx hover:text-fx-ink',
          'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-fx-focus',
          'motion-reduce:transition-none'
        )}
      >
        {loading && pending ? (
          <Loader2 aria-hidden="true" className="size-4 animate-spin" />
        ) : (
          <Globe aria-hidden="true" className="size-4" />
        )}
        <span>{current?.name ?? currentCode.toUpperCase()}</span>
        <span className="sr-only">{t('Change language')}</span>
      </button>

      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-label={t('Change language')}
          className={cn(
            // Opens UPWARD: this lives in the footer's bottom bar, and a menu
            // dropping downward from there opens off the end of the document.
            'absolute bottom-full z-50 mb-2',
            /*
             * HORIZONTAL ANCHORING, and why it is responsive.
             *
             * The footer's bottom bar is `flex-col-reverse` on phones and
             * `flex-row justify-between` from `sm` up — so the trigger sits at
             * the START of the line on a phone and at the END on everything
             * wider. A panel pinned to one edge is therefore correct at one
             * breakpoint and off-screen at the other: anchored to its end edge
             * (the original) it grew leftwards out of the viewport on a phone,
             * where the trigger is already at the left margin.
             *
             * `start-*`/`end-*`, not `left-*`/`right-*`: this is the control
             * that switches the site into Arabic, so it is the last place that
             * may assume a writing direction. Logical insets flip with `dir`
             * for free.
             */
            'start-0 sm:start-auto sm:end-0',
            /*
             * Belt and braces for every other placement — a long language name
             * in a narrow viewport, or this component reused somewhere the
             * trigger is mid-line. The panel can never be wider than the
             * viewport minus a gutter, whatever `min-w` asks for, and a long
             * list scrolls inside itself rather than off the top of the page.
             */
            'min-w-44 max-w-[calc(100vw-1.5rem)] max-h-[60vh] overflow-y-auto overscroll-contain',
            'rounded-fx-md border border-fx-line bg-fx-surface p-1 shadow-fx-3',
            // The footer's rebound `--fx-surface` is an alpha white over the
            // dark band, which would let the page show through a floating
            // panel. Compositing it over the band's own colour first keeps it
            // opaque without hardcoding either value.
            'bg-[color-mix(in_oklab,var(--fx-surface),var(--fx-canvas))]'
          )}
        >
          {languages.map((language, index) => {
            const active = language.code === currentCode

            return (
              <button
                key={language.code}
                ref={(node) => {
                  itemRefs.current[index] = node
                }}
                type="button"
                role="menuitem"
                {...(active ? { 'aria-current': 'true' as const } : {})}
                onClick={() => switchTo(language.code)}
                onKeyDown={(event) => handleItemKeyDown(event, index)}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-fx-xs',
                  'px-3 py-2 text-left text-fx-body-sm text-fx-ink',
                  'transition-colors duration-150 ease-fx hover:bg-fx-surface-2',
                  'focus-visible:bg-fx-surface-2 focus-visible:outline-2',
                  'focus-visible:-outline-offset-2 focus-visible:outline-fx-focus',
                  'motion-reduce:transition-none',
                  active && 'font-semibold'
                )}
              >
                <span>{language.name}</span>
                {active ? (
                  <Check aria-hidden="true" className="size-4 text-fx-accent-text" />
                ) : null}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}

export default LanguageSwitcher
