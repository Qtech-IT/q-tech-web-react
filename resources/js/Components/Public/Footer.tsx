import { Link } from '@inertiajs/react'
import { Mail, Phone } from 'lucide-react'

import { Container } from '@/Components/Public/Container'
import { LanguageSwitcher } from '@/Components/Public/LanguageSwitcher'
import type { PublicLanguage } from '@/Components/Public/LanguageSwitcher'
import { NavIcon, isRegisteredNavIcon } from '@/Components/Public/NavIcon'
import { SafeImage } from '@/Components/UI/SafeImage'
import { useTranslations } from '@/Hooks/useTranslations'
import { cn } from '@/Utils/helpers'
import { openCookiePreferences } from '@/Types/cookieConsent'
import type { FooterColumn, NavItem, SocialLink } from '@/Types/navigation'

export interface FooterProps {
  columns?: FooterColumn[] | undefined
  legal?: NavItem[] | undefined
  social?: SocialLink[] | undefined
  siteName?: string | undefined
  /** Pre-rendered copyright from the server (`copy_right_text` shared prop). */
  copyright?: string | undefined
  description?: string | undefined
  /** `company_logo`. Falls back to the site name set as a wordmark. */
  logo?: string | undefined
  /** `address` app setting. Newlines are rendered as lines. */
  address?: string | undefined
  phone?: string | undefined
  email?: string | undefined
  languages?: PublicLanguage[] | undefined
  currentLocale?: string | undefined
  className?: string | undefined
}

function isRouterLink(item: NavItem): boolean {
  if (item.newTab) return false
  if (item.type === 'external' || item.type === 'anchor') return false
  return Boolean(item.href?.startsWith('/'))
}

/**
 * Footer links animate an underline in from the left on hover rather than
 * switching colour. It is quieter, it reads as editorial, and it keeps the
 * resting state at one ink weight so the columns scan as columns.
 */
const itemClass = cn(
  'group/link relative inline-block text-fx-body-sm text-fx-ink-soft',
  'transition-colors duration-200 ease-fx motion-reduce:transition-none',
  'hover:text-fx-ink fx-focus rounded-fx-xs',
  'after:pointer-events-none after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px',
  'after:origin-left after:scale-x-0 after:bg-fx-accent',
  'after:transition-transform after:duration-300 after:ease-fx',
  'hover:after:scale-x-100 motion-reduce:after:transition-none'
)

function FooterLink({ item }: { item: NavItem }) {
  const { t } = useTranslations()
  if (!item.href) return null

  return isRouterLink(item) ? (
    <Link href={item.href} className={itemClass}>
      {t(item.label)}
    </Link>
  ) : (
    <a
      href={item.href}
      className={itemClass}
      {...(item.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
    >
      {t(item.label)}
      {item.newTab ? (
        <span className="sr-only"> {t('(opens in a new tab)')}</span>
      ) : null}
    </a>
  )
}

/** A titled column of links. One `<nav>` each, so each is addressable. */
function LinkColumn({
  id,
  title,
  children,
}: {
  id: string
  title: string
  children: React.ReactNode
}) {
  return (
    <nav aria-labelledby={`footer-${id}`}>
      <h2
        id={`footer-${id}`}
        className="mb-4 text-fx-body-sm font-semibold text-fx-ink"
      >
        {title}
      </h2>
      <ul className="flex flex-col gap-3">{children}</ul>
    </nav>
  )
}

/**
 * Site footer.
 *
 * DARK IN BOTH THEMES, ON PURPOSE. Every region rebinds the public ink, line
 * and surface tokens locally — the same technique `Section`'s `inverted`
 * variant uses — so everything nested inside (links, the language menu's
 * trigger, the cookie button) stays legible without a single `dark:` branch
 * or a prop drilled down to it. It also gives the closing CTA panel a
 * continuous dark field to sit on: `cta.final`'s `merge_footer` paints
 * `--fx-inverse` above this, and the two meet with no seam because they are
 * the same colour by construction rather than by coincidence.
 *
 * Every region is independently optional — a site with no social links, no
 * legal menu, no address and no columns still renders a valid footer rather
 * than an empty bordered box. That is the CMS-survivability rule from
 * CLAUDE.md applied at the region level, not just the field level.
 */
export function Footer({
  columns,
  legal,
  social,
  siteName,
  copyright,
  description,
  logo,
  address,
  phone,
  email,
  languages,
  currentLocale,
  className,
}: FooterProps) {
  const { t } = useTranslations()

  const brand = siteName?.trim() || 'QTECH'
  const year = new Date().getFullYear()

  const hasColumns = Boolean(columns && columns.length > 0)
  const hasLegal = Boolean(legal && legal.length > 0)
  const hasSocial = Boolean(social && social.length > 0)

  // The address is one setting, entered as free text. Split on newlines so an
  // editor's line breaks survive — never on commas, which appear inside a
  // single line ("Suite 116, Building 4") as often as between two.
  const addressLines = (address ?? '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line !== '')

  return (
    <footer
      data-slot="site-footer"
      // `relative z-10`: see the matching comment on `PublicLayout`'s
      // `<main>` — the site's fixed mesh backdrop is a positioned sibling and
      // paints above normal-flow content by default, so the footer needs the
      // same explicit stack to keep its own surface colour on top of it.
      className={cn(
        'relative z-10 mt-auto bg-fx-inverse text-fx-inverse-ink',
        // Local token rebinding. Without it, every descendant asking for
        // `--fx-ink` would get the PAGE's ink — near-black on this surface.
        '[--fx-canvas:var(--fx-inverse)]',
        '[--fx-ink:var(--fx-inverse-ink)]',
        '[--fx-ink-soft:color-mix(in_oklab,var(--fx-inverse-ink)_72%,transparent)]',
        '[--fx-ink-faint:color-mix(in_oklab,var(--fx-inverse-ink)_58%,transparent)]',
        '[--fx-line:color-mix(in_oklab,var(--fx-inverse-ink)_16%,transparent)]',
        '[--fx-line-strong:color-mix(in_oklab,var(--fx-inverse-ink)_28%,transparent)]',
        '[--fx-surface:color-mix(in_oklab,var(--fx-inverse-ink)_8%,transparent)]',
        '[--fx-surface-2:color-mix(in_oklab,var(--fx-inverse-ink)_12%,transparent)]',
        '[--fx-accent-text:var(--fx-accent-on-inverse)]',
        '[--fx-focus:var(--fx-accent-on-inverse)]',
        className
      )}
    >
      <Container className="py-fx-band-sm">
        <div
          className={cn(
            // `items-start`, not the default `stretch`: the brand column is
            // almost always shorter than the link columns, and a stretched
            // grid item turned that difference into a tall empty box under
            // the logo. Each column now ends where its content ends.
            'grid items-start gap-fx-stack-xl',
            hasColumns || hasLegal
              ? 'lg:grid-cols-[minmax(0,0.9fr)_minmax(0,2fr)]'
              : ''
          )}
        >
          {/* Brand, address and direct contacts */}
          <div className="flex flex-col gap-fx-stack-md">
            <Link
              href="/"
              className="fx-focus w-fit rounded-fx-sm"
              aria-label={t('Go to the homepage')}
            >
              {logo ? (
                <SafeImage
                  src={logo}
                  alt={brand}
                  className="h-8 w-auto max-w-[12rem] object-contain object-left"
                />
              ) : (
                <span className="text-fx-heading text-fx-ink">{brand}</span>
              )}
            </Link>

            {description ? (
              <p className="max-w-sm text-fx-body-sm text-pretty text-fx-ink-soft">
                {description}
              </p>
            ) : null}

            {addressLines.length > 0 ? (
              // `<address>` is for the CONTACT DETAILS of the page's owner,
              // which is exactly what this is — not for postal addresses in
              // general, which is the usual misuse.
              <address className="text-fx-body-sm text-fx-ink-soft not-italic">
                {addressLines.map((line, index) => (
                  <span key={index} className="block">
                    {line}
                  </span>
                ))}
              </address>
            ) : null}

            {phone || email ? (
              <dl className="flex flex-col gap-4 pt-1 sm:flex-row sm:gap-10">
                {phone ? (
                  <div>
                    <dt className="text-fx-meta uppercase text-fx-ink-faint">
                      {t('Phone number')}
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`tel:${phone.replace(/[^\d+]/g, '')}`}
                        className={cn(itemClass, 'flex items-center gap-2')}
                      >
                        <Phone aria-hidden="true" className="size-4" />
                        {phone}
                      </a>
                    </dd>
                  </div>
                ) : null}

                {email ? (
                  <div>
                    <dt className="text-fx-meta uppercase text-fx-ink-faint">
                      {t('Email')}
                    </dt>
                    <dd className="mt-1">
                      <a
                        href={`mailto:${email}`}
                        className={cn(itemClass, 'flex items-center gap-2')}
                      >
                        <Mail aria-hidden="true" className="size-4" />
                        {email}
                      </a>
                    </dd>
                  </div>
                ) : null}
              </dl>
            ) : null}

            {/*
             * The social row lives HERE rather than as a fourth link column.
             *
             * As a column it was a list of four words in a grid that already
             * had three, while the brand block beside it sat empty — and the
             * same four destinations were being announced twice on a page
             * that also carries them in the header. As icon buttons under the
             * brand they give that column the weight it was missing and read
             * the way a footer's social row is expected to.
             */}
            {hasSocial ? (
              <ul className="flex flex-wrap items-center gap-2 pt-1">
                {social!.map((link) => (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(':label (opens in a new tab)', {
                        label: link.label,
                      })}
                      className={cn(
                        'inline-flex size-10 min-w-10 items-center justify-center rounded-fx-pill px-2',
                        'border border-fx-line bg-fx-surface text-fx-ink-soft',
                        'transition-[color,border-color,transform] duration-200 ease-fx',
                        'hover:-translate-y-px hover:border-fx-accent-line hover:text-fx-ink',
                        'motion-reduce:transition-none motion-reduce:hover:translate-y-0',
                        'fx-focus'
                      )}
                    >
                      {/* An unregistered icon name must not produce an empty
                          but still focusable link — fall back to the label. */}
                      {isRegisteredNavIcon(link.icon) ? (
                        <NavIcon name={link.icon} className="size-[1.1rem]" />
                      ) : (
                        <span className="text-fx-meta font-medium">
                          {link.label}
                        </span>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>

          {/* Link columns: the CMS menus, then social, then legal */}
          {hasColumns || hasLegal ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-fx-stack-lg sm:grid-cols-3">
              {columns?.map((column) => (
                <LinkColumn key={column.id} id={column.id} title={t(column.title)}>
                  {column.items.map((item) => (
                    <li key={item.id}>
                      <FooterLink item={item} />
                    </li>
                  ))}
                </LinkColumn>
              ))}

              {hasLegal ? (
                <LinkColumn id="legal" title={t('Legal')}>
                  {legal!.map((item) => (
                    <li key={item.id}>
                      <FooterLink item={item} />
                    </li>
                  ))}

                  {/*
                   * Not a CMS menu item: it opens the consent panel rather
                   * than navigating, and a link that goes nowhere is not
                   * something an editor should have to model. It sits with
                   * the legal links because that is where people look for it.
                   */}
                  <li>
                    <button
                      type="button"
                      onClick={openCookiePreferences}
                      className={cn(itemClass, 'text-left')}
                    >
                      {t('Cookie settings')}
                    </button>
                  </li>
                </LinkColumn>
              ) : null}
            </div>
          ) : null}
        </div>

        {/* Bottom bar */}
        <div className="mt-fx-stack-xl flex flex-col-reverse gap-4 border-t border-fx-line pt-8 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-fx-meta text-fx-ink-faint">
            {copyright?.trim() || `© ${year} ${brand}. ${t('All rights reserved.')}`}
          </p>

          <div className="flex flex-wrap items-center gap-2">
            {/* When there is no legal column the cookie control has nowhere
                else to live, so it falls back to the bottom bar rather than
                disappearing with the column that usually holds it. */}
            {!hasLegal ? (
              <button
                type="button"
                onClick={openCookiePreferences}
                className={cn(itemClass, 'px-2.5 py-1.5')}
              >
                {t('Cookie settings')}
              </button>
            ) : null}

            {languages && currentLocale ? (
              <LanguageSwitcher
                languages={languages}
                currentCode={currentLocale}
              />
            ) : null}
          </div>
        </div>
      </Container>
    </footer>
  )
}

export default Footer
