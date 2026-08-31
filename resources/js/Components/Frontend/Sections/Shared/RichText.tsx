import { useMemo } from 'react'
import DOMPurify from 'dompurify'

import { cn } from '@/Utils/helpers'

export interface RichTextProps {
  /** A `html_text` field — `section.body` and friends. */
  html: string | null | undefined
  className?: string | undefined
}

/**
 * Tags an editor may use.
 *
 * An explicit allowlist rather than DOMPurify's `USE_PROFILES: { html: true }`.
 * That profile is broad by design — it permits form controls, `<style>`,
 * `<iframe>` in some configurations, and a long tail of elements this site has
 * no styling for. Anything not listed here is stripped to its text content, so
 * a paste from Word or Google Docs degrades to clean copy instead of arriving
 * with a `<style>` block and forty `<span class="c17">`s.
 *
 * Deliberately absent: `<h1>` (the page owns exactly one, and it is the
 * section's), `<img>` (a picture belongs in a media field with an alt text, a
 * reserved box and a CDN URL — not pasted as a hotlink), `<iframe>`, `<script>`
 * and every form element.
 */
const ALLOWED_TAGS = [
  'p', 'br', 'hr',
  'strong', 'b', 'em', 'i', 'u', 's', 'mark', 'sup', 'sub', 'small',
  'a',
  'ul', 'ol', 'li',
  'h2', 'h3', 'h4', 'h5', 'h6',
  'blockquote', 'q', 'cite',
  'code', 'pre', 'kbd', 'samp',
  'table', 'thead', 'tbody', 'tfoot', 'tr', 'th', 'td', 'caption',
  'figure', 'figcaption',
  'span', 'div',
]

/**
 * Attributes an editor may set.
 *
 * No `style`, no `class`, no `id`, and no `on*` — the styling below owns
 * appearance, and an editor-supplied `id` can collide with a heading anchor the
 * page generates. `target` is permitted because a link out to a partner site
 * legitimately wants it; the `rel` that must accompany it is forced below
 * rather than trusted to the editor.
 */
const ALLOWED_ATTR = ['href', 'title', 'target', 'rel', 'colspan', 'rowspan', 'scope', 'lang', 'dir']

/**
 * Force `rel="noopener noreferrer"` onto any link opening in a new tab.
 *
 * DOMPurify does NOT do this on its own — permitting `target` and assuming the
 * `rel` comes with it is how `window.opener` gets handed to a page an editor
 * pasted in. The hook runs after attribute sanitising, so it sees the final
 * `target` and cannot be bypassed by ordering the attributes differently.
 *
 * Registered once at module load, guarded twice: hooks are global to the
 * DOMPurify instance, so a second registration would run it twice per node, and
 * `isSupported` is false in any environment without a DOM (see below).
 */
let hookRegistered = false

function registerTargetHook(): void {
  if (hookRegistered || !DOMPurify.isSupported) {
    return
  }

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node instanceof Element && node.tagName === 'A' && node.hasAttribute('target')) {
      node.setAttribute('rel', 'noopener noreferrer')
    }
  })

  hookRegistered = true
}

registerTargetHook()

/**
 * Sanitised rich text from a CMS `html_text` field.
 *
 * SANITISING ON RENDER, NOT ON SAVE, is the deliberate choice. The admin is
 * authenticated but not therefore trusted: an editor account can be
 * compromised, and a payload stored before a sanitiser was tightened would
 * still be in the database afterwards. Cleaning at the point of use means the
 * current rules apply to every row, including the ones written last year.
 *
 * This is the ACTUAL XSS control for CMS HTML. The `sanitization` middleware is
 * a regex blacklist that strips `<script>` and `on*="..."` — it does not stop
 * `<img src=x onerror=...>` written with single quotes, `javascript:` URLs, or
 * SVG event handlers, and it must not be mistaken for this.
 *
 * Element styling is done with descendant selectors rather than a `prose`
 * class: `@tailwindcss/typography` is installed but is NOT registered in
 * `app.css`, so a `prose` class here would silently do nothing.
 */
export function RichText({ html, className }: RichTextProps) {
  const clean = useMemo(() => {
    if (!html || html.trim() === '') {
      return ''
    }

    /*
     * FAIL CLOSED where there is no DOM.
     *
     * DOMPurify needs a `window` to parse into. Without one it sets
     * `isSupported = false` and `sanitize()` returns its input UNCHANGED — so
     * on the SSR path (`resources/js/ssr.tsx`) the sanitiser would silently
     * become a passthrough and every stored payload would be rendered verbatim
     * into the server response. Returning nothing loses the passage on a server
     * render; returning it raw loses the site.
     */
    if (!DOMPurify.isSupported) {
      return ''
    }

    registerTargetHook()

    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS,
      ALLOWED_ATTR,
      /*
       * Blocks `javascript:` and `data:` hrefs — the one hole a tag allowlist
       * does not close, since `<a>` is legitimately allowed.
       *
       * Mirrors DOMPurify's own default structure: an explicit set of safe
       * schemes, OR a value starting with a non-letter (`/path`, `#anchor`), OR
       * a token not followed by a colon (`page.html`). `javascript:alert(1)`
       * matches the third branch up to the colon and then fails it, which is
       * exactly the intent.
       *
       * Read on its own this looks too permissive — `"  javascript:..."` passes
       * it, because the leading space matches the "starts with a non-letter"
       * branch. That is not a hole: DOMPurify strips whitespace and control
       * characters from an attribute value BEFORE testing it against this, so
       * the padded form never reaches here. Tightening the regex to reject it
       * would break legitimate relative hrefs instead.
       */
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    })
  }, [html])

  if (clean === '') {
    return null
  }

  return (
    <div
      className={cn(
        'text-fx-body text-pretty text-fx-ink-soft',

        // Paragraphs and rules.
        '[&_p]:mt-fx-stack-sm [&_p:first-child]:mt-0',
        '[&_hr]:my-fx-stack-md [&_hr]:border-fx-line',

        /*
         * Sub-headings.
         *
         * The section already owns its own `h2` (or the page's `h1`), so the
         * editor's structure starts at `h3` VISUALLY whatever tag they typed:
         * `h2` and `h3` are painted the same size deliberately, so a passage
         * whose author reached for the wrong one does not out-shout the band's
         * real headline. The outline stays whatever they wrote; only the size
         * is normalised.
         */
        '[&_h2]:mt-fx-stack-lg [&_h2]:text-fx-subheading [&_h2]:font-semibold [&_h2]:text-fx-ink',
        '[&_h3]:mt-fx-stack-lg [&_h3]:text-fx-subheading [&_h3]:font-semibold [&_h3]:text-fx-ink',
        '[&_h4]:mt-fx-stack-md [&_h4]:text-fx-body [&_h4]:font-semibold [&_h4]:text-fx-ink',
        '[&_h5]:mt-fx-stack-md [&_h5]:text-fx-body [&_h5]:font-semibold [&_h5]:text-fx-ink',
        '[&_h6]:mt-fx-stack-md [&_h6]:text-fx-body [&_h6]:font-semibold [&_h6]:text-fx-ink',
        '[&_h2:first-child]:mt-0 [&_h3:first-child]:mt-0 [&_h4:first-child]:mt-0',

        // Inline.
        '[&_strong]:font-semibold [&_strong]:text-fx-ink [&_b]:font-semibold [&_b]:text-fx-ink',
        '[&_em]:italic [&_mark]:bg-fx-wash-accent [&_mark]:text-fx-ink [&_mark]:px-1 [&_mark]:rounded-fx-xs',
        '[&_a]:font-medium [&_a]:text-fx-accent-text [&_a]:underline [&_a]:decoration-fx-accent-line [&_a]:underline-offset-4 [&_a:hover]:decoration-current',
        '[&_a]:rounded-fx-xs [&_a:focus-visible]:outline-2 [&_a:focus-visible]:outline-offset-2 [&_a:focus-visible]:outline-fx-focus',

        // Lists.
        '[&_ul]:mt-fx-stack-sm [&_ul]:list-disc [&_ul]:ps-5',
        '[&_ol]:mt-fx-stack-sm [&_ol]:list-decimal [&_ol]:ps-5',
        '[&_li]:mt-1 [&_li]:marker:text-fx-ink-faint',
        // A nested list already sits inside a spaced `li`; a second top margin
        // on it opens a gap that reads as a missing item.
        '[&_li_ul]:mt-1 [&_li_ol]:mt-1',

        // Quotes.
        '[&_blockquote]:mt-fx-stack-md [&_blockquote]:border-s-2 [&_blockquote]:border-fx-accent-line',
        '[&_blockquote]:ps-4 [&_blockquote]:text-fx-lead [&_blockquote]:text-fx-ink',
        '[&_cite]:text-fx-meta [&_cite]:not-italic [&_cite]:text-fx-ink-faint',

        // Code.
        '[&_code]:rounded-fx-xs [&_code]:bg-fx-surface-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-fx-meta',
        '[&_pre]:mt-fx-stack-sm [&_pre]:overflow-x-auto [&_pre]:rounded-fx-md [&_pre]:border [&_pre]:border-fx-line',
        '[&_pre]:bg-fx-surface-2 [&_pre]:p-4 [&_pre]:text-fx-meta',
        '[&_pre_code]:bg-transparent [&_pre_code]:p-0',

        /*
         * Tables.
         *
         * `display: block` + `overflow-x: auto` makes the table its OWN scroll
         * container, which is what stops a wide one pushing the entire page
         * into a horizontal scroll on a phone.
         *
         * The obvious alternative — wrapping each `<table>` in a scrolling div
         * — needs a DOM pass over the sanitised string, and this component also
         * runs through `resources/js/ssr.tsx`, where there is no `DOMParser`.
         * A CSS-only answer works identically in both environments, which a
         * `typeof window` branch would not.
         */
        '[&_table]:block [&_table]:max-w-full [&_table]:overflow-x-auto',
        '[&_table]:mt-fx-stack-sm [&_table]:border-collapse [&_table]:text-fx-body-sm',
        '[&_th]:border-b [&_th]:border-fx-line [&_th]:py-2 [&_th]:pe-4 [&_th]:text-start [&_th]:font-semibold [&_th]:text-fx-ink',
        '[&_td]:border-b [&_td]:border-fx-line [&_td]:py-2 [&_td]:pe-4 [&_td]:align-top',
        '[&_caption]:mb-2 [&_caption]:text-fx-meta [&_caption]:text-fx-ink-faint',

        // Figures.
        '[&_figure]:mt-fx-stack-md',
        '[&_figcaption]:mt-2 [&_figcaption]:text-fx-meta [&_figcaption]:text-fx-ink-faint',

        className
      )}
      dangerouslySetInnerHTML={{ __html: clean }}
    />
  )
}

export default RichText
