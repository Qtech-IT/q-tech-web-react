import { useMemo } from 'react'
import { useReducedMotion } from 'motion/react'

import { SafeImage } from '@/Components/UI/SafeImage'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import { clamp } from '@/Components/Frontend/Sections/Shared/values'
import type { CmsMedia } from '@/Types/cms'

export interface SectionMediaProps {
  media: CmsMedia | null | undefined
  /**
   * `settings.overlay_opacity`, 0–100.
   *
   * The scrim is drawn in `--background`, not black: a black veil is only
   * correct in light mode, and would push a dark-mode hero towards *less*
   * contrast rather than more. Veiling towards the page background means the
   * same value reads correctly in both themes and text keeps using the normal
   * foreground tokens.
   */
  overlayOpacity?: number | undefined
  /**
   * Above the fold. Switches the image to eager loading and high fetch
   * priority — a lazily loaded hero image is a guaranteed LCP regression.
   */
  priority?: boolean | undefined
  /** Absolutely fill the nearest positioned ancestor, for full-bleed layouts. */
  fill?: boolean | undefined
  /** CSS `aspect-ratio` used only when the asset carries no dimensions. */
  fallbackRatio?: string | undefined
  className?: string | undefined
  /** Extra classes for the `<img>` / `<video>` itself. */
  mediaClassName?: string | undefined
}

/** Poster frames have no dedicated field yet, so a conversion is used if present. */
function posterFrom(media: CmsMedia): string | undefined {
  const conversions = media.conversions

  if (!conversions) {
    return undefined
  }

  for (const key of ['poster', 'preview', 'thumb', 'thumbnail']) {
    const candidate = conversions[key]

    if (typeof candidate === 'string' && candidate.trim() !== '') {
      return candidate
    }
  }

  return undefined
}

/**
 * One CMS media asset — image or video — with its box reserved.
 *
 * `media_type` decides the element; nothing here sniffs the file extension,
 * because the server already classified the upload and a URL can lie.
 *
 * The wrapper always carries an explicit `aspect-ratio` derived from
 * `width`/`height`, so the space is reserved before the asset arrives. That is
 * the whole reason those two fields are on `CmsMedia`.
 */
export function SectionMedia({
  media,
  overlayOpacity = 0,
  priority = false,
  fill = false,
  fallbackRatio = '4 / 3',
  className,
  mediaClassName,
}: SectionMediaProps) {
  const { t } = useTranslations()
  const reduceMotion = useReducedMotion()

  const ratio = useMemo(() => {
    if (media?.width && media.height && media.width > 0 && media.height > 0) {
      return `${media.width} / ${media.height}`
    }

    return fallbackRatio
  }, [fallbackRatio, media?.height, media?.width])

  // Not an error: a section is allowed to be published before its artwork is
  // chosen. The caller decides what to compose in its place.
  if (!media?.url) {
    return null
  }

  const scrim = clamp(overlayOpacity, 0, 100) / 100
  const alt = media.alt_text?.trim() || media.title?.trim() || ''
  const isVideo = media.media_type === 'video'
  const poster = posterFrom(media)

  return (
    <div
      className={cn(
        'relative overflow-hidden bg-muted',
        fill ? 'absolute inset-0' : 'w-full',
        className
      )}
      {...(fill ? {} : { style: { aspectRatio: ratio } })}
    >
      {isVideo ? (
        <video
          className={cn('size-full object-cover', mediaClassName)}
          src={media.url}
          // Autoplay is a motion effect. Under `prefers-reduced-motion` the
          // video becomes a poster frame with controls, so the content is still
          // reachable — it just does not move until asked.
          autoPlay={!reduceMotion}
          muted
          loop
          playsInline
          controls={Boolean(reduceMotion)}
          preload={reduceMotion ? 'metadata' : 'auto'}
          {...(poster ? { poster } : {})}
          {...(alt
            ? { 'aria-label': alt }
            : { 'aria-hidden': true, tabIndex: -1 })}
        >
          {/* Last resort for a browser that cannot play the source at all. */}
          {poster ? (
            <img src={poster} alt={alt || t('Video preview')} />
          ) : null}
        </video>
      ) : (
        <SafeImage
          src={media.url}
          alt={alt}
          {...(media.width ? { width: media.width } : {})}
          {...(media.height ? { height: media.height } : {})}
          loading={priority ? 'eager' : 'lazy'}
          decoding={priority ? 'sync' : 'async'}
          fetchPriority={priority ? 'high' : 'auto'}
          className={cn('size-full', mediaClassName)}
        />
      )}

      {scrim > 0 ? (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-background"
          style={{ opacity: scrim }}
        />
      ) : null}
    </div>
  )
}

export default SectionMedia
