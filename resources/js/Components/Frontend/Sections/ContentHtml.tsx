import DOMPurify from 'dompurify'
import { useMemo } from 'react'

import { readOption } from '@/Components/Frontend/Sections/Shared/values'
import type { ContainerProps } from '@/Components/Public/Container'
import { Section } from '@/Components/Public/Section'
import { useTranslations } from '@/Hooks/useTranslations'
import type { SectionComponentProps } from '@/Types/sections'
import { scopeCss } from '@/Utils/scopeCss'

const WIDTHS = ['page', 'wide', 'prose', 'full'] as const
const THEMES = ['default', 'subtle', 'inverted'] as const
const SPACINGS = ['none', 'sm', 'default', 'lg'] as const
const STYLINGS = ['raw', 'site'] as const

/** `width` setting → `Container` size. `full` drops the container entirely. */
const CONTAINER_SIZES: Record<string, ContainerProps['size']> = {
  page: 'default',
  wide: 'wide',
  prose: 'narrow',
}

const SECTION_BACKGROUNDS = {
  default: 'default',
  subtle: 'subtle',
  inverted: 'inverted',
} as const

/**
 * Tags that execute, navigate, or embed something this site did not author.
 *
 * This is the ENTIRE list of what `content.html` removes, and every entry earns
 * its place by being an execution or exfiltration vector rather than a style
 * choice:
 *
 *   script, noscript   — runs code, on every visit, for every visitor
 *   iframe, frame, object, embed, applet — loads a third party into the page
 *                        with the visitor's session and the site's origin
 *   form, input, button, select, textarea, option — a login box that posts
 *                        somewhere else is indistinguishable from the real one
 *   base               — rewrites the resolution of every relative URL on the
 *                        page, including the nav's
 *   meta, link, title  — document-head directives (refresh redirects, external
 *                        stylesheets) smuggled into the body
 *
 * `style` is NOT here. It is kept, then scoped — see below.
 */
const FORBIDDEN_TAGS = [
  'script', 'noscript',
  'iframe', 'frame', 'frameset', 'object', 'embed', 'applet',
  'form', 'input', 'button', 'select', 'textarea', 'option',
  'base', 'meta', 'link', 'title',
]

/**
 * Attributes that run code or point somewhere the URI check cannot see.
 *
 * DOMPurify already drops every `on*` handler; these are the named exceptions
 * that survive an allowlist because they look like ordinary content
 * attributes. `srcdoc` is a whole document smuggled into an attribute value.
 */
const FORBIDDEN_ATTR = ['srcdoc', 'formaction', 'ping', 'http-equiv']

let hookRegistered = false

/**
 * Force `rel="noopener noreferrer"` onto anything opening a new tab.
 *
 * Same reasoning as `RichText`: permitting `target` and assuming the `rel`
 * comes with it is how `window.opener` gets handed to a page an editor pasted.
 * Registered once — hooks are global to the DOMPurify instance, so a second
 * registration would run it twice per node.
 */
function registerHook(): void {
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

registerHook()

/**
 * Raw HTML, rendered exactly as the editor wrote it.
 *
 * WHAT THIS BAND DOES NOT DO, WHICH IS THE POINT
 * ----------------------------------------------
 * It applies no typography, no measure, no link colour, no heading treatment —
 * none of the descendant styling `RichText` exists to apply. `class`, `id`,
 * `style` and `data-*` all survive. A `<style>` block survives. What goes in
 * comes out.
 *
 * `RichText` is the opposite band and both are correct: one renders a passage
 * of the site's own writing in the site's own voice, the other reproduces
 * something built elsewhere. Trying to make one component do both is what
 * produced markup that came back "modified" no matter what was pasted.
 *
 * THE STYLESHEET IS SCOPED, NOT DROPPED
 * -------------------------------------
 * Selectors inside a pasted `<style>` are rewritten to apply only within this
 * section's own id. Dropping the block would break the design; leaving it
 * global would let one pasted `.card {…}` restyle the whole site from a page
 * nobody thinks to look at. Scoping is the only option that keeps both the
 * design and the site.
 *
 * WHAT IS STILL REMOVED
 * ---------------------
 * Scripts, event handlers, embedded documents, form controls, and
 * `javascript:` URLs — see `FORBIDDEN_TAGS`. Not a style opinion: stored HTML
 * rendered on a public page is the textbook stored-XSS sink, an admin account
 * is authenticated rather than trusted, and a payload saved once executes for
 * every visitor until somebody notices.
 */
export function ContentHtml({ section }: SectionComponentProps) {
  const { t } = useTranslations()

  const settings = section.settings

  const width = readOption(settings, 'width', WIDTHS, 'page')
  const theme = readOption(settings, 'theme', THEMES, 'default')
  const spacing = readOption(settings, 'spacing', SPACINGS, 'default')
  const styling = readOption(settings, 'styling', STYLINGS, 'raw')

  /*
   * The scope selector, and the one thing on the wrapper.
   *
   * An attribute rather than a class: a class named after a uuid would look
   * like something Tailwind should have generated, and an editor searching the
   * stylesheet for it would find nothing.
   */
  const scopeId = `cms-html-${section.uuid}`

  const clean = useMemo(() => {
    const html = section.body

    if (!html || html.trim() === '') {
      return ''
    }

    /*
     * FAIL CLOSED where there is no DOM — identical reasoning to `RichText`.
     *
     * DOMPurify needs a `window` to parse into. Without one it sets
     * `isSupported = false` and `sanitize()` returns its input UNCHANGED, so
     * on the SSR path the sanitiser silently becomes a passthrough and every
     * stored payload is written verbatim into the server response.
     */
    if (!DOMPurify.isSupported) {
      return ''
    }

    registerHook()

    const sanitised = DOMPurify.sanitize(html, {
      /*
       * DOMPurify's own default allowlist, which is broad — `class`, `id`,
       * `style` and every structural tag included — minus the executable set
       * above. `RichText` narrows this aggressively and this band deliberately
       * does not: narrowing is what "modified my design" means.
       */
      ADD_TAGS: ['style'],
      FORBID_TAGS: FORBIDDEN_TAGS,
      FORBID_ATTR: FORBIDDEN_ATTR,
      ALLOW_DATA_ATTR: true,
      /*
       * Blocks `javascript:` in any URL-bearing attribute. `data:` is
       * permitted here, unlike in `RichText`, because a pasted design commonly
       * inlines its own small images and this band's whole contract is that
       * the paste arrives intact — and `data:text/html` cannot navigate from
       * an `href` in any current browser, while `<object>`/`<embed>`, which
       * could, are forbidden outright above.
       */
      ALLOWED_URI_REGEXP: /^(?:(?:https?|mailto|tel|data):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i,
    })

    /*
     * Scope the stylesheet.
     *
     * Done on the sanitised string with `DOMParser` rather than by regex: a
     * `<style>` block can contain almost anything, and finding its bounds with
     * a pattern is how a `</style>` inside a string literal ends the block
     * early. The document is detached and never appended, so nothing in it
     * loads or runs.
     */
    const parsed = new DOMParser().parseFromString(sanitised, 'text/html')

    for (const element of Array.from(parsed.querySelectorAll('style'))) {
      element.textContent = scopeCss(element.textContent ?? '', `#${scopeId}`)
    }

    return parsed.body.innerHTML
  }, [section.body, scopeId])

  if (clean === '') {
    return null
  }

  const contained = width !== 'full'

  return (
    <Section
      spacing={spacing}
      background={SECTION_BACKGROUNDS[theme]}
      contained={contained}
      {...(contained ? { containerSize: CONTAINER_SIZES[width] } : {})}
      {...(section.anchor ? { id: section.anchor } : {})}
      aria-label={t('Content')}
    >
      {/*
        `raw` (the default) puts NO className here — every utility would be a
        style this band promises not to apply, and an editor debugging their
        padding should find nothing of ours between the section and their
        markup.

        `site` adds `fx-prose` and nothing else: one token-driven rule per tag
        (`frontend.css`), scoped to `[data-site='public'] .fx-prose`, filling in
        the site's look for tags the paste did not style itself. A pasted
        `<style>` block — already scoped to `#${scopeId}` above — still wins
        wherever it sets a property, because an id selector outranks a class.
      */}
      <div
        id={scopeId}
        {...(styling === 'site' ? { className: 'fx-prose' } : {})}
        dangerouslySetInnerHTML={{ __html: clean }}
      />
    </Section>
  )
}

export default ContentHtml
