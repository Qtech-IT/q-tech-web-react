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
 * section's), `<iframe>`, `<script>`, `<style>` and every form element.
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
  /*
   * `img` is permitted now that the editor can hold one.
   *
   * It was excluded on the grounds that a picture belongs in a media field
   * rather than pasted as a hotlink — which was right while the rich-text
   * field was a raw textarea, and became wrong the moment the editor could
   * accept a pasted image. Stripping it here would have let an editor insert a
   * picture, save it successfully, and never see it on the page.
   *
   * Two things make it safe. `RichTextService` absorbs `data:` images into the
   * media library on save, so what reaches here is a real URL; and the URI
   * allowlist below rejects `data:` and `javascript:` in any attribute, so even
   * an unabsorbed one is dropped rather than rendered.
   */
  'img',
]

/**
 * Attributes an editor may set.
 *
 * No `class`, no `id`, and no `on*`. A class is deliberate: markup copied from
 * another site carries THAT site's class names, and its stylesheet is not
 * loaded here — so the classes would style nothing while colliding with ours.
 * An editor-supplied `id` can collide with a heading anchor the page generates. `target` is permitted because a link out to a partner site
 * legitimately wants it; the `rel` that must accompany it is forced below
 * rather than trusted to the editor.
 */
const ALLOWED_ATTR = [
  'href', 'title', 'target', 'rel',
  /*
   * `style` is permitted, and then filtered PROPERTY BY PROPERTY by the hook
   * below.
   *
   * It was excluded because arbitrary inline styling fights the design system,
   * which is still true of type scales and colours an editor did not choose.
   * But excluding it outright meant a passage pasted with its layout inline —
   * the common case for anything exported from a design tool, a document or an
   * email — arrived stripped to a stack of paragraphs, which is the "it does
   * not look like what I copied" complaint. The allowlist below keeps layout
   * and lets nothing through that can move content out of the flow.
   */
  'style',
  'colspan', 'rowspan', 'scope',
  'lang', 'dir',
  /*
   * The editor's column construct. DOMPurify permits `data-*` by default, so
   * these are listed for the reader rather than for the sanitiser — and so
   * that turning `ALLOW_DATA_ATTR` off later does not silently flatten every
   * two-column passage on the site back into a stack.
   */
  'data-cols', 'data-col',
  // Dimensions travel with the tag so the browser reserves the box before the
  // file arrives — the same reason `CmsMedia` carries width and height.
  'src', 'alt', 'width', 'height', 'loading',
]

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

/**
 * CSS properties an editor's markup may keep.
 *
 * Layout, spacing, colour and type — the things that make a pasted block look
 * like what was copied. Everything absent is absent on purpose:
 *
 *   position, z-index, top/left/…  — can lift content out of the flow and
 *                                    cover the page, including the nav
 *   transform, filter, clip-path   — same, by another route
 *   content, cursor, pointer-events — can fake UI the visitor then trusts
 *   font-family                    — the one property that most reliably makes
 *                                    a passage look foreign to the site
 *
 * The check is exact-match, not prefix-match: `border` and `border-radius` are
 * both listed rather than matching `border*`, because a prefix rule quietly
 * admits whatever the CSS working group adds next.
 */
const ALLOWED_CSS = new Set([
  // Box.
  'display', 'gap', 'row-gap', 'column-gap',
  'grid-template-columns', 'grid-template-rows', 'grid-column', 'grid-row',
  'flex', 'flex-direction', 'flex-wrap', 'flex-basis', 'flex-grow', 'flex-shrink',
  'align-items', 'align-self', 'justify-content', 'justify-items', 'justify-self',
  'width', 'max-width', 'min-width', 'height', 'max-height', 'min-height',
  'aspect-ratio', 'object-fit', 'object-position', 'overflow', 'overflow-x', 'overflow-y',
  'margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left',
  'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left',
  'float', 'clear',
  // Paint.
  'color', 'background', 'background-color', 'background-image',
  'background-size', 'background-position', 'background-repeat',
  'border', 'border-top', 'border-right', 'border-bottom', 'border-left',
  'border-color', 'border-style', 'border-width', 'border-radius',
  'box-shadow', 'opacity',
  // Type.
  'font-size', 'font-weight', 'font-style', 'font-variant',
  'line-height', 'letter-spacing', 'word-spacing', 'white-space',
  'text-align', 'text-decoration', 'text-transform', 'text-indent',
  'vertical-align', 'list-style', 'list-style-type', 'list-style-position',
])

/**
 * Strip everything not on `ALLOWED_CSS` from an element's inline style.
 *
 * Reading `node.style` rather than parsing the attribute string is what makes
 * this safe with no CSS parser of our own: the browser has already parsed the
 * declaration, discarded anything malformed, and normalised the rest, so what
 * is enumerated here is exactly what would have applied. A property removed
 * from the declaration cannot come back.
 *
 * Setting the attribute back from `cssText` — rather than leaving the live
 * declaration alone — matters because DOMPurify serialises the node afterwards
 * and reads the attribute, not the object.
 */
function filterInlineStyle(node: Element): void {
  const style = (node as HTMLElement).style

  if (!style || style.length === 0) {
    return
  }

  // Snapshotted: removing a property mutates the live list being iterated.
  const properties = Array.from(style)

  for (const property of properties) {
    if (!ALLOWED_CSS.has(property)) {
      style.removeProperty(property)
    }
  }

  if (style.length === 0) {
    node.removeAttribute('style')

    return
  }

  node.setAttribute('style', style.cssText)
}

function registerTargetHook(): void {
  if (hookRegistered || !DOMPurify.isSupported) {
    return
  }

  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (!(node instanceof Element)) {
      return
    }

    if (node.tagName === 'A' && node.hasAttribute('target')) {
      node.setAttribute('rel', 'noopener noreferrer')
    }

    if (node.hasAttribute('style')) {
      filterInlineStyle(node)
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
     * DEMOTE `h1` RATHER THAN STRIP IT.
     *
     * `h1` is not in the allowlist because the page owns exactly one and it is
     * the section's. But DOMPurify strips a disallowed TAG and keeps its TEXT,
     * so an editor who typed a headline in the rich text field got their
     * headline rendered as a bare paragraph — same size, same colour as the
     * body copy, the whole hierarchy of the passage silently flattened. That is
     * how an authored article ends up looking unstyled.
     *
     * Rewriting the tag before sanitising keeps the outline (one visible
     * heading, styled as one) without ever emitting a second `h1`. Done as a
     * string pass rather than a DOM hook because this component also runs
     * through `resources/js/ssr.tsx`, where there is no `DOMParser`.
     */
    const source = html.replace(/<(\/?)h1(\s|>)/gi, '<$1h2$2')

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

    return DOMPurify.sanitize(source, {
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
        // `fx-richtext` is the hook for the column rules in `frontend.css`.
        // They live there rather than as arbitrary variants here because the
        // selector has to match an attribute VALUE, which Tailwind's variant
        // syntax expresses badly and Tailwind's scanner cannot see through.
        'fx-richtext',
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
        // Two links pasted back-to-back arrive with no whitespace between them
        // and render as one run-on word ("Get a QuoteBook a Consultation").
        // Editors write them as separate links; they must read as separate.
        '[&_a+a]:ms-4',

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

        // Images. Constrained to the measure and never allowed to overflow it,
        // whatever dimensions the source had.
        '[&_img]:my-fx-stack-sm [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-fx-md',

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
