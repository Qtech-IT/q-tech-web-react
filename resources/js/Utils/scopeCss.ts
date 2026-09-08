/**
 * At-rules whose body is a list of ordinary rules, and therefore needs
 * scoping one level down.
 *
 * `@keyframes` is deliberately NOT here: its body is keyed by percentages and
 * `from`/`to`, which are not selectors — prefixing them produces a stylesheet
 * the browser discards silently, taking the animation with it. `@font-face`,
 * `@import` and `@charset` are the same story for the same reason.
 */
const NESTED_AT_RULES = new Set(['media', 'supports', 'container', 'layer'])

/**
 * Selectors that mean "the page", which inside a scoped block must mean "this
 * section" instead.
 *
 * A pasted design routinely opens with `body { font-family: … }`. Left alone
 * that either does nothing (because the rule is now `#scope body`, and there is
 * no `body` inside the section) or, worse, escapes and restyles the site.
 */
const ROOT_SELECTORS = new Set([':root', 'html', 'body', ':host'])

/**
 * Split a selector list on its TOP-LEVEL commas.
 *
 * `:is(a, b)` and `[title="x, y"]` both contain commas that are not
 * separators, and splitting on all of them produces two broken selectors out
 * of one working one.
 */
function splitSelectorList(selectors: string): string[] {
  const parts: string[] = []
  let depth = 0
  let quote: string | null = null
  let current = ''

  for (const character of selectors) {
    if (quote !== null) {
      current += character

      if (character === quote) {
        quote = null
      }

      continue
    }

    if (character === '"' || character === "'") {
      quote = character
      current += character

      continue
    }

    if (character === '(' || character === '[') {
      depth += 1
    } else if (character === ')' || character === ']') {
      depth -= 1
    }

    if (character === ',' && depth === 0) {
      parts.push(current)
      current = ''

      continue
    }

    current += character
  }

  parts.push(current)

  return parts.map((part) => part.trim()).filter((part) => part !== '')
}

function prefixSelectorList(selectors: string, scope: string): string {
  return splitSelectorList(selectors)
    .map((selector) => (ROOT_SELECTORS.has(selector) ? scope : `${scope} ${selector}`))
    .join(', ')
}

/**
 * Rewrite a stylesheet so every rule in it applies only inside `scope`.
 *
 * WHY THIS IS NEEDED
 * ------------------
 * `content.html` lets an editor paste a design together with the `<style>`
 * block that makes it work. A stylesheet is global by nature: one pasted
 * `.card { border: none }` would silently restyle every card on the site, and
 * the person who pasted it would have no way to connect the two. Prefixing
 * every selector with the section's own id turns a global stylesheet into a
 * local one without the editor having to understand any of this.
 *
 * WHY A HAND-WRITTEN SCANNER
 * --------------------------
 * The browser's own parser (`CSSStyleSheet.cssRules`) would be exact, but this
 * function also runs through `resources/js/ssr.tsx`, where there is no DOM at
 * all — and a section whose styling appears only after hydration is a section
 * that flashes unstyled on every first paint and renders unstyled to a crawler.
 * One code path that works in both environments is worth more here than a
 * perfect parse in one of them.
 *
 * KNOWN LIMIT: a brace inside a string literal — `content: "}"` — ends a block
 * early, because the scanner tracks quotes only within selector lists, not
 * within declaration bodies. Declaration bodies are copied through untouched,
 * so the failure is a mis-split rule rather than a security hole, and the
 * construct is vanishingly rare in the design markup this field exists for.
 */
export function scopeCss(css: string, scope: string): string {
  let output = ''
  let index = 0

  while (index < css.length) {
    const open = css.indexOf('{', index)

    if (open === -1) {
      // Trailing junk after the last rule. Kept rather than dropped so a
      // truncated paste looks broken in the way the editor pasted it.
      output += css.slice(index)

      break
    }

    const prelude = css.slice(index, open).trim()

    let depth = 1
    let cursor = open + 1

    while (cursor < css.length && depth > 0) {
      if (css[cursor] === '{') {
        depth += 1
      } else if (css[cursor] === '}') {
        depth -= 1
      }

      cursor += 1
    }

    const body = css.slice(open + 1, cursor - 1)

    if (prelude.startsWith('@')) {
      const name = prelude.slice(1).split(/[\s({]/)[0]?.toLowerCase() ?? ''

      output += NESTED_AT_RULES.has(name)
        ? `${prelude}{${scopeCss(body, scope)}}`
        : `${prelude}{${body}}`
    } else if (prelude === '') {
      output += `{${body}}`
    } else {
      output += `${prefixSelectorList(prelude, scope)}{${body}}`
    }

    index = cursor
  }

  return output
}

export default scopeCss
