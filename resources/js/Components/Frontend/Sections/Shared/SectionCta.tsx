import { Link } from '@inertiajs/react'

import { NavIcon, isRegisteredNavIcon } from '@/Components/Public/NavIcon'
import { Button } from '@/Components/UI/Button'
import { cn } from '@/Utils/helpers'
import type { CmsCta } from '@/Types/cms'

/**
 * `cta.variant` is a free-form string column, so it is mapped through a
 * whitelist rather than passed to `Button` directly. An editor typing
 * "primary" gets the default button instead of an unstyled one.
 */
const BUTTON_VARIANTS = [
  'default',
  'destructive',
  'outline',
  'secondary',
  'ghost',
  'link',
] as const

const BUTTON_SIZES = ['default', 'sm', 'lg'] as const

type ButtonVariant = (typeof BUTTON_VARIANTS)[number]
type ButtonSize = (typeof BUTTON_SIZES)[number]

/** Common aliases an editor may have stored before the select was locked down. */
const VARIANT_ALIASES: Record<string, ButtonVariant> = {
  primary: 'default',
  solid: 'default',
  accent: 'default',
  text: 'link',
  tertiary: 'ghost',
}

function resolveVariant(raw: string | null | undefined): ButtonVariant | undefined {
  if (!raw) {
    return undefined
  }

  const value = raw.trim().toLowerCase()

  if ((BUTTON_VARIANTS as readonly string[]).includes(value)) {
    return value as ButtonVariant
  }

  return VARIANT_ALIASES[value]
}

function resolveSize(raw: string | null | undefined): ButtonSize | undefined {
  if (!raw) {
    return undefined
  }

  const value = raw.trim().toLowerCase()

  return (BUTTON_SIZES as readonly string[]).includes(value)
    ? (value as ButtonSize)
    : undefined
}

export interface SectionCtaProps {
  cta: CmsCta | null | undefined
  /** Fallback when the CTA carries no usable variant of its own. */
  fallbackVariant?: ButtonVariant | undefined
  /**
   * Forced size. Sections use this where the CMS value would break the
   * composition — a hero's buttons are `lg` regardless of what is stored.
   */
  size?: ButtonSize | undefined
  /**
   * Skin applied to `Button` itself — this is where `fxButton()` goes.
   *
   * Deliberately separate from `className`: that one lands on the inner
   * `<a>`/`<Link>` where Radix's `Slot` merges class strings by concatenation,
   * so two colour utilities would both survive and the winner would be decided
   * by stylesheet order. Routed through `Button`'s own prop, the classes go
   * through `cn()` and tailwind-merge drops the losing utility outright.
   */
  buttonClassName?: string | undefined
  /**
   * Suppress the CTA's own icon.
   *
   * For surfaces that draw their own trailing glyph — `hero.centered` insets a
   * decorative arrow badge into its pill — where an editor-set icon would
   * render a second arrow beside the first. The alternative is asking editors
   * to remember not to set one, which they will not, and which would make the
   * same CTA row render wrongly if it were reused on another section.
   */
  hideIcon?: boolean | undefined
  className?: string | undefined
}

/**
 * One CMS call to action, or nothing.
 *
 * `href` is resolved server-side by `CtaService::resolveHref()` and is never
 * re-derived here — a client that rebuilds route URLs will drift from the
 * server the first time a route signature changes.
 *
 * Renders `null` when the CTA is absent, unlabelled, or has no destination.
 * A button that looks clickable and goes nowhere is worse than no button, and
 * `cta.band` is allowed to be saved before its target page exists.
 */
export function SectionCta({
  cta,
  fallbackVariant = 'default',
  size,
  buttonClassName,
  hideIcon = false,
  className,
}: SectionCtaProps) {
  const label = cta?.label?.trim()
  const href = cta?.href?.trim() || cta?.url?.trim() || ''

  if (!cta || !label || href === '') {
    return null
  }

  const variant = resolveVariant(cta.variant) ?? fallbackVariant
  const resolvedSize = size ?? resolveSize(cta.size) ?? 'default'

  const icon =
    !hideIcon && cta.icon && isRegisteredNavIcon(cta.icon) ? (
      <NavIcon name={cta.icon} />
    ) : null
  const iconOnRight = cta.icon_position !== 'left'

  const external =
    cta.opens_in_new_tab ||
    cta.is_download ||
    /^(?:https?:)?\/\//i.test(href) ||
    /^(?:mailto|tel):/i.test(href)

  const body = (
    <>
      {icon && !iconOnRight ? icon : null}
      <span>{label}</span>
      {icon && iconOnRight ? icon : null}
    </>
  )

  const shared = {
    className: cn(className),
    ...(cta.aria_label ? { 'aria-label': cta.aria_label } : {}),
    ...(cta.tracking_id ? { 'data-tracking-id': cta.tracking_id } : {}),
  }

  return (
    <Button
      asChild
      variant={variant}
      size={resolvedSize}
      {...(buttonClassName ? { className: buttonClassName } : {})}
    >
      {external ? (
        <a
          href={href}
          {...shared}
          {...(cta.opens_in_new_tab ? { target: '_blank' } : {})}
          // `noopener` is appended, never replaced, on new-tab links: an
          // editor's CMS `rel` (e.g. "nofollow") must not be able to drop it —
          // reverse-tabnabbing protection is not an editorial decision.
          rel={
            [cta.rel?.trim(), cta.opens_in_new_tab && 'noopener noreferrer']
              .filter(Boolean)
              .join(' ') || undefined
          }
          {...(cta.is_download ? { download: '' } : {})}
        >
          {body}
        </a>
      ) : (
        <Link href={href} {...shared}>
          {body}
        </Link>
      )}
    </Button>
  )
}

export default SectionCta
