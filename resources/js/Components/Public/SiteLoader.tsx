import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

/**
 * Set once per browser session (a hard load, not an Inertia visit) and never
 * reset. `PublicLayout` mounts fresh on every page a visitor lands on
 * directly, and a splash that replays on every internal link click would
 * stop reading as a brand moment and start reading as a bug.
 */
let hasShownSiteLoader = false

/** How long the splash holds before it starts its exit fade. */
const HOLD_MS = 900

export interface SiteLoaderProps {
  /** `PublicLayout`'s already-resolved `settings.company_name`. */
  siteName?: string | undefined
}

/**
 * The site's own brief loading moment — a full-bleed splash naming the site,
 * shown once per browser session on first paint, never on a soft Inertia
 * navigation between pages.
 *
 * Renders nothing at all under `prefers-reduced-motion`: a full-screen
 * animated overlay is squarely the kind of effect that preference exists to
 * suppress, and skipping it here means skipping it, not playing a
 * zero-duration version of it.
 *
 * Survives a missing site name: with nothing to letter-stagger, it falls
 * back to the accent mark alone rather than inventing brand text.
 */
export function SiteLoader({ siteName }: SiteLoaderProps) {
  const reduceMotion = useReducedMotion()
  const [visible, setVisible] = useState(() => !hasShownSiteLoader && !reduceMotion)

  useEffect(() => {
    if (!visible) {
      return
    }

    hasShownSiteLoader = true
    const timer = window.setTimeout(() => setVisible(false), HOLD_MS)

    return () => window.clearTimeout(timer)
  }, [visible])

  const name = siteName?.trim()
  const letters = name ? [...name] : []

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          role="presentation"
          aria-hidden="true"
          className="fixed inset-0 z-[100] flex items-center justify-center fx-mesh-canvas"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div
            className="flex flex-col items-center gap-4"
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.span
              className="size-2.5 rounded-full bg-fx-accent"
              animate={{ scale: [1, 1.6, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 1.1, repeat: Infinity, ease: 'easeInOut' }}
            />

            {letters.length > 0 ? (
              <p className="flex text-fx-label font-semibold tracking-[0.24em] text-fx-ink uppercase">
                {letters.map((letter, position) =>
                  // A literal space character inside its own inline element
                  // is exactly the kind of whitespace a browser is free to
                  // collapse. A fixed-width blank box renders the gap
                  // reliably instead of hoping the string survives intact.
                  letter === ' ' ? (
                    <span key={position} aria-hidden="true" className="inline-block w-2" />
                  ) : (
                    <motion.span
                      // Index is the only stable key a character stream has —
                      // the string itself is not unique per letter.
                      key={position}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: 0.15 + position * 0.03,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {letter}
                    </motion.span>
                  )
                )}
              </p>
            ) : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

export default SiteLoader
