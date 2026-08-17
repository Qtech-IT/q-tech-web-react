import { useCallback, useEffect, useRef, useState } from 'react'

/**
 * Delay before a pointer resting on a trigger counts as intent to open.
 *
 * Short enough to feel instant on a deliberate approach, long enough that
 * sweeping the pointer across the whole nav bar on the way to the CTA does not
 * fire four panels in sequence.
 */
const OPEN_DELAY = 100

/**
 * Grace period before an exited menu actually closes.
 *
 * This is the single value that separates a premium mega menu from a
 * frustrating one. The pointer's path from a trigger to the item it is aiming
 * for inside the panel is a diagonal, and that diagonal briefly leaves both the
 * trigger and the panel. Closing on the first `pointerleave` snaps the menu
 * shut mid-travel; ~260ms covers the traverse without the menu feeling stuck
 * open after a genuine exit.
 */
const CLOSE_DELAY = 260

export interface HoverIntent {
  /** Currently open menu id, or `null`. */
  openId: string | null
  /** Pointer entered a trigger. Opens after `OPEN_DELAY`. */
  intendOpen: (id: string) => void
  /** Pointer left a trigger or the panel. Closes after `CLOSE_DELAY`. */
  intendClose: () => void
  /** Pointer re-entered the panel or trigger — abandon a pending close. */
  keepOpen: () => void
  /** Open immediately (keyboard, touch). */
  openNow: (id: string) => void
  /** Close immediately (Escape, navigation, focus loss). */
  closeNow: () => void
  /** Toggle immediately. Used by click/tap and by Enter/Space. */
  toggleNow: (id: string) => void
}

/**
 * Hover-intent controller for a single-panel-at-a-time menu bar.
 *
 * Two independent timers rather than one, because open and close are different
 * decisions: opening is debounced against accidental travel, closing is delayed
 * to forgive it. Sharing a timer would make one of the two wrong.
 *
 * Once *something* is open, moving to another trigger swaps instantly — the
 * open delay only guards the transition from "no menu" to "a menu". Re-applying
 * it between siblings is what makes a menu bar feel sticky and unresponsive.
 */
export function useHoverIntent(): HoverIntent {
  const [openId, setOpenId] = useState<string | null>(null)
  const openTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  // Mirrors `openId` for the timer callbacks, which would otherwise close over
  // a stale value and re-apply the open delay on every sibling hop.
  const openIdRef = useRef<string | null>(null)

  const clearTimers = useCallback(() => {
    if (openTimer.current) {
      clearTimeout(openTimer.current)
      openTimer.current = null
    }

    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  const commit = useCallback((id: string | null) => {
    openIdRef.current = id
    setOpenId(id)
  }, [])

  const openNow = useCallback(
    (id: string) => {
      clearTimers()
      commit(id)
    },
    [clearTimers, commit]
  )

  const closeNow = useCallback(() => {
    clearTimers()
    commit(null)
  }, [clearTimers, commit])

  const toggleNow = useCallback(
    (id: string) => {
      clearTimers()
      commit(openIdRef.current === id ? null : id)
    },
    [clearTimers, commit]
  )

  const intendOpen = useCallback(
    (id: string) => {
      clearTimers()

      if (openIdRef.current !== null) {
        commit(id)

        return
      }

      openTimer.current = setTimeout(() => {
        openTimer.current = null
        commit(id)
      }, OPEN_DELAY)
    },
    [clearTimers, commit]
  )

  const intendClose = useCallback(() => {
    clearTimers()

    closeTimer.current = setTimeout(() => {
      closeTimer.current = null
      commit(null)
    }, CLOSE_DELAY)
  }, [clearTimers, commit])

  const keepOpen = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
  }, [])

  // A pending timer that fires after unmount would set state on a dead tree.
  useEffect(() => clearTimers, [clearTimers])

  return {
    openId,
    intendOpen,
    intendClose,
    keepOpen,
    openNow,
    closeNow,
    toggleNow,
  }
}

export default useHoverIntent
