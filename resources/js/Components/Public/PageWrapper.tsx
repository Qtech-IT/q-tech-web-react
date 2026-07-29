import type { ReactNode } from 'react'
import { Head } from '@inertiajs/react'

import { cn } from '@/Utils/helpers'

export interface PageMeta {
  title?: string | undefined
  description?: string | undefined
  canonical?: string | undefined
  /** Absolute URL to the social share image. */
  image?: string | undefined
  /** `noindex` for previews, thank-you pages and paginated duplicates. */
  noindex?: boolean | undefined
  ogType?: string | undefined
  /** JSON-LD. Serialised into a script tag; pass an object, not a string. */
  schema?: Record<string, unknown> | Array<Record<string, unknown>> | undefined
}

export interface PageWrapperProps extends PageMeta {
  children: ReactNode
  className?: string | undefined
}

/**
 * Per-page `<head>` management and content wrapper.
 *
 * Meta tags live here rather than in each page so that every public page gets
 * a consistent, complete set — the Lighthouse SEO target is unreachable if
 * each page hand-rolls its own. Tags are only emitted when a value exists, so
 * a page with no CMS SEO record degrades to title-only instead of emitting
 * empty `content=""` attributes, which score worse than omitting them.
 *
 * The root layout renders the `<main>` landmark; this component deliberately
 * does not, to avoid nesting two of them.
 */
export function PageWrapper({
  children,
  title,
  description,
  canonical,
  image,
  noindex = false,
  ogType = 'website',
  schema,
  className,
}: PageWrapperProps) {
  const schemaBlocks = schema
    ? Array.isArray(schema)
      ? schema
      : [schema]
    : []

  return (
    <>
      {/* `title` is passed as a prop rather than rendered as a <title> child so
          it goes through the `title:` callback in app.tsx and picks up the
          " - {siteName}" suffix. A <title> child bypasses that callback. */}
      <Head {...(title ? { title } : {})}>
        {description ? <meta name="description" content={description} /> : null}
        {canonical ? <link rel="canonical" href={canonical} /> : null}
        {noindex ? <meta name="robots" content="noindex, nofollow" /> : null}

        {/* Open Graph */}
        <meta property="og:type" content={ogType} />
        {title ? <meta property="og:title" content={title} /> : null}
        {description ? (
          <meta property="og:description" content={description} />
        ) : null}
        {canonical ? <meta property="og:url" content={canonical} /> : null}
        {image ? <meta property="og:image" content={image} /> : null}

        {/* Twitter */}
        <meta
          name="twitter:card"
          content={image ? 'summary_large_image' : 'summary'}
        />
        {title ? <meta name="twitter:title" content={title} /> : null}
        {description ? (
          <meta name="twitter:description" content={description} />
        ) : null}
        {image ? <meta name="twitter:image" content={image} /> : null}

        {schemaBlocks.map((block, index) => (
          <script
            key={`schema-${index}`}
            type="application/ld+json"
            // Content is authored in the CMS, not user-submitted. Angle
            // brackets are escaped so a stray `</script>` cannot break out.
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(block).replace(/</g, '\\u003c'),
            }}
          />
        ))}
      </Head>

      <div className={cn(className)}>{children}</div>
    </>
  )
}

export default PageWrapper
