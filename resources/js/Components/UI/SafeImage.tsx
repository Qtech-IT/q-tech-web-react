import { useState } from 'react'
// `motion/react`, not `framer-motion`: one animation entry point across the
// codebase, per CLAUDE.md. Same package, current name.
import { motion, useReducedMotion } from 'motion/react'

import type { HTMLMotionProps } from 'motion/react'
import defaultImage from '@/Assets/images/placeholders/default.jpg'

interface SafeImageProps extends Omit<HTMLMotionProps<'img'>, 'src' | 'alt'> {
  src?: string
  alt?: string
  fallback?: string
  placeholder?: string
  className?: string
}

/**
 * An `<img>` that degrades to a placeholder instead of a broken-image icon.
 *
 * WHY THE STATE IS RESET DURING RENDER
 * ------------------------------------
 * This used to be `useState(src || placeholder)` alone. `useState`'s argument is
 * the initial value for the component's WHOLE LIFETIME — it is ignored on every
 * render after the first — so once mounted, this component pinned itself to
 * whatever `src` it first saw. Changing the prop did nothing.
 *
 * That is why replacing an image anywhere in the CMS appeared to do nothing: the
 * picker wrote the new value, the parent re-rendered with a new `src`, and this
 * component kept painting the old file. It looked like the picker was broken,
 * which sent the search to entirely the wrong place.
 *
 * The fix is React's documented "adjusting state when a prop changes" pattern:
 * compare the prop against the value we last rendered for and reset inline. This
 * is preferred over `useEffect` because it corrects the state BEFORE paint —
 * an effect would let one frame of the stale image through, which on a fast
 * replace reads as a flicker of the previous image.
 *
 * `isLoaded` resets with it, or the new file would inherit the old one's
 * finished fade and skip its own transition.
 */
export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'image',
  fallback = defaultImage,
  placeholder = defaultImage,
  className = '',
  ...props
}) => {
  const reduceMotion = useReducedMotion()

  const resolved = src || placeholder

  const [imgSrc, setImgSrc] = useState(resolved)
  const [renderedFor, setRenderedFor] = useState(resolved)
  const [isLoaded, setIsLoaded] = useState(false)

  // Not an effect: this runs during render, so the correct src is painted on
  // the very first frame after the prop changes.
  if (renderedFor !== resolved) {
    setRenderedFor(resolved)
    setImgSrc(resolved)
    setIsLoaded(false)
  }

  // `fallback`, not `placeholder`: a src that 404s is a different situation
  // from no src at all, and only this one has actually failed.
  const handleError = () => setImgSrc(fallback)
  const handleLoad = () => setIsLoaded(true)

  /*
   * `loading="lazy"` is a DEFAULT, not a rule: it sits before `{...props}` so a
   * caller can override it. `SectionMedia` passes `loading="eager"` for the
   * priority image, and lazy-loading the LCP element would cost the very metric
   * that flag exists to protect. Do not move the spread above these.
   */
  const shared = {
    src: imgSrc,
    alt,
    loading: 'lazy' as const,
    onLoad: handleLoad,
    onError: handleError,
    className: `object-cover transition-all duration-500 ease-in-out motion-reduce:transition-none ${className}`,
  }

  /*
   * Under `prefers-reduced-motion` this is a plain `<img>` with no motion
   * component at all — the same choice `Shared/Reveal` makes, and for the same
   * reasons: a motion component still writes inline `opacity` and still
   * promotes the node to its own compositor layer, so a zero-duration
   * animation is not the same thing as no animation.
   *
   * It matters more here than anywhere else because this component backs EVERY
   * image on the site, including the hero's LCP panel — an unconditional fade
   * meant a user who asked for stillness got one animation per image on the
   * page, and got it even when the editor had set the section's `animation` to
   * `none`.
   */
  if (reduceMotion) {
    /* The cast is structural, not a shortcut: `HTMLMotionProps` redeclares
       `onDrag`/`onDragStart`/`onDragEnd`/`onAnimationStart` with Motion's own
       two-argument signatures, so the two prop sets never overlap in TypeScript
       even though every attribute a caller actually passes here is a plain DOM
       one. No caller passes a Motion-only prop; if one ever does, this is the
       line that should be revisited rather than widened. */
    return (
      <img
        {...shared}
        {...(props as unknown as React.ImgHTMLAttributes<HTMLImageElement>)}
      />
    )
  }

  return (
    <motion.img
      initial={{ opacity: 0.3 }}
      animate={{ opacity: isLoaded ? 1 : 0.3 }}
      transition={{ duration: 0.4 }}
      {...shared}
      {...props}
    />
  )
}
