import { useMemo } from 'react'
import DOMPurify from 'dompurify'

import { cn } from '@/Utils/helpers'

export interface RichTextProps {
  /** A `html_text` field — `section.body` and friends. */
  html: string | null | undefined
  className?: string | undefined
}

/**
 * Sanitised rich text from a CMS `html_text` field.
 *
 * Sanitising on render rather than trusting the editor is deliberate: the admin
 * is authenticated but not necessarily trustworthy, an editor account can be
 * compromised, and a stored payload would execute on every public visit. The
 * `@tailwindcss/typography` plugin is installed but not registered in
 * `app.css`, so element styling is done with descendant selectors here rather
 * than with a `prose` class that would silently do nothing.
 */
export function RichText({ html, className }: RichTextProps) {
  const clean = useMemo(() => {
    if (!html || html.trim() === '') {
      return ''
    }

    return DOMPurify.sanitize(html, { USE_PROFILES: { html: true } })
  }, [html])

  if (clean === '') {
    return null
  }

  return (
    <div
      className={cn(
        'text-fx-body text-fx-ink-soft',
        '[&_p]:mt-fx-stack-sm [&_p:first-child]:mt-0',
        '[&_strong]:font-semibold [&_strong]:text-fx-ink',
        '[&_a]:font-medium [&_a]:text-fx-accent-text [&_a]:underline [&_a]:decoration-fx-accent-line [&_a]:underline-offset-4 [&_a:hover]:decoration-current',
        '[&_ul]:mt-fx-stack-sm [&_ul]:list-disc [&_ul]:pl-5',
        '[&_ol]:mt-fx-stack-sm [&_ol]:list-decimal [&_ol]:pl-5',
        '[&_li]:mt-1 [&_li]:marker:text-fx-ink-faint',
        className
      )}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}

export default RichText
